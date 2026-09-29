let HISTORY = [];
let PDF_FILES = [];
let CURRENT_ANSWER = null;
const $ = id => document.getElementById(id);
const esc = s => (s ?? "").toString().replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[m]));

async function boot(){
  await Promise.all([loadHistory(), status()]);
  bindNavigation();
}

async function status(){
  try{
    const r=await fetch("/api/status");
    if(!r.ok) throw new Error("Status request failed");
    const s=await r.json();
    PDF_FILES=s.pdf_files||[];
  }catch(e){ PDF_FILES=[]; }
}

async function loadHistory(){
  try{
    const r=await fetch("/api/history");
    HISTORY=r.ok ? await r.json() : [];
  }catch(e){ HISTORY=[]; }
  renderHistory();
  if($('historyView')?.style.display!=="none") renderHistoryView();
}

function historyPreview(item){
  const summary=(item.answer?.summary||"").replace(/\s+/g," ").trim();
  return summary || "Open this chat to view the full research answer.";
}
function historyTime(item){
  if(!item.created_at) return "";
  const d=new Date(item.created_at);
  if(Number.isNaN(d.getTime())) return item.created_at;
  return d.toLocaleString([], {day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
}
function filteredHistory(limit=10){
  const q=($('hs')?.value||"").toLowerCase().trim();
  return HISTORY.filter(x=>{
    const query=(x.query||"").toLowerCase();
    const summary=historyPreview(x).toLowerCase();
    return !q || query.includes(q) || summary.includes(q);
  }).slice(0,limit);
}
function historyItemHtml(x){
  return `<div class="historyItem" data-id="${esc(x.id)}" role="button" tabindex="0"><div class="historyQuery">${esc(x.query)}</div><div class="historyPreview">${esc(historyPreview(x))}</div></div>`;
}
function bindHistoryItems(selector){
  document.querySelectorAll(selector).forEach(el=>{
    el.addEventListener("click",()=>openHistory(el.dataset.id));
    el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openHistory(el.dataset.id);}});
  });
}
function renderHistory(){
  const items=filteredHistory(5);
  $('history').innerHTML=items.map(historyItemHtml).join("") || '<div class="historyEmpty">No matching chats</div>';
  bindHistoryItems("#history .historyItem");
}

function showOnly(view){
  $('welcome').style.display=view==="welcome"?"block":"none";
  $('chat').style.display=view==="chat"?"block":"none";
  $('historyView').style.display=view==="history"?"block":"none";
  $('pdfView').style.display=view==="pdf"?"block":"none";
}
function showExplore(){ showOnly("welcome"); window.scrollTo({top:0,behavior:"smooth"}); }

function openHistory(id){
  const item=HISTORY.find(x=>String(x.id)===String(id));
  if(!item) return;
  CURRENT_ANSWER=item.answer||null;
  showOnly("chat");
  $('chat').innerHTML=renderAnswer(item.answer || {query:item.query,summary:"",key_points:[]});
  bindSocialCopy();
  $('q').value="";
  window.scrollTo({top:0,behavior:"smooth"});
}

function renderHistoryView(){
  const matches=filteredHistory(10);
  const trends=buildTrends();
  $('historyView').innerHTML=`<div class="viewCard">
    <div class="viewHeader"><div><div class="viewEyebrow">CHAT HISTORY</div><h2>Last 10 research searches</h2><p>Open any search to restore its complete answer in the main research area.</p></div><button class="viewBack" onclick="showExplore()">← Explore</button></div>
    <div class="trendSection"><div class="viewEyebrow">RECENT TRENDS</div><div class="trendChips">${trends.map(t=>`<button class="trendChip" onclick='trendAsk(${JSON.stringify(t.query)})'>${esc(t.label)} <span>${t.count}</span></button>`).join('') || '<span class="trendEmpty">Your recent search topics will appear here.</span>'}</div></div>
    <div class="historyFullList">${matches.length?matches.map(x=>`<div class="historyFullItem" data-id="${esc(x.id)}" role="button" tabindex="0"><div class="historyFullTop"><b>${esc(x.query)}</b><div class="historyActions"><span>${esc(historyTime(x))}</span><button class="miniDelete" data-delete-history="${esc(x.id)}" title="Delete this search">×</button></div></div><div class="historyFullResult"><b>Result:</b> ${esc(historyPreview(x))}</div></div>`).join(''):'<div class="historyEmpty large">No history found.</div>'}</div>
  </div>`;
  document.querySelectorAll('#historyView .historyFullItem').forEach(el=>{
    el.addEventListener('click',e=>{if(e.target.closest('[data-delete-history]')) return; openHistory(el.dataset.id);});
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openHistory(el.dataset.id);}});
  });
  document.querySelectorAll('[data-delete-history]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();deleteHistoryItem(btn.dataset.deleteHistory);}));
}
function openHistoryView(){ showOnly("history"); renderHistoryView(); window.scrollTo({top:0,behavior:"smooth"}); }

function buildTrends(){
  const stop=new Set('what does tell me about about the this that are is was were from with and for show find explain how can could would should does do in on of a an to at research paper collection data measurements numerical reported say first second third user tell me'.split(/\s+/));
  const counts=new Map();
  HISTORY.slice(0,30).forEach(h=>{
    const words=(h.query||'').toLowerCase().match(/[a-z0-9]{4,}/g)||[];
    const unique=[...new Set(words.filter(w=>!stop.has(w)))].slice(0,4);
    unique.forEach(w=>counts.set(w,(counts.get(w)||0)+1));
  });
  return [...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6).map(([w,c])=>({label:'#'+w.replace(/_/g,' '),query:w,count:c}));
}
function trendAsk(q){ $('q').value=q; ask(); }

function openPdfView(){
  showOnly("pdf");
  const items=PDF_FILES.map(f=>`<div class="pdfItem pdfOpen" data-file="${esc(f)}" role="button" tabindex="0"><span class="pdfIcon">📄</span><div class="pdfInfo"><b>${esc(f)}</b><small>Indexed research document</small></div><div class="pdfItemActions"><button class="paperInfo" data-meta="${esc(f)}" title="Paper details">Details</button><button class="paperAsk" data-askpaper="${esc(f)}">Ask</button><button class="paperDelete" data-deletepdf="${esc(f)}" title="Remove this paper">×</button></div></div>`).join("");
  $('pdfView').innerHTML=`<div class="viewCard"><div class="viewHeader"><div><div class="viewEyebrow">PDF LIBRARY</div><h2>Research collection</h2><p>Add, inspect, open, ask about, or remove research papers.</p></div><div class="libraryActions"><input id="pdfSearch" class="librarySearch" placeholder="Search papers…"><input id="pdfInput" type="file" accept="application/pdf,.pdf" multiple hidden><button class="addPaper" onclick="$('pdfInput').click()">＋ Add research paper</button><button class="viewBack" onclick="showExplore()">← Explore</button></div></div><div id="uploadStatus" class="uploadStatus"></div><div id="pdfList" class="pdfList">${items || '<div class="historyEmpty large">No PDFs found. Add a research paper to begin.</div>'}</div></div>`;
  $('pdfInput')?.addEventListener('change',uploadResearchPapers);
  $('pdfSearch')?.addEventListener('input',filterPdfList);
  bindPdfItems();
  window.scrollTo({top:0,behavior:"smooth"});
}
function filterPdfList(){
  const q=($('pdfSearch')?.value||'').toLowerCase().trim();
  document.querySelectorAll('#pdfList .pdfItem').forEach(el=>{el.style.display=(!q||el.dataset.file.toLowerCase().includes(q))?'flex':'none';});
}
function bindPdfItems(){
  document.querySelectorAll('#pdfView .pdfOpen').forEach(el=>{
    const open=()=>window.open(`/api/pdf/${encodeURIComponent(el.dataset.file)}`,'_blank');
    el.addEventListener('click',e=>{if(e.target.closest('button')) return; open();});
    el.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('button')){e.preventDefault();open();}});
  });
  document.querySelectorAll('[data-meta]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();showPaperDetails(b.dataset.meta);}));
  document.querySelectorAll('[data-askpaper]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation(); $('q').value=`Summarize and explain the research findings in ${b.dataset.askpaper}`; showOnly('welcome'); $('q').focus();}));
  document.querySelectorAll('[data-deletepdf]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();deletePaper(b.dataset.deletepdf);}));
}
async function showPaperDetails(file){
  try{
    const r=await fetch(`/api/pdf-meta/${encodeURIComponent(file)}`); const d=await r.json(); if(!r.ok) throw new Error(d.error||'Could not load paper details');
    const m=d.metadata||{};
    const val=x=>Array.isArray(x)?x.join(' · '):(x||'Not specified');
    const modal=document.createElement('div'); modal.className='modalOverlay'; modal.innerHTML=`<div class="paperModal"><button class="modalClose">×</button><div class="viewEyebrow">RESEARCH PAPER</div><h2>${esc(file)}</h2><div class="modalGrid">${metaCard('Pages',d.pages)}${metaCard('Evidence chunks',d.chunk_count)}${metaCard('Locations',val(m.locations))}${metaCard('Years',val(m.years))}${metaCard('Parameters',val(m.parameters))}${metaCard('Domains',val(m.domains))}</div><div class="modalActions"><button class="addPaper" onclick="window.open('/api/pdf/${encodeURIComponent(file)}','_blank')">Open PDF</button><button class="viewBack modalCloseBtn">Close</button></div></div>`;
    document.body.appendChild(modal); modal.querySelector('.modalClose').onclick=()=>modal.remove(); modal.querySelector('.modalCloseBtn').onclick=()=>modal.remove(); modal.addEventListener('click',e=>{if(e.target===modal) modal.remove();});
  }catch(e){alert(e.message);}
}
async function uploadResearchPapers(e){
  const files=[...(e.target.files||[])]; if(!files.length) return;
  const statusBox=$('uploadStatus'); statusBox.textContent=`Adding ${files.length} research paper${files.length===1?'':'s'}…`;
  const form=new FormData(); files.forEach(f=>form.append('files',f));
  try{
    const r=await fetch('/api/upload-pdf',{method:'POST',body:form}); const data=await r.json(); if(!r.ok) throw new Error(data.error||'Upload failed');
    await status(); statusBox.textContent=`Added ${data.added.length} paper${data.added.length===1?'':'s'} and updated the evidence index.`;
    if(data.rejected?.length) statusBox.textContent += ` ${data.rejected.length} file${data.rejected.length===1?' was':'s were'} skipped.`;
    setTimeout(openPdfView,350);
  }catch(err){ statusBox.textContent=`Could not add the research paper. ${err.message}`; } finally{e.target.value='';}
}
async function deletePaper(file){
  if(!confirm(`Remove “${file}” from the Attrex research library?`)) return;
  try{ const r=await fetch(`/api/pdf/${encodeURIComponent(file)}`,{method:'DELETE'}); const d=await r.json(); if(!r.ok) throw new Error(d.error||'Delete failed'); await status(); openPdfView(); }
  catch(e){alert(e.message);}
}

function metaCard(label,value){ let v=value; if(Array.isArray(v)) v=v.join(' · '); if(v===undefined||v===null||String(v).trim()==='')v='Not specified'; return `<div class="meta"><b>${esc(label)}</b><span>${esc(v)}</span></div>`; }
function tags(m){ const out=[]; const add=(v,p='')=>{if(Array.isArray(v))v.forEach(x=>add(x,p));else if(v&&String(v).trim()&&!/^not specified$/i.test(String(v).trim()))out.push(p+String(v).trim());}; add(m.location,'#');add(m.time_period,'#');add(m.subject,'#');if(m.source)add(String(m.source).replace(/\.[^.]+$/,''),'#');return [...new Set(out.map(x=>x.replace(/\s+/g,'_').replace(/[^#\w.-]/g,'')))].slice(0,8).map(x=>`<span class="hash">${esc(x)}</span>`).join(''); }
function renderSocialMedia(social){
  if(!social) return '';
  const platforms=Array.isArray(social.platforms)?social.platforms:[];
  const cards=platforms.map(p=>{
    const content=(p.content||'').trim();
    const tags=(content.match(/#[A-Za-z0-9_]+/g)||[]).join(' ');
    const body=tags ? content.replace(tags,'').replace(/\n{3,}/g,'\n\n').trim() : content;
    return `<div class="socialCard"><div class="socialPlatform">${esc(p.platform||'Social media')}</div><div class="socialLabel">POST</div><div class="socialText">${esc(body)}</div>${tags?`<div class="socialHashtags">${esc(tags)}</div>`:''}<button class="copySocial" data-social-copy="${esc(content)}">Copy post</button></div>`;
  }).join('');
  const figureSrc=social.figure?.data_uri || social.figure?.url;
  const fig=figureSrc ? `<div class="paperFigure"><div class="visualHead">📷 Research figure from PDF</div><img src="${figureSrc}" alt="${esc(social.figure.kind||'Research figure')} from ${esc(social.figure.source_file||'PDF')}, page ${esc(social.figure.page||'')}"/><div class="figureCaption"><b>${esc(social.figure.kind||'PDF figure')}</b> · ${esc(social.figure.source_file||'')} · Page ${esc(social.figure.page||'')}</div><a class="downloadFigure" href="${figureSrc}" download="attrex-research-figure">Save figure</a></div>` : '';
  if(!cards && !fig) return '';
  return `<div class="socialSection"><div class="metaTitle">📣 Social Media Content</div><p class="socialIntro">Platform-specific science communication generated from the retrieved research evidence.</p>${fig}<div class="socialGrid">${cards}</div>${social.note?`<div class="note">${esc(social.note)}</div>`:''}</div>`;
}
async function generateSocialForCurrentAnswer(){
  if(!CURRENT_ANSWER?.query) return;
  const existing=document.querySelector('.socialSection');
  if(existing) { existing.scrollIntoView({behavior:'smooth',block:'start'}); return; }
  const btn=document.getElementById('socialGenerateBtn');
  if(btn){btn.disabled=true;btn.textContent='Generating…';}
  try{
    const r=await fetch('/api/social-content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:CURRENT_ANSWER.query})});
    const d=await r.json();
    if(!r.ok) throw new Error(d.error||'Could not generate social content.');
    CURRENT_ANSWER.social_media=d;
    const node=document.createElement('div'); node.innerHTML=renderSocialMedia(d);
    $('chat').querySelector('.answer')?.appendChild(node.firstElementChild);
    bindSocialCopy();
    document.querySelector('.socialSection')?.scrollIntoView({behavior:'smooth',block:'start'});
  }catch(e){alert(e.message);}finally{if(btn){btn.disabled=false;btn.textContent='Social content';}}
}
function bindSocialCopy(){
  document.querySelectorAll('[data-social-copy]').forEach(btn=>{
    if(btn.dataset.bound) return; btn.dataset.bound='1';
    btn.addEventListener('click',async e=>{e.stopPropagation();try{await navigator.clipboard.writeText(btn.dataset.socialCopy);btn.textContent='Copied';setTimeout(()=>btn.textContent='Copy',1200);}catch(_){alert('Copy was not available in this browser.');}});
  });
}
function renderChart(viz){
  if(!viz||!viz.enabled)return '';
  if(viz.chart_image || viz.chart_url){ const chartSrc=viz.chart_image||viz.chart_url; return `<div class="visual"><div class="visualHead">Visualization · Matplotlib</div><div class="chartTitle">${esc(viz.title||'Research data visualization')}</div><img class="matplotlibChart" src="${chartSrc}" alt="${esc(viz.title||'Research data visualization')}"/>${viz.note?`<div class="note">${esc(viz.note)}</div>`:''}</div>`; }
  const type=(viz.type||'bar').toLowerCase(),title=viz.title||'Research data visualization',labels=Array.isArray(viz.labels)?viz.labels:[],values=Array.isArray(viz.values)?viz.values:[],xs=Array.isArray(viz.x_values)?viz.x_values:[],unit=viz.unit||'',series=Array.isArray(viz.series)?viz.series:[];
  if(type==='table'){const rows=labels.map((l,i)=>`<tr><td>${esc(l)}</td><td>${esc(values[i]??'')}</td></tr>`).join('');return `<div class="visual"><div class="visualHead">Visualization</div><div class="chartTitle">${esc(title)}</div><table class="dataTable"><thead><tr><th>Category</th><th>Value${unit?` (${esc(unit)})`:''}</th></tr></thead><tbody>${rows}</tbody></table>${viz.note?`<div class="note">${esc(viz.note)}</div>`:''}</div>`;}
  if((type==='line'||type==='scatter'||type==='area')&&(xs.length||series.length||values.length)){const points=series.length?series[0]:values,ys=Array.isArray(points)?points.map(Number).filter(Number.isFinite):[],xvals=(xs.length?xs:labels).slice(0,ys.length);if(ys.length){const w=760,h=250,pad=42,min=Math.min(...ys),max=Math.max(...ys),span=(max-min)||1,coords=ys.map((y,i)=>[pad+(ys.length===1?0:(w-2*pad)*i/(ys.length-1)),h-pad-(y-min)/span*(h-2*pad)]),path=coords.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' '),circles=coords.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="4"><title>${esc(xvals[i]??i)}: ${esc(ys[i])}${unit?' '+esc(unit):''}</title></circle>`).join(''),area=type==='area'?`<path d="${path} L ${coords.at(-1)[0]} ${h-pad} L ${coords[0][0]} ${h-pad} Z" class="areaPlot"/>`:'';return `<div class="visual"><div class="visualHead">Visualization</div><div class="chartTitle">${esc(title)}</div><svg class="svgChart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><line class="axisLine" x1="${pad}" y1="${h-pad}" x2="${w-pad}" y2="${h-pad}"/><line class="axisLine" x1="${pad}" y1="${pad}" x2="${pad}" y2="${h-pad}"/>${area}<path class="linePlot" d="${path}"/>${circles}</svg><div class="axisText">${xvals.map(esc).join(' · ')}${unit?` · unit: ${esc(unit)}`:''}</div>${viz.note?`<div class="note">${esc(viz.note)}</div>`:''}</div>`;}}
  if(type==='pie'&&labels.length&&values.length){const nums=values.map(Number).filter(Number.isFinite),total=nums.reduce((a,b)=>a+b,0);if(total>0){let angle=-Math.PI/2,slices='';nums.slice(0,6).forEach((v,i)=>{const next=angle+(v/total)*Math.PI*2,x1=125+105*Math.cos(angle),y1=125+105*Math.sin(angle),x2=125+105*Math.cos(next),y2=125+105*Math.sin(next),large=next-angle>Math.PI?1:0;slices+=`<path class="pieSlice slice${i}" d="M125 125 L${x1} ${y1} A105 105 0 ${large} 1 ${x2} ${y2} Z"/>`;angle=next;});const legend=labels.slice(0,6).map((x,i)=>`<div class="legend"><span class="dot d${i}"></span>${esc(x)}: ${esc(values[i])}${unit?' '+esc(unit):''}</div>`).join('');return `<div class="visual"><div class="visualHead">Visualization</div><div class="chartTitle">${esc(title)}</div><div class="pieRow"><svg class="pie" viewBox="0 0 250 250">${slices}</svg><div>${legend}</div></div>${viz.note?`<div class="note">${esc(viz.note)}</div>`:''}</div>`;}}
  const pairs=labels.map((label,i)=>({label,value:Number(values[i])})).filter(x=>Number.isFinite(x.value));if(!pairs.length)return '';const max=Math.max(...pairs.map(x=>Math.abs(x.value)),1);return `<div class="visual"><div class="visualHead">Visualization</div><div class="chartTitle">${esc(title)}</div><div class="chart">${pairs.slice(0,18).map(x=>`<div class="barWrap"><div class="barVal">${esc(x.value)}${unit?' '+esc(unit):''}</div><div class="bar" style="height:${Math.max(3,Math.round(Math.abs(x.value)/max*165))}px"></div><div class="barLabel">${esc(x.label)}</div></div>`).join('')}</div>${viz.note?`<div class="note">${esc(viz.note)}</div>`:''}</div>`;
}
function renderAnswer(a){
  const m=a.metadata||{}; CURRENT_ANSWER=a;
  const socialButton=`<button id="socialGenerateBtn" onclick="generateSocialForCurrentAnswer()">Social content</button>`;
  return `<div class="message"><div class="userBubble">${esc(a.query||'')}</div></div><div class="message"><div class="answer"><div class="answerTools"><button onclick="copyCurrentAnswer()">Copy</button>${socialButton}<button onclick="exportCurrentAnswer()">Export PDF</button></div><h2>Summary</h2><div class="summary">${esc(a.summary||'')}</div><div class="sourceTop">📄 ${esc(m.source||'Retrieved PDF evidence')}</div><div class="key"><h2>🔑 10 Key Points</h2><ul class="keyList">${(a.key_points||[]).slice(0,10).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>${renderChart(a.visualization)}${renderSocialMedia(a.social_media)}<div class="metaTitle">Research Metadata</div><div class="metaGrid">${metaCard('1. Source',m.source)}${metaCard('2. Location',m.location)}${metaCard('3. Time / Period',m.time_period)}${metaCard('4. Subject',m.subject)}${metaCard('5. Important Finding',m.important_finding)}${metaCard('6. Data / Evidence',m.data_evidence)}${metaCard('7. Cause / Effect',m.cause_effect)}${metaCard('8. Scientific Significance',m.scientific_significance)}${metaCard('9. Related Sources',m.related_sources||[])}${metaCard('10. Confidence / Coverage',m.confidence_coverage)}</div><div class="hashTags">${tags(m)}</div><div class="sourceEvidence"><h2>📚 Source Evidence</h2>${(a.sources||[]).map(s=>`<div class="sourceRow"><b>${esc(s.source_file)}</b>${s.page?' · page '+esc(s.page):''} · relevance ${esc(s.relevance)}<br>${esc(s.evidence_note||'')}</div>`).join('')}</div></div></div>`;
}
function answerPlainText(a){const m=a.metadata||{};return [`Attrex — Antarctic Research Answer`,`Question: ${a.query||''}`,``,`Summary`,`${a.summary||''}`,``,`10 Key Points`,...(a.key_points||[]).slice(0,10).map(x=>'• '+x),``,`Research Metadata`,`Source: ${m.source||''}`,`Location: ${m.location||''}`,`Time / Period: ${m.time_period||''}`,`Subject: ${m.subject||''}`,`Important Finding: ${m.important_finding||''}`,`Data / Evidence: ${m.data_evidence||''}`,`Cause / Effect: ${m.cause_effect||''}`,`Scientific Significance: ${m.scientific_significance||''}`,`Related Sources: ${Array.isArray(m.related_sources)?m.related_sources.join(', '):m.related_sources||''}`,`Confidence / Coverage: ${m.confidence_coverage||''}`].join('\n');}
async function copyCurrentAnswer(){if(!CURRENT_ANSWER)return;try{await navigator.clipboard.writeText(answerPlainText(CURRENT_ANSWER));alert('Research answer copied.');}catch(e){alert('Copy was not available in this browser.');}}
async function exportCurrentAnswer(){if(!CURRENT_ANSWER)return;try{const r=await fetch('/api/export-answer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:CURRENT_ANSWER.query,answer:CURRENT_ANSWER})});if(!r.ok){const d=await r.json();throw new Error(d.error||'Export failed');}const blob=await r.blob();const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='attrex-research-answer.pdf';a.click();URL.revokeObjectURL(url);}catch(e){alert(e.message);}}

async function ask(){
  const q=$('q').value.trim(); if(!q)return; showOnly('chat'); $('chat').innerHTML='<div class="loading">Searching the research collection…</div>';
  try{const r=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:q})});let a={};try{a=await r.json();}catch(e){throw Error('The research server returned an invalid response.');}if(!r.ok)throw Error(a.error||'Request failed');$('chat').innerHTML=renderAnswer(a);bindSocialCopy();await loadHistory();$('q').value='';window.scrollTo({top:0,behavior:'smooth'});}catch(e){$('chat').innerHTML=`<div class="error">${esc(e.message||'Please try the question again.')}</div>`;}
}
async function deleteHistoryItem(id){try{const r=await fetch(`/api/history/${encodeURIComponent(id)}`,{method:'DELETE'});if(!r.ok)throw new Error('Could not delete this search.');await loadHistory();}catch(e){alert(e.message);}}
async function clearHistory(){if(!HISTORY.length)return;if(!confirm('Clear all saved chat history?'))return;try{await fetch('/api/history',{method:'DELETE'});HISTORY=[];renderHistory();if($('historyView')?.style.display!=='none')renderHistoryView();}catch(e){alert('Could not clear history.');}}
function setQ(x){showOnly('welcome');$('q').value=x;$('q').focus();}
function newChat(){CURRENT_ANSWER=null;showOnly('welcome');$('chat').innerHTML='';$('q').value='';$('q').focus();window.scrollTo({top:0,behavior:'smooth'});}
function bindNavigation(){
  $('navExplore')?.addEventListener('click',showExplore);$('navPdf')?.addEventListener('click',openPdfView);$('navHistory')?.addEventListener('click',openHistoryView);
  $('navExplore')?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showExplore();}});$('navPdf')?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPdfView();}});$('navHistory')?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openHistoryView();}});
  $('hs')?.addEventListener('input',()=>{renderHistory();if($('historyView')?.style.display!=='none')renderHistoryView();});
  $('q')?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask();}});
}
boot();
