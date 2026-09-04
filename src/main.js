import './style.css';

const GEO_CRITERIA = [
  { key:'schema', label:'Balisage Schema.org présent (Article, FAQ, HowTo…)' },
  { key:'directAnswer', label:'Réponse directe en 1-2 phrases dès le haut de page' },
  { key:'faq', label:'Section FAQ avec questions formulées comme un utilisateur' },
  { key:'citations', label:'Chiffres / stats sourcés, citables tels quels' },
  { key:'eeat', label:"Auteur identifié + signaux d'expertise (E-E-A-T)" },
  { key:'freshness', label:'Contenu mis à jour depuis moins de 6 mois' },
];

let pages = [
  { name:"Étude de cas", url:"/etude-de-cas-data-empathy.html", clicks:3, impressions:54, position:2.5,
    lcp:2.1, cls:0.05, inp:180, geo:{schema:true, directAnswer:true, faq:false, citations:true, eeat:false, freshness:true} },
  { name:"Guide gratuit", url:"/guide-gratuit", clicks:2, impressions:8, position:11.5,
    lcp:2.6, cls:0.08, inp:210, geo:{schema:false, directAnswer:true, faq:false, citations:false, eeat:false, freshness:true} },
  { name:"Accueil", url:"/", clicks:1, impressions:23, position:9.09,
    lcp:1.9, cls:0.03, inp:150, geo:{schema:true, directAnswer:false, faq:false, citations:false, eeat:true, freshness:true} },
  { name:"Bibliothèque méthode E.M.P.A.T.H.Y", url:"/bibliotheque-methode-empathy.html", clicks:0, impressions:10, position:12.2,
    lcp:2.4, cls:0.06, inp:190, geo:{schema:false, directAnswer:false, faq:false, citations:true, eeat:false, freshness:false} },
  { name:"Taux conversion landing page SaaS", url:"/taux-conversion-landing-page-saas.html", clicks:0, impressions:7, position:36.71,
    lcp:3.1, cls:0.12, inp:260, geo:{schema:false, directAnswer:false, faq:false, citations:false, eeat:false, freshness:false} },
  { name:"Analyse besoins clients", url:"/analyse-besoins-clients.html", clicks:0, impressions:4, position:3.0,
    lcp:2.0, cls:0.04, inp:170, geo:{schema:true, directAnswer:true, faq:true, citations:false, eeat:false, freshness:false} },
];

let selectedIndex = 0;

function seoScore(p){
  const posScore = Math.max(0, 100 - p.position * 2.6);
  const ctr = p.impressions > 0 ? p.clicks / p.impressions : 0;
  const ctrScore = Math.min(100, ctr * 100 * 3);
  return Math.round(posScore * 0.65 + ctrScore * 0.35);
}
function geoScore(p){
  const total = GEO_CRITERIA.length;
  const on = GEO_CRITERIA.filter(c => p.geo[c.key]).length;
  return Math.round((on / total) * 100);
}
function perfScore(p){
  const lcpScore = p.lcp <= 2.5 ? 100 : p.lcp <= 4 ? 60 : 20;
  const clsScore = p.cls <= 0.1 ? 100 : p.cls <= 0.25 ? 60 : 20;
  const inpScore = p.inp <= 200 ? 100 : p.inp <= 500 ? 60 : 20;
  return Math.round((lcpScore + clsScore + inpScore) / 3);
}
function perfColor(score){
  if(score >= 80) return '#39d979';
  if(score >= 50) return '#e8b93e';
  return '#ff5d6c';
}
function priority(p){
  const s = seoScore(p), g = geoScore(p);
  if(s < 45 && g < 45) return {label:'Urgent', color:'#ff5d6c'};
  if(s >= 45 && g < 45) return {label:'Enrichir GEO-IA', color:'#e8b93e'};
  if(s < 45 && g >= 45) return {label:'Pousser le SEO', color:'#7c3aed'};
  return {label:'Pilier — maintenir', color:'#00e5a0'};
}

function renderMatrix(){
  const svg = document.getElementById('matrixSvg');
  const W=560, H=460, M=52;
  const plotW = W - M - 20, plotH = H - M - 40;
  let s = '';

  // background quadrants
  s += `<rect x="${M}" y="20" width="${plotW/2}" height="${plotH/2}" fill="#7c3aed14"/>`;
  s += `<rect x="${M+plotW/2}" y="20" width="${plotW/2}" height="${plotH/2}" fill="#00e5a014"/>`;
  s += `<rect x="${M}" y="${20+plotH/2}" width="${plotW/2}" height="${plotH/2}" fill="#ff5d6c14"/>`;
  s += `<rect x="${M+plotW/2}" y="${20+plotH/2}" width="${plotW/2}" height="${plotH/2}" fill="#e8b93e14"/>`;

  // grid lines
  for(let i=0;i<=4;i++){
    const x = M + (plotW/4)*i;
    const y = 20 + (plotH/4)*i;
    s += `<line class="grid-line" x1="${x}" y1="20" x2="${x}" y2="${20+plotH}"/>`;
    s += `<line class="grid-line" x1="${M}" y1="${y}" x2="${M+plotW}" y2="${y}"/>`;
  }

  // axis labels
  s += `<text class="axis-label" x="${M+plotW/2}" y="${H-6}" text-anchor="middle">Score SEO →</text>`;
  s += `<text class="axis-label" x="14" y="${20+plotH/2}" text-anchor="middle" transform="rotate(-90 14 ${20+plotH/2})">Score GEO-IA →</text>`;

  // quadrant labels
   s += `<text class="quad-label" x="${M+10}" y="${20+plotH-10}">Urgent</text>`;
  s += `<text class="quad-label" x="${M+10}" y="34">Pousser le SEO</text>`;
  s += `<text class="quad-label" x="${M+plotW-10}" y="${20+plotH-10}" text-anchor="end">Enrichir GEO-IA</text>`;
  s += `<text class="quad-label" x="${M+plotW-10}" y="34" text-anchor="end">Pilier</text>`;

  const maxImpr = Math.max(...pages.map(p=>p.impressions), 1);

  pages.forEach((p, i) => {
    const s_ = seoScore(p), g_ = geoScore(p), perf = perfScore(p);
    const x = M + (s_/100)*plotW;
    const y = 20 + plotH - (g_/100)*plotH;
    const r = 8 + Math.sqrt(p.impressions/maxImpr) * 18;
    const color = perfColor(perf);
    const stroke = i === selectedIndex ? '#fff' : color;
    const sw = i === selectedIndex ? 2.5 : 1;
    s += `<circle class="bubble" data-i="${i}" cx="${x}" cy="${y}" r="${r}" fill="${color}55" stroke="${stroke}" stroke-width="${sw}"/>`;
  });

  svg.innerHTML = s;
  svg.querySelectorAll('.bubble').forEach(el=>{
    el.addEventListener('click', ()=>{ selectedIndex = parseInt(el.dataset.i); renderAll(); });
  });
}

function renderDetail(){
  const el = document.getElementById('detail');
  if(selectedIndex === null || !pages[selectedIndex]){
    el.innerHTML = '<p class="placeholder">Sélectionne une page pour voir son détail de score et sa checklist GEO-IA.</p>';
    return;
  }
  const p = pages[selectedIndex];
  const s_ = seoScore(p), g_ = geoScore(p), perf = perfScore(p);
  const pr = priority(p);

  let html = `
    <div style="margin-bottom:14px;">
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;">${p.name}</div>
      <div style="color:var(--dim);font-size:0.76rem;font-family:'JetBrains Mono',monospace;">${p.url}</div>
    </div>
    <div class="score-row"><span>Score SEO</span><span class="score-val">${s_}/100</span></div>
    <div class="score-row"><span>Score GEO-IA</span><span class="score-val">${g_}/100</span></div>
    <div class="score-row"><span>Performance (CWV)</span><span class="score-val">${perf}/100</span></div>
    <div class="score-row"><span>Priorité</span><span class="badge" style="background:${pr.color}22;color:${pr.color};">${pr.label}</span></div>

    <div class="checklist">
  `;
  GEO_CRITERIA.forEach(c=>{
    const checked = p.geo[c.key] ? 'checked' : '';
    const onClass = p.geo[c.key] ? 'on' : '';
    html += `<label class="${onClass}"><input type="checkbox" data-crit="${c.key}" ${checked}/> ${c.label}</label>`;
  });
  html += `</div>`;

  const missing = GEO_CRITERIA.filter(c=>!p.geo[c.key]).map(c=>c.label.split(' (')[0].split(',')[0]);
  if(missing.length){
    html += `<div class="action-note">Prochaine action GEO-IA : ${missing[0]}.</div>`;
  } else {
    html += `<div class="action-note">Tous les critères GEO-IA sont cochés — cette page est prête à être citée par les IA génératives.</div>`;
  }

  el.innerHTML = html;
  el.querySelectorAll('input[type=checkbox]').forEach(cb=>{
    cb.addEventListener('change', ()=>{
      p.geo[cb.dataset.crit] = cb.checked;
      renderAll();
    });
  });
}

function renderTable(){
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  pages.forEach((p, i)=>{
    const s_ = seoScore(p), g_ = geoScore(p);
    const pr = priority(p);
    const tr = document.createElement('tr');
    if(i === selectedIndex) tr.classList.add('active-row');
    tr.innerHTML = `
      <td><span class="page-name">${p.name}<span class="page-url">${p.url}</span></span></td>
      <td><input class="cell" type="number" min="0" value="${p.clicks}" data-field="clicks" style="width:50px"/></td>
      <td><input class="cell" type="number" min="0" value="${p.impressions}" data-field="impressions" style="width:56px"/></td>
      <td><input class="cell" type="number" min="0" step="0.1" value="${p.position}" data-field="position" style="width:56px"/></td>
      <td><input class="cell" type="number" min="0" step="0.1" value="${p.lcp}" data-field="lcp"/></td>
      <td><input class="cell" type="number" min="0" step="0.01" value="${p.cls}" data-field="cls"/></td>
      <td><input class="cell" type="number" min="0" value="${p.inp}" data-field="inp"/></td>
      <td><span class="score-val">${s_}</span></td>
      <td><span class="score-val">${g_}</span></td>
      <td><span class="pill" style="background:${pr.color}22;color:${pr.color};">${pr.label}</span></td>
      <td><button class="remove-btn" data-remove="${i}" title="Supprimer">✕</button></td>
    `;
    tbody.appendChild(tr);

    tr.querySelector('.page-name').addEventListener('click', ()=>{ selectedIndex = i; renderAll(); });
    tr.querySelectorAll('input.cell').forEach(inp=>{
      inp.addEventListener('input', ()=>{
        const val = parseFloat(inp.value);
        p[inp.dataset.field] = isNaN(val) ? 0 : val;
        renderMatrix();
        if(i === selectedIndex) renderDetail();
        renderTableScoresOnly();
      });
    });
    tr.querySelector('[data-remove]').addEventListener('click', (e)=>{
      e.stopPropagation();
      pages.splice(i,1);
      if(selectedIndex >= pages.length) selectedIndex = pages.length - 1;
      renderAll();
    });
  });
}

// lightweight refresh of just score/priority cells so typing doesn't lose focus
function renderTableScoresOnly(){
  const rows = document.querySelectorAll('#tableBody tr');
  rows.forEach((tr, i)=>{
    const p = pages[i];
    if(!p) return;
    const s_ = seoScore(p), g_ = geoScore(p), pr = priority(p);
    const cells = tr.querySelectorAll('.score-val');
    cells[0].textContent = s_;
    cells[1].textContent = g_;
    const pill = tr.querySelector('.pill');
    pill.textContent = pr.label;
    pill.style.background = pr.color + '22';
    pill.style.color = pr.color;
  });
}

document.getElementById('addRowBtn').addEventListener('click', ()=>{
  pages.push({
    name:"Nouvelle page", url:"/", clicks:0, impressions:0, position:50,
    lcp:2.5, cls:0.1, inp:200,
    geo:{schema:false, directAnswer:false, faq:false, citations:false, eeat:false, freshness:false}
  });
  selectedIndex = pages.length - 1;
  renderAll();
});

function renderAll(){
  renderMatrix();
  renderDetail();
  renderTable();
}
renderAll();
