
import os, re, json, hashlib, base64, io
from pathlib import Path
from werkzeug.utils import secure_filename
from datetime import datetime
from flask import Flask, request, jsonify, render_template, send_from_directory
from dotenv import load_dotenv
import fitz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

try:
    from google import genai
    from google.genai import types
except Exception:
    genai = None
    types = None

try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
except Exception:
    matplotlib = None
    plt = None

BASE = Path(__file__).resolve().parent
PDF_DIR = BASE / "PDF"
DATA_DIR = BASE / "data"
HISTORY_FILE = DATA_DIR / "history.json"
FIGURE_DIR = DATA_DIR / "figures"

# Load the key from this project's .env every time the server starts.
load_dotenv(dotenv_path=BASE / ".env", override=False)

app = Flask(__name__, static_folder="static", template_folder="templates")
CHUNKS, DOCS = [], []
VECTORIZER, MATRIX = None, None
INDEX_SIGNATURE = None


def clean(s):
    return re.sub(r"\s+", " ", str(s or "")).strip()


def strip_enumeration(s):
    # Removes source-outline markers: (i), (vii), ix., 1., etc.
    s = clean(s)
    return re.sub(r"^(?:\(?[ivxlcdm]+\)?|\(?\d+\)?)[\.\):\-]\s*", "", s, flags=re.I)


def metadata(text, filename):
    t = clean(text)
    low = t.lower()
    known_locations = [
        "Dakshin Gangotri", "Antarctic Convergence", "Novolazarevskaya",
        "Indira Mount", "Antarctica", "Antarctic Ocean", "Indian Ocean",
        "La Reunion", "Argentina", "Goa", "Southern Ocean"
    ]
    locations = [x for x in known_locations if x.lower() in low]
    coords = re.findall(
        r"\d+(?:\.\d+)?\s*°?\s*[NS]\s*,?\s*\d+(?:\.\d+)?\s*°?\s*[EW]", t, re.I
    )
    years = sorted(set(re.findall(r"\b(?:19|20)\d{2}\b", t)))
    params = [
        x for x in [
            "temperature", "surface temperature", "wind speed", "wind direction",
            "humidity", "aerosol", "zooplankton", "biomass", "organic carbon",
            "carbohydrates", "nitrogen", "phosphorus", "depth", "radio propagation",
            "VLF", "HF", "VHF", "ARNFS", "salinity", "pressure", "rainfall"
        ] if x.lower() in low
    ]
    domains = []
    for name, key in [
        ("Meteorology", "weather"), ("Radio Science", "radio"),
        ("Oceanography", "ocean"), ("Marine Biology", "zooplankton"),
        ("Sediment Science", "sediment"), ("Geology / Geophysics", "seamount"),
        ("Atmospheric Science", "aerosol")
    ]:
        if key in low:
            domains.append(name)
    expedition = (
        "First Indian Antarctic Expedition (1981–82)"
        if "first indian" in low and "expedition" in low else ""
    )
    return {
        "source_file": filename,
        "title": filename.rsplit(".", 1)[0].replace("_", " "),
        "locations": locations,
        "coordinates": coords,
        "years": years,
        "parameters": list(dict.fromkeys(params)),
        "domains": domains,
        "expedition": expedition
    }


def make_chunks(text, size=850, overlap=150):
    words = text.split()
    result = []
    step = max(1, size - overlap)
    for i in range(0, len(words), step):
        part = " ".join(words[i:i + size])
        if part:
            result.append(part)
        if i + size >= len(words):
            break
    return result


def pdf_signature():
    PDF_DIR.mkdir(exist_ok=True)
    return tuple((fp.name, fp.stat().st_size, fp.stat().st_mtime_ns) for fp in sorted(PDF_DIR.glob("*.pdf")))


def build_index():
    global CHUNKS, DOCS, VECTORIZER, MATRIX, INDEX_SIGNATURE
    CHUNKS, DOCS = [], []

    for fp in sorted(PDF_DIR.glob("*.pdf")):
        try:
            doc = fitz.open(fp)
            full_text = []
            for page_no, page in enumerate(doc):
                text = page.get_text("text")
                if not text.strip():
                    continue
                full_text.append(text)
                page_md = metadata(text, fp.name)
                page_md["page"] = page_no + 1

                for chunk_no, chunk in enumerate(make_chunks(text)):
                    CHUNKS.append({
                        "id": hashlib.sha1(
                            f"{fp.name}:{page_no}:{chunk_no}".encode()
                        ).hexdigest()[:12],
                        "text": clean(chunk),
                        "metadata": page_md.copy()
                    })

            DOCS.append({
                "file": fp.name,
                "pages": len(doc),
                "metadata": metadata("\n".join(full_text), fp.name)
            })
            doc.close()
        except Exception as exc:
            DOCS.append({"file": fp.name, "error": str(exc)})

    texts = [x["text"] for x in CHUNKS]
    if texts:
        VECTORIZER = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            max_features=60000
        )
        MATRIX = VECTORIZER.fit_transform(texts)
    else:
        VECTORIZER = MATRIX = None
    INDEX_SIGNATURE = pdf_signature()


def ensure_index_current():
    global INDEX_SIGNATURE
    current = pdf_signature()
    if current != INDEX_SIGNATURE:
        build_index()


def get_history():
    DATA_DIR.mkdir(exist_ok=True)
    if not HISTORY_FILE.exists():
        HISTORY_FILE.write_text("[]", encoding="utf-8")
    try:
        return json.loads(HISTORY_FILE.read_text(encoding="utf-8"))
    except Exception:
        return []


def save_history(query, answer):
    # Keep history compact: cached PDF figures remain available through their URL.
    persist = json.loads(json.dumps(answer))
    try:
        fig = persist.get("social_media", {}).get("figure")
        if isinstance(fig, dict):
            fig.pop("data_uri", None)
        viz = persist.get("visualization")
        if isinstance(viz, dict):
            viz.pop("chart_image", None)
    except Exception:
        pass
    history = get_history()
    history.insert(0, {
        "id": hashlib.sha1(
            (query + datetime.now().isoformat()).encode()
        ).hexdigest()[:12],
        "query": query,
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "answer": persist
    })
    HISTORY_FILE.write_text(
        json.dumps(history[:80], ensure_ascii=False, indent=2),
        encoding="utf-8"
    )


def query_tokens(query):
    return {
        x.lower() for x in re.findall(r"[A-Za-z0-9]+", query)
        if len(x) > 2
    }


def retrieve(query, k=14):
    ensure_index_current()
    if not CHUNKS or MATRIX is None:
        return []

    qlow = query.lower()
    qt = query_tokens(query)
    scores = cosine_similarity(VECTORIZER.transform([query]), MATRIX)[0]
    candidates = []

    for i, raw_score in enumerate(scores):
        item = CHUNKS[i]
        md = item["metadata"]
        text_low = item["text"].lower()

        # Hybrid lexical + metadata scoring.
        overlap = sum(1 for token in qt if token in text_low)
        score = float(raw_score) + min(0.25, overlap * 0.025)

        for value in md["locations"] + md["parameters"] + md["years"]:
            if str(value).lower() in qlow:
                score += 0.10

        if md["source_file"].lower() in qlow:
            score += 0.25

        if score > 0.005:
            candidates.append((score, item))

    candidates.sort(key=lambda x: x[0], reverse=True)

    # If the query is unusual, still provide the strongest corpus candidates
    # instead of returning an empty answer.
    if not candidates:
        top = sorted(
            [(float(s), CHUNKS[i]) for i, s in enumerate(scores)],
            key=lambda x: x[0],
            reverse=True
        )
        candidates = top[:k]

    return [(round(score, 4), item) for score, item in candidates[:k]]


def evidence_text(hits):
    return "\n\n".join(
        f"""EVIDENCE {n}
Source file: {item["metadata"]["source_file"]}
Page: {item["metadata"].get("page")}
Location metadata: {", ".join(item["metadata"]["locations"]) or "not detected"}
Year metadata: {", ".join(item["metadata"]["years"]) or "not detected"}
Parameters: {", ".join(item["metadata"]["parameters"]) or "not detected"}
Evidence text:
{item["text"]}"""
        for n, (_, item) in enumerate(hits, 1)
    )


def empty_visualization(note="No explicit numerical dataset was found in the retrieved evidence."):
    return {
        "enabled": False,
        "type": "none",
        "title": "",
        "x_label": "",
        "y_label": "",
        "labels": [],
        "values": [],
        "x_values": [],
        "series": [],
        "unit": "",
        "note": note
    }



def extract_numeric_visualization(hits):
    """Build a conservative plot dataset directly from retrieved PDF text.
    This is a fallback for cases where the LLM notices the measurements but does not
    return a visualization object. It never invents values: every plotted value is
    copied from text extracted from the PDF.
    """
    if not hits:
        return None

    # Prefer repeated number+unit observations because they are the safest things to plot.
    unit_pat = r"(?:km|m|cm|mm|nm|Hz|kHz|MHz|GHz|dB|°C|C|K|%|percent|h|hr|hours?|min|s|sec|days?|knots?|kt)"
    pat = re.compile(r"(?<![A-Za-z0-9])(-?\d+(?:[.,]\d+)?)(?:\s*)(" + unit_pat + r")\b", re.I)
    observations=[]
    for _, item in hits:
        text=item.get("text","")
        for m in pat.finditer(text):
            try:
                val=float(m.group(1).replace(',',''))
            except ValueError:
                continue
            unit=m.group(2)
            # Use a short nearby source phrase as a truthful label.
            before=text[max(0,m.start()-70):m.start()]
            before=re.sub(r"\s+"," ",before).strip(" .,:;()-")
            words=before.split()
            label=" ".join(words[-6:]) if words else f"Observation {len(observations)+1}"
            observations.append((label, val, unit))

    if len(observations) < 2:
        # Second conservative fallback: repeated standalone numerical values in the
        # same evidence block. This catches tables whose units appear only in a header.
        for _, item in hits:
            text=item.get("text","")
            nums=[]
            for m in re.finditer(r"(?<![A-Za-z0-9])(-?\d+(?:[.,]\d+)?)(?![A-Za-z0-9])", text):
                try: nums.append(float(m.group(1).replace(',','')))
                except ValueError: pass
            if len(nums)>=3:
                observations=[(f"Observation {i+1}",v,"") for i,v in enumerate(nums[:20])]
                break

    if len(observations) < 2:
        return None

    # Keep one unit family when possible; mixing km and MHz in one graph is misleading.
    counts={}
    for _,_,u in observations: counts[u.lower()]=counts.get(u.lower(),0)+1
    unit=max(counts, key=counts.get)
    selected=[x for x in observations if x[2].lower()==unit]
    if len(selected)<2:
        selected=observations[:20]
        unit=selected[0][2] if selected and all(x[2].lower()==selected[0][2].lower() for x in selected) else ""

    # De-duplicate identical label/value pairs.
    seen=set(); clean=[]
    for label,val,u in selected:
        key=(label.lower(),val)
        if key not in seen:
            seen.add(key); clean.append((label,val,u))
    if len(clean)<2:
        return None

    labels=[x[0] for x in clean[:20]]
    values=[x[1] for x in clean[:20]]
    title="Numerical measurements reported in the retrieved PDF evidence"
    return {
        "enabled": True, "type": "bar", "title": title,
        "x_label": "Observation", "y_label": "Measured value",
        "labels": labels, "values": values, "x_values": labels,
        "series": [], "unit": unit,
        "note": "Visualization generated directly from numerical values explicitly extracted from the retrieved PDF evidence."
    }


def ensure_visualization(answer, hits):
    viz=answer.get("visualization") or {}
    has_data=bool(viz.get("enabled") and (viz.get("values") or viz.get("series") or viz.get("labels")))
    if not has_data:
        extracted=extract_numeric_visualization(hits)
        if extracted:
            answer["visualization"]=extracted
    return answer


def attach_matplotlib_chart(answer):
    """Render the answer's verified numerical dataset with Matplotlib."""
    viz = answer.get("visualization") or {}
    if not viz.get("enabled") or plt is None:
        return answer
    try:
        vtype = str(viz.get("type") or "bar").lower()
        labels = list(viz.get("labels") or [])
        values = list(viz.get("values") or [])
        x_values = list(viz.get("x_values") or labels)
        unit = str(viz.get("unit") or "")
        title = str(viz.get("title") or "Research data visualization")
        fig, ax = plt.subplots(figsize=(9, 4.8), dpi=150)

        if vtype == "pie" and labels and values:
            nums = [float(x) for x in values]
            ax.pie(nums, labels=labels, autopct="%1.1f%%", startangle=90)
            ax.set_title(title)
        elif vtype == "histogram" and values:
            nums = [float(x) for x in values]
            ax.hist(nums, bins=min(12, max(3, len(nums)//2)))
            ax.set_title(title)
            ax.set_xlabel(viz.get("x_label") or "Value")
            ax.set_ylabel(viz.get("y_label") or "Frequency")
        elif vtype in ("line", "scatter", "area"):
            ys = [float(x) for x in values]
            xs = x_values[:len(ys)] if x_values else list(range(1, len(ys)+1))
            if vtype == "scatter":
                ax.scatter(xs, ys)
            elif vtype == "area":
                ax.plot(xs, ys, marker="o")
                ax.fill_between(range(len(ys)), ys, alpha=0.18)
                ax.set_xticks(range(len(xs)))
                ax.set_xticklabels([str(x) for x in xs], rotation=35, ha="right")
            else:
                ax.plot(xs, ys, marker="o")
                if len(xs) <= 20:
                    ax.set_xticks(range(len(xs)))
                    ax.set_xticklabels([str(x) for x in xs], rotation=35, ha="right")
            ax.set_title(title)
            ax.set_xlabel(viz.get("x_label") or "Observation")
            ax.set_ylabel((viz.get("y_label") or "Value") + (f" ({unit})" if unit else ""))
            ax.grid(True, alpha=0.22)
        else:
            pairs = [(str(labels[i]), float(values[i])) for i in range(min(len(labels), len(values)))]
            if not pairs:
                plt.close(fig)
                return answer
            labs, nums = zip(*pairs)
            ax.bar(range(len(nums)), nums)
            ax.set_xticks(range(len(nums)))
            ax.set_xticklabels(labs, rotation=35, ha="right")
            ax.set_title(title)
            ax.set_xlabel(viz.get("x_label") or "Category")
            ax.set_ylabel((viz.get("y_label") or "Value") + (f" ({unit})" if unit else ""))
            ax.grid(axis="y", alpha=0.22)

        fig.tight_layout()
        buf = io.BytesIO()
        fig.savefig(buf, format="png", bbox_inches="tight")
        plt.close(fig)
        raw = buf.getvalue()
        FIGURE_DIR.mkdir(parents=True, exist_ok=True)
        digest = hashlib.sha1(json.dumps(viz, sort_keys=True, default=str).encode()).hexdigest()[:16]
        chart_name = f"chart_{digest}.png"
        (FIGURE_DIR / chart_name).write_bytes(raw)
        answer["visualization"]["chart_image"] = "data:image/png;base64," + base64.b64encode(raw).decode("ascii")
        answer["visualization"]["chart_url"] = f"/api/figure/{chart_name}"
        answer["visualization"]["renderer"] = "matplotlib"
    except Exception as exc:
        print("Matplotlib chart error:", repr(exc))
    return answer


def social_request(query):
    low = query.lower()
    markers = [
        "social media", "social-media", "social content", "social post",
        "twitter", " x post", "instagram", "facebook", "linkedin",
        "threads", "caption", "post for", "generate content for social"
    ]
    return any(m in low for m in markers)


def social_research_query(query):
    """Remove social-media instructions before PDF retrieval so research terms dominate."""
    q=re.sub(r"(?i)\b(generate|create|write|make|give|prepare|produce)\b.*?\b(social media|social content|social post|posts?)\b", "", query)
    q=re.sub(r"(?i)\b(for|on)\s+(twitter|x|facebook|instagram|linkedin|threads)(?:\s*(?:,|and|&)?\s*(twitter|x|facebook|instagram|linkedin|threads))*", "", q)
    q=re.sub(r"(?i)\b(social media|social-media|social content|social post|twitter|instagram|facebook|linkedin|threads)\b", "", q)
    q=clean(q)
    return q or query


def best_pdf_figure(hits):
    """Extract/cache the most useful figure from the most relevant PDF/page."""
    FIGURE_DIR.mkdir(parents=True, exist_ok=True)
    def cache_figure(raw, mime, source_file, page_no, width, height, kind):
        digest = hashlib.sha1(f"{source_file}:{page_no}:{width}:{height}".encode()).hexdigest()[:16]
        ext = "jpg" if mime == "image/jpeg" else "png"
        filename = f"{digest}.{ext}"
        path = FIGURE_DIR / filename
        if not path.exists():
            path.write_bytes(raw)
        return {
            "data_uri": f"data:{mime};base64," + base64.b64encode(raw).decode("ascii"),
            "url": f"/api/figure/{filename}",
            "source_file": source_file,
            "page": page_no,
            "width": width,
            "height": height,
            "kind": kind
        }
    for _, item in hits[:6]:
        md = item.get("metadata", {})
        filename = md.get("source_file")
        page_no = int(md.get("page") or 1)
        if not filename:
            continue
        path = PDF_DIR / filename
        if not path.exists():
            continue
        try:
            doc = fitz.open(path)
            page = doc[page_no - 1] if 0 < page_no <= len(doc) else doc[0]
            candidates = []
            for img in page.get_images(full=True):
                xref = img[0]
                try:
                    pix = fitz.Pixmap(doc, xref)
                    if pix.width < 120 or pix.height < 120:
                        continue
                    if pix.n - pix.alpha > 3:
                        pix = fitz.Pixmap(fitz.csRGB, pix)
                    raw = pix.tobytes("jpg", jpg_quality=88)
                    candidates.append((pix.width * pix.height, raw, pix.width, pix.height))
                    pix = None
                except Exception:
                    continue
            if candidates:
                _, raw, width, height = max(candidates, key=lambda x: x[0])
                doc.close()
                return cache_figure(raw, "image/jpeg", filename, page_no, width, height, "PDF figure")

            # If the retrieved page has no image object, scan the same paper for the
            # largest embedded research figure before falling back to a page snapshot.
            paper_candidates=[]
            for scan_no in range(len(doc)):
                scan_page=doc[scan_no]
                for img in scan_page.get_images(full=True):
                    try:
                        pix2=fitz.Pixmap(doc,img[0])
                        if pix2.width<180 or pix2.height<120: continue
                        if pix2.n-pix2.alpha>3: pix2=fitz.Pixmap(fitz.csRGB,pix2)
                        raw2=pix2.tobytes("jpg",jpg_quality=88)
                        paper_candidates.append((pix2.width*pix2.height,raw2,pix2.width,pix2.height,scan_no+1))
                    except Exception:
                        continue
            if paper_candidates:
                _,raw2,w2,h2,p2=max(paper_candidates,key=lambda x:x[0])
                doc.close()
                return cache_figure(raw2,"image/jpeg",filename,p2,w2,h2,"PDF figure")

            # Fallback: a clean page snapshot if the PDF has no extractable image object.
            pix = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
            raw = pix.tobytes("png")
            width, height = pix.width, pix.height
            doc.close()
            return cache_figure(raw, "image/png", filename, page_no, width, height, "PDF page snapshot")
        except Exception as exc:
            print("PDF figure extraction error:", repr(exc))
    return None


def fallback_social(query, hits):
    if not hits:
        return {"platforms": [], "figure": None, "note": "No relevant PDF evidence was retrieved."}
    evidence = clean(hits[0][1].get("text", ""))
    # Keep fallback concise and source-grounded when Gemini is unavailable.
    core = evidence[:520]
    hashtags = "#Antarctica #PolarScience #NCPOR #MOES #Research"
    return {
        "platforms": [
            {"platform": "X / Twitter", "content": (core[:220] + "…" if len(core) > 220 else core) + " " + hashtags},
            {"platform": "Facebook", "content": f"Antarctic research insight: {core} {hashtags}"},
            {"platform": "Instagram", "content": f"❄️ Antarctic research insight\n\n{core}\n\n{hashtags}"},
            {"platform": "LinkedIn", "content": f"Research highlight from the Attrex Antarctic PDF collection:\n\n{core}\n\nSource-grounded insight for science communication. {hashtags}"},
            {"platform": "Threads", "content": f"Polar research highlight: {core} {hashtags}"}
        ],
        "figure": best_pdf_figure(hits),
        "note": "Social copy is grounded in the retrieved PDF evidence."
    }


def generate_social_content(query, hits):
    figure = best_pdf_figure(hits)
    key = os.getenv("GEMINI_API_KEY", "").strip()
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
    if not key:
        return fallback_social(query, hits)

    evidence = evidence_text(hits)
    prompt = f"""
You are creating science communication content for Attrex, an Antarctic research portal.
Use ONLY the retrieved PDF evidence below. Do not invent facts, numbers, dates, places,
scientists, claims, or conclusions that are not supported by the evidence.

Create platform-specific social media copy for the research topic requested by the user.
Return ONLY JSON with this exact shape:
{{
  "platforms": [
    {{"platform":"X / Twitter","content":"..."}},
    {{"platform":"Facebook","content":"..."}},
    {{"platform":"Instagram","content":"..."}},
    {{"platform":"LinkedIn","content":"..."}},
    {{"platform":"Threads","content":"..."}}
  ],
  "note":"..."
}}

Rules:
- X/Twitter: concise, target <= 280 characters, include 2-4 relevant hashtags.
- Facebook: informative and readable, 1-2 short paragraphs, 3-5 hashtags.
- Instagram: engaging caption, short paragraphs, 5-8 relevant hashtags.
- LinkedIn: professional science/knowledge-sharing tone, 1-3 short paragraphs, 3-6 hashtags.
- Threads: concise and conversational, <= 500 characters, 2-5 hashtags.
- Do not claim that a result is new, groundbreaking, or definitive unless the evidence says so.
- Mention the research source naturally when supported.

USER REQUEST:
{query}

RETRIEVED PDF EVIDENCE:
{evidence}
"""
    try:
        client = genai.Client(api_key=key) if genai is not None else None
        if client is not None and types is not None:
            contents = [prompt]
            if figure and figure.get("data_uri"):
                raw = base64.b64decode(figure["data_uri"].split(",", 1)[1])
                mime = "image/jpeg" if figure["data_uri"].startswith("data:image/jpeg") else "image/png"
                contents = [types.Part.from_bytes(data=raw, mime_type=mime), prompt + "\nA PDF figure is attached. Use it only to help describe the research visual if useful."]
            response = client.models.generate_content(
                model=model,
                contents=contents,
                config=types.GenerateContentConfig(response_mime_type="application/json", temperature=0.25, max_output_tokens=3500)
            )
            data = json.loads(clean_json_text(response.text))
            platforms = data.get("platforms") or []
            if platforms:
                return {"platforms": platforms, "figure": figure, "note": data.get("note") or "Social copy is grounded in the retrieved PDF evidence."}
    except Exception as exc:
        print("Social SDK generation error; trying REST fallback:", repr(exc))

    # REST fallback for installations where google-genai is unavailable or incompatible.
    try:
        import urllib.request
        url=("https://generativelanguage.googleapis.com/v1beta/models/"+model+":generateContent?key="+key)
        parts=[{"text":prompt}]
        if figure and figure.get("data_uri"):
            raw=base64.b64decode(figure["data_uri"].split(",",1)[1])
            mime="image/jpeg" if figure["data_uri"].startswith("data:image/jpeg") else "image/png"
            parts=[{"inline_data":{"mime_type":mime,"data":base64.b64encode(raw).decode("ascii")}}, {"text":prompt+"\nA PDF figure is attached. Use it only to help describe the research visual if useful."}]
        body=json.dumps({"contents":[{"parts":parts}],"generationConfig":{"temperature":0.25,"maxOutputTokens":3500,"responseMimeType":"application/json"}}).encode("utf-8")
        req=urllib.request.Request(url,data=body,headers={"Content-Type":"application/json"},method="POST")
        with urllib.request.urlopen(req,timeout=90) as resp: payload=json.loads(resp.read().decode("utf-8"))
        text=payload["candidates"][0]["content"]["parts"][0]["text"]
        data=json.loads(clean_json_text(text))
        platforms=data.get("platforms") or []
        if platforms:
            return {"platforms":platforms,"figure":figure,"note":data.get("note") or "Social copy is grounded in the retrieved PDF evidence."}
    except Exception as exc:
        print("Social REST generation error:", repr(exc))
    out = fallback_social(query, hits)
    out["figure"] = figure or out.get("figure")
    return out


def fallback_answer(hits):
    if not hits:
        return {
            "summary": "The indexed PDF collection does not contain enough directly relevant evidence for this question.",
            "key_points": ["The retrieved collection does not specify this point."] * 10,
            "visualization": empty_visualization(),
            "metadata": {
                "source": "No matching source",
                "location": "Not specified",
                "time_period": "Not specified",
                "subject": "Not specified",
                "important_finding": "Not specified",
                "data_evidence": "Not specified",
                "cause_effect": "Not specified",
                "scientific_significance": "Not specified",
                "related_sources": [],
                "confidence_coverage": "No directly relevant evidence retrieved."
            },
            "sources": []
        }

    sentences = []
    for _, item in hits:
        for sentence in re.split(r"(?<=[.!?])\s+", item["text"]):
            sentence = strip_enumeration(sentence)
            if len(sentence) > 35:
                sentences.append(sentence)

    # Build a concise extractive answer when Gemini is unavailable.
    # The old fallback simply took the first ten source sentences, which made
    # the UI look like a pasted PDF paragraph. Rank sentences by query relevance
    # and select diverse, information-rich sentences instead.
    unique = list(dict.fromkeys(sentences))
    query = getattr(fallback_answer, "_last_query", "") or ""
    qtokens = query_tokens(query)
    ranked = []
    for idx, sentence in enumerate(unique):
        stokens = set(re.findall(r"[A-Za-z0-9]+", sentence.lower()))
        overlap = len(qtokens & stokens)
        length_bonus = 1.0 if 55 <= len(sentence) <= 260 else 0.0
        score = overlap * 2.0 + length_bonus - (max(0, len(sentence) - 300) / 500.0)
        ranked.append((score, idx, sentence))
    ranked.sort(key=lambda x: (-x[0], x[1]))

    selected = []
    seen_terms = []
    for _, _, sentence in ranked:
        terms = set(re.findall(r"[A-Za-z0-9]+", sentence.lower()))
        if any(len(terms & prev) >= max(3, int(0.55 * min(len(terms), len(prev)))) for prev in seen_terms):
            continue
        selected.append(sentence)
        seen_terms.append(terms)
        if len(selected) >= 8:
            break

    if not selected:
        selected = unique[:8]
    summary = " ".join(selected)
    # Keep the fallback summary compact enough to read like an answer, not a PDF dump.
    if len(summary) > 1500:
        summary = summary[:1500].rsplit(" ", 1)[0] + "."

    key_candidates = [x[2] for x in ranked if x[2] not in selected]
    key_points = (selected[:3] + key_candidates)[:10]
    while len(key_points) < 10:
        key_points.append("The retrieved evidence does not specify this point.")

    md = hits[0][1]["metadata"]
    return {
        "summary": summary[:3200],
        "key_points": key_points,
        "visualization": empty_visualization(),
        "metadata": {
            "source": md["title"],
            "location": ", ".join(md["locations"]) or "Not specified",
            "time_period": ", ".join(md["years"]) or md["expedition"] or "Not specified",
            "subject": ", ".join(md["domains"]) or "Antarctic scientific research",
            "important_finding": key_points[0],
            "data_evidence": ", ".join(md["parameters"]) or "Not specified",
            "cause_effect": "Only relationships explicitly present in the retrieved evidence are reported.",
            "scientific_significance": "Not explicitly stated in the retrieved evidence.",
            "related_sources": list(dict.fromkeys(
                x[1]["metadata"]["source_file"] for x in hits
            )),
            "confidence_coverage": f"{len(hits)} evidence chunks retrieved from the indexed PDFs."
        },
        "sources": [
            {
                "source_file": item["metadata"]["source_file"],
                "page": item["metadata"].get("page"),
                "relevance": score,
                "evidence_note": "Retrieved from the local PDF collection."
            }
            for score, item in hits
        ]
    }


def clean_json_text(text):
    text = (text or "").strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.I)
        text = re.sub(r"\s*```$", "", text)
    return text.strip()


def ask_gemini(query, hits):
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()

    if not api_key:
        return None

    prompt = f"""
You are the Attrex scientific research assistant for NCPOR/MOES Antarctic research.

STRICT SOURCE RULE:
Use ONLY the retrieved PDF evidence below. Do not use general knowledge. Do not invent,
estimate, interpolate, combine unsupported values, or silently fill missing information.

OUTPUT:
Return ONLY valid JSON with these exact top-level keys:
summary, key_points, visualization, metadata, sources

SUMMARY:
- Write 7-10 concise, information-dense sentences in ONE paragraph.
- Target about 700-1100 characters so the answer is easy to scan.
- It should directly answer the user's question, synthesize the evidence, and avoid copying long source passages.
- Remove all source enumeration markers such as (i), (ii), (vii), (viii), (ix), 1., etc.
- Do not begin sentences with list numbers.

KEY_POINTS:
- Exactly 10 concise points answering the user's question.
- Plain strings only.
- Do NOT put numbers, bullets, roman numerals, or labels at the beginning.
- The web interface will display them as bullet points.

VISUALIZATION:
- Create a plot whenever the retrieved evidence contains an explicit numerical dataset,
  table, repeated measurements, ranges, comparisons, time series, coordinates, percentages,
  category counts, or other values that can be plotted safely.
- Never invent or estimate values.
- Select the most appropriate type:
  "bar", "line", "scatter", "pie", "histogram", "area", or "table".
- For bar/pie/histogram use labels + values.
- For line/scatter use x_values + values, or series for multiple series.
- If several variables are explicitly available, choose the clearest meaningful comparison.
- If there is genuinely no plot-worthy numerical dataset, set enabled=false.
- The UI should never mention implementation details.

METADATA:
Exactly these 10 fields:
source
location
time_period
subject
important_finding
data_evidence
cause_effect
scientific_significance
related_sources
confidence_coverage

SOURCES:
Provide source_file and page whenever available.

USER QUESTION:
{query}

RETRIEVED PDF EVIDENCE:
{evidence_text(hits)}
"""

    try:
        result = None

        # Preferred path: official google-genai SDK.
        if genai is not None and types is not None:
            try:
                client = genai.Client(api_key=api_key)
                config = types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.15,
                    max_output_tokens=7000
                )
                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=config
                )
                result = json.loads(clean_json_text(response.text))
            except Exception as sdk_exc:
                print("Gemini SDK request error; trying REST fallback:", repr(sdk_exc))

        # REST fallback keeps the app working if the installed SDK is missing,
        # outdated, or has a compatibility problem.
        if result is None:
            import urllib.request
            import urllib.error
            url = (
                "https://generativelanguage.googleapis.com/v1beta/models/"
                + model + ":generateContent?key=" + api_key
            )
            body = json.dumps({
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.15,
                    "maxOutputTokens": 7000,
                    "responseMimeType": "application/json"
                }
            }).encode("utf-8")
            req = urllib.request.Request(
                url, data=body, headers={"Content-Type": "application/json"}, method="POST"
            )
            with urllib.request.urlopen(req, timeout=90) as resp:
                payload = json.loads(resp.read().decode("utf-8"))
            text = payload["candidates"][0]["content"]["parts"][0]["text"]
            result = json.loads(clean_json_text(text))

        result["summary"] = strip_enumeration(result.get("summary", ""))
        result["key_points"] = [
            strip_enumeration(x) for x in result.get("key_points", [])
            if clean(x)
        ][:10]
        while len(result["key_points"]) < 10:
            result["key_points"].append("The retrieved evidence does not specify this point.")

        # Normalize visualization.
        viz = result.get("visualization") or {}
        if not viz.get("enabled"):
            result["visualization"] = empty_visualization(
                viz.get("note") or "No explicit numerical dataset was found in the retrieved evidence."
            )
        else:
            viz.setdefault("type", "bar")
            viz.setdefault("labels", [])
            viz.setdefault("values", [])
            viz.setdefault("x_values", [])
            viz.setdefault("series", [])
            viz.setdefault("unit", "")
            viz.setdefault("note", "Values are taken directly from retrieved PDF evidence.")

        return result
    except Exception as exc:
        # Server log contains the technical error; the user-facing answer stays clean.
        print("Gemini request error:", repr(exc))
        return None


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/api/status")
def status():
    return jsonify({
        "pdf_count": len(DOCS),
        "pdf_files": [x.get("file", "") for x in DOCS if x.get("file")],
        "chunk_count": len(CHUNKS),
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY", "").strip()),
        "model": os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    })


@app.get("/api/history")
def api_history():
    return jsonify(get_history())


@app.delete("/api/history")
def api_clear_history():
    HISTORY_FILE.write_text("[]", encoding="utf-8")
    return jsonify({"ok": True})




@app.get("/api/figure/<path:filename>")
def serve_figure(filename):
    safe = secure_filename(filename)
    if not safe or safe != filename or safe.rsplit(".", 1)[-1].lower() not in {"jpg", "png"}:
        return jsonify({"error": "Invalid figure filename."}), 400
    target = FIGURE_DIR / safe
    if not target.exists():
        return jsonify({"error": "Figure not found."}), 404
    return send_from_directory(FIGURE_DIR, safe)


@app.get("/api/pdf/<path:filename>")
def serve_pdf(filename):
    safe = secure_filename(filename)
    if not safe or safe != filename:
        return jsonify({"error": "Invalid PDF filename."}), 400
    target = PDF_DIR / safe
    if not target.exists() or target.suffix.lower() != ".pdf":
        return jsonify({"error": "PDF not found."}), 404
    return send_from_directory(PDF_DIR, safe, mimetype="application/pdf", as_attachment=False)


@app.post("/api/upload-pdf")
def upload_pdf():
    files = request.files.getlist("files")
    if not files:
        return jsonify({"error": "Please select at least one PDF research paper."}), 400

    PDF_DIR.mkdir(exist_ok=True)
    saved = []
    rejected = []
    for uploaded in files:
        original = (uploaded.filename or "").strip()
        if not original:
            continue
        safe = secure_filename(original)
        if not safe.lower().endswith(".pdf"):
            rejected.append({"file": original, "reason": "Only PDF files are supported."})
            continue
        try:
            uploaded.save(PDF_DIR / safe)
            saved.append(safe)
        except Exception as exc:
            rejected.append({"file": original, "reason": str(exc)})

    if not saved:
        return jsonify({"error": "No PDF research paper was added.", "rejected": rejected}), 400

    build_index()
    return jsonify({
        "ok": True,
        "added": saved,
        "rejected": rejected,
        "pdf_count": len(DOCS),
        "chunk_count": len(CHUNKS)
    })


@app.delete("/api/history/<history_id>")
def api_delete_history(history_id):
    history = [x for x in get_history() if str(x.get("id")) != str(history_id)]
    HISTORY_FILE.write_text(json.dumps(history[:80], ensure_ascii=False, indent=2), encoding="utf-8")
    return jsonify({"ok": True, "remaining": len(history)})


@app.delete("/api/pdf/<path:filename>")
def delete_pdf(filename):
    safe = secure_filename(filename)
    if not safe or safe != filename or not safe.lower().endswith(".pdf"):
        return jsonify({"error": "Invalid PDF filename."}), 400
    target = PDF_DIR / safe
    if not target.exists():
        return jsonify({"error": "PDF not found."}), 404
    try:
        target.unlink()
        build_index()
        return jsonify({"ok": True, "deleted": safe, "pdf_count": len(DOCS), "chunk_count": len(CHUNKS)})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.get("/api/pdf-meta/<path:filename>")
def pdf_meta(filename):
    safe = secure_filename(filename)
    if not safe or safe != filename or not safe.lower().endswith(".pdf"):
        return jsonify({"error": "Invalid PDF filename."}), 400
    item = next((x for x in DOCS if x.get("file") == safe), None)
    if not item:
        return jsonify({"error": "PDF not found."}), 404
    chunk_count = sum(1 for c in CHUNKS if c["metadata"].get("source_file") == safe)
    return jsonify({"ok": True, "file": safe, "pages": item.get("pages", 0), "metadata": item.get("metadata", {}), "chunk_count": chunk_count})


@app.post("/api/export-answer")
def export_answer():
    payload = request.get_json(silent=True) or {}
    answer = payload.get("answer") or {}
    query = clean(payload.get("query") or answer.get("query") or "Attrex Research Answer")
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, ListFlowable, ListItem
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors
        from reportlab.lib.enums import TA_LEFT
        import io
        buf = io.BytesIO()
        doc = SimpleDocTemplate(buf, pagesize=A4, rightMargin=42, leftMargin=42, topMargin=42, bottomMargin=42)
        styles = getSampleStyleSheet()
        body = ParagraphStyle("Body", parent=styles["BodyText"], fontSize=9.5, leading=14, spaceAfter=8)
        small = ParagraphStyle("Small", parent=body, fontSize=8, textColor=colors.HexColor("#687181"))
        story=[Paragraph("Attrex — Antarctic Research Answer", styles["Title"]), Paragraph(f"Question: {query}", body), Spacer(1,8)]
        story += [Paragraph("Summary", styles["Heading2"]), Paragraph(answer.get("summary", ""), body)]
        story += [Paragraph("10 Key Points", styles["Heading2"])]
        points=answer.get("key_points") or []
        story += [ListFlowable([ListItem(Paragraph(str(x), body)) for x in points[:10]], bulletType="bullet", leftIndent=16)]
        viz=answer.get("visualization") or {}
        if viz.get("enabled"):
            story += [Spacer(1,8), Paragraph("Visualization Data", styles["Heading2"])]
            labels=viz.get("labels") or []
            values=viz.get("values") or []
            rows=[["Category","Value"]]+[[str(a),str(b)] for a,b in zip(labels,values)]
            if len(rows)>1:
                t=Table(rows, repeatRows=1)
                t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),colors.HexColor("#eeeafc")),("GRID",(0,0),(-1,-1),0.3,colors.HexColor("#dfe2ea")),("FONTSIZE",(0,0),(-1,-1),8),("VALIGN",(0,0),(-1,-1),"TOP")]))
                story += [t]
        social=answer.get("social_media") or {}
        platforms=social.get("platforms") or []
        if platforms:
            story += [Spacer(1,8), Paragraph("Social Media Content", styles["Heading2"])]
            for post in platforms:
                story += [Paragraph(f"<b>{post.get('platform','Social Media')}:</b>", body), Paragraph(str(post.get("content", "")), body)]
        m=answer.get("metadata") or {}
        story += [Spacer(1,8), Paragraph("Research Metadata", styles["Heading2"])]
        labels=[("Source","source"),("Location","location"),("Time / Period","time_period"),("Subject","subject"),("Important Finding","important_finding"),("Data / Evidence","data_evidence"),("Cause / Effect","cause_effect"),("Scientific Significance","scientific_significance"),("Related Sources","related_sources"),("Confidence / Coverage","confidence_coverage")]
        for lab,key in labels:
            val=m.get(key,"")
            if isinstance(val,list): val=" · ".join(map(str,val))
            story += [Paragraph(f"<b>{lab}:</b> {val or 'Not specified'}", body)]
        story += [Paragraph("Source Evidence", styles["Heading2"])]
        for src in answer.get("sources") or []:
            story += [Paragraph(f"{src.get('source_file','')} · page {src.get('page','')} · relevance {src.get('relevance','')}", small), Paragraph(src.get("evidence_note", ""), small)]
        doc.build(story)
        from flask import send_file
        buf.seek(0)
        return send_file(buf, mimetype="application/pdf", as_attachment=True, download_name="attrex-research-answer.pdf")
    except Exception as exc:
        return jsonify({"error": f"Could not export answer: {exc}"}), 500


@app.post("/api/social-content")
def api_social_content():
    payload = request.get_json(silent=True) or {}
    query = clean(payload.get("query", ""))
    if not query:
        return jsonify({"error": "Please enter a research topic."}), 400
    research_query = social_research_query(query)
    hits = retrieve(research_query)
    if not hits:
        return jsonify({"error": "No relevant PDF evidence was found for this topic."}), 404
    return jsonify(generate_social_content(query, hits))


@app.post("/api/reindex")
def api_reindex():
    build_index()
    return jsonify({"ok": True, "pdf_count": len(DOCS), "chunk_count": len(CHUNKS)})


@app.post("/api/test-gemini")
def api_test_gemini():
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        return jsonify({"ok": False, "reason": "API key not configured"}), 400
    if genai is None:
        return jsonify({"ok": False, "reason": "google-genai package is not installed"}), 500
    try:
        client = genai.Client(api_key=key)
        response = client.models.generate_content(
            model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            contents="Reply with exactly the word OK.",
            config=types.GenerateContentConfig(temperature=0, max_output_tokens=10)
        )
        return jsonify({"ok": True, "response": response.text.strip()})
    except Exception as exc:
        return jsonify({"ok": False, "reason": str(exc)}), 500


@app.post("/api/ask")
def api_ask():
    payload = request.get_json(silent=True) or {}
    query = clean(payload.get("query", ""))
    if not query:
        return jsonify({"error": "Please enter a research question."}), 400

    research_query = social_research_query(query) if social_request(query) else query
    hits = retrieve(research_query)
    answer = ask_gemini(query, hits)

    # If Gemini temporarily fails, keep the chatbot useful using retrieved PDF evidence.
    # The UI does not expose the implementation reason.
    if answer is None:
        fallback_answer._last_query = query
        answer = fallback_answer(hits)

    answer = ensure_visualization(answer, hits)
    answer = attach_matplotlib_chart(answer)
    answer["research_figure"] = best_pdf_figure(hits)
    if social_request(query):
        answer["social_media"] = generate_social_content(query, hits)
    answer["query"] = query
    answer["retrieved_count"] = len(hits)
    save_history(query, answer)
    return jsonify(answer)


if __name__ == "__main__":
    DATA_DIR.mkdir(exist_ok=True)
    HISTORY_FILE.touch(exist_ok=True)
    if not HISTORY_FILE.read_text(encoding="utf-8").strip():
        HISTORY_FILE.write_text("[]", encoding="utf-8")
    build_index()
    port = int(os.getenv("AI_BACKEND_PORT", "8000"))
    app.run(host="127.0.0.1", port=port, debug=False)
