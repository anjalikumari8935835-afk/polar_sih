# Attrex Gemini Polar Research Chatbot

## Fixed build
This build preserves the existing Attrex interface and answer structure, while fixing the answer-rendering failure and keeping the history/navigation features functional.

### Important fixes
- Restored the missing browser functions used by the answer renderer (`metaCard`, `tags`, `renderChart`).
- Fixed the composer textarea so it starts empty instead of containing a stray `>` character.
- Gemini uses the official `google-genai` SDK when available.
- Added a direct Gemini REST fallback if the SDK is missing or incompatible.
- If Gemini is unavailable, the app still returns a grounded answer from the indexed PDFs instead of exposing an implementation error.
- Recent chats remain clickable and reopen the full answer.
- History opens the latest 10 searches and each entry restores its complete answer.
- PDF Library, Explore, New Chat, search history, and Re-index remain functional.

## Exact answer flow
Summary (10 sentences in one paragraph)
→ 10 bullet key points (no numbering)
→ visualization ONLY when explicit numerical/structured data exists
→ 10 research metadata fields
→ hashtags
→ source evidence

## PDF collection
Put all papers in `PDF/` and click `Re-index PDFs`.

## Gemini
Create `.env` in the project root:
```env
GEMINI_API_KEY=YOUR_KEY
GEMINI_MODEL=gemini-2.5-flash
```

The server loads `.env` from the project folder at startup.

## Run on Mac
```bash
./run_mac.sh
```
Then open:
```text
http://127.0.0.1:8000
```

## If the app still falls back to local PDF answers
Stop the server with `Ctrl+C` and run:
```bash
cd /path/to/Attrex_Gemini_Polar_Research_Chatbot
grep GEMINI .env
python app.py
```
The browser UI does not expose Gemini implementation errors. They are printed only in the terminal.

## Added research workflow features
- Searchable PDF Library with Add Research Paper, Details, Open, Ask, and Remove actions.
- Paper metadata view with page count, evidence chunk count, locations, years, parameters, and domains.
- Searchable Recent Chats and functional Last 10 History view.
- Recent Trends derived from recent searches; trend chips can launch a research query.
- Individual history deletion plus existing Clear History.
- Copy current research answer and export the current answer as a PDF report.
- All existing PDF-grounded retrieval, Gemini generation, metadata, source evidence, and visualization behavior is preserved.

## New AI research features

- **Matplotlib visualizations:** when the grounded answer contains explicit numerical data, Attrex renders a real PNG chart with Matplotlib and places it immediately after the 10 key points. Values are never invented by the chart renderer.
- **Social Media Studio:** ask naturally for social content, for example: `Tell me about the scientific expedition of Antarctica and generate social media content.` Attrex generates platform-specific content for X/Twitter, Facebook, Instagram, LinkedIn, and Threads from retrieved PDF evidence.
- **PDF figure capture:** for social-content requests, Attrex extracts the most useful embedded figure from the relevant research paper. If no embedded image is available, it captures the relevant PDF page as a snapshot. The figure is shown with source filename/page and can be saved.
- **Multimodal social generation:** when Gemini is configured, the extracted research figure is supplied to Gemini alongside the grounded evidence so the model can use the visual as additional context without replacing the PDF evidence.
- **Persistent cached visuals:** charts and extracted PDF figures are cached in `data/figures/`, so restored history does not need to store large base64 images inside `history.json`.
- **Social action button:** any research answer can generate social content without retyping the question.

### Example social request

`Tell me about the scientific expedition of Antarctica and generate the content for X, Facebook, Instagram and LinkedIn.`

The answer keeps the normal Attrex structure and adds a Social Media Content section after the visualization when requested.
