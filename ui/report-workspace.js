/* Shared CARBON report views. Network-free: the host owns polling and actions. */
(function (root) {
  'use strict';
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const array = v => Array.isArray(v) ? v : [];
  const text = v => Array.isArray(v) ? v.map(text).filter(Boolean).join('\n') : ['string','number'].includes(typeof v) ? String(v) : '';
  const meaningful = v => text(v).trim() && !/^(unknown|n\/a|not assessed|not measured|—|-)$/i.test(text(v).trim());
  // Never make unsolicited remote image requests or load executable SVG data.
  const image = v => typeof v === 'string' && /^(data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=\s]+|blob:[^\s"<>]+)$/.test(v) ? v : '';
  const statuses = ['passed','failed','blocked','running','planned','deferred','unrecorded'];
  const label = s => ({planned:'Not run',unrecorded:'No outcome'})[s] || s.charAt(0).toUpperCase()+s.slice(1);
  const status = v => statuses.includes(v) ? v : 'unrecorded';
  const demonstrated = f => /^(demonstrated|reproduced|confirmed|runtime-reproduced|source-proven)$/i.test(f.strength);
  const pill = s => `<span class="cr-pill cr-${status(s)}">${esc(label(status(s)))}</span>`;
  const fact = (title,v) => meaningful(v) ? `<div class="cr-fact"><h4>${esc(title)}</h4><p>${esc(text(v))}</p></div>` : '';
  const matching = (row,p) => !!p && (row.page===p.id || (!!p.url && row.page===p.url));
  function normalize(raw = {}) {
    const rows = key => array(raw[key]).filter(x=>x && typeof x==='object');
    return {...raw, title:text(raw.title)||'Testing report', status:text(raw.status)||'planned',
      checks:rows('checks').map((c,i)=>({...c,id:text(c.id)||'check-'+i,status:status(c.status)})),
      findings:rows('findings').map((f,i)=>({...f,id:text(f.id)||'finding-'+i,title:text(f.title)||'Finding',strength:text(f.strength||f.evidenceState)||'suspected',consequence:text(f.consequence||f.impact),steps:f.steps||f.reproSteps,evidence:f.evidence||f.observed,remediation:f.remediation||f.fix})),
      pages:rows('pages').map((p,i)=>({...p,id:text(p.id)||'page-'+i,image:image(p.image)})),
      history:rows('history').map(h=>({...h,current:text(h.current||h.text||h.title),why:text(h.why)})),
      journeys:rows('journeys').map((j,i)=>({...j,id:text(j.id)||'journey-'+i,steps:array(j.steps).filter(s=>s&&typeof s==='object')})),
      nextActions:array(raw.nextActions).filter(meaningful).map(text),blockers:array(raw.blockers).filter(meaningful).map(text)};
  }
  function counts(m) {const n=Object.fromEntries(statuses.map(s=>[s,0]));for(const c of m.checks)n[c.status]++;return n;}
  function sortedFindings(m) {const rank={critical:0,high:1,medium:2,low:3};return [...m.findings].sort((a,b)=>Number(demonstrated(b))-Number(demonstrated(a)) || (rank[a.severity]??4)-(rank[b.severity]??4));}
  function verdict(m) {
    if(meaningful(m.decision?.headline))return text(m.decision.headline);
    if(m.findings.some(f=>demonstrated(f)&&/^(critical|high)$/i.test(f.severity)))return 'Resolve confirmed risks.';
    if(m.checks.some(c=>c.status==='failed'))return 'Investigate the failed checks.';
    if(['running','waiting','planned'].includes(m.status))return 'Building the evidence.';
    if(m.blockers.length||m.checks.some(c=>c.status==='blocked'))return 'Important questions remain.';
    if(m.checks.length&&m.checks.every(c=>c.status==='passed'))return 'Selected checks passed.';
    return 'Review the recorded evidence.';
  }
  function coverage(m) {
    if(!m.checks.length)return '';
    const n=counts(m),desc=statuses.filter(s=>n[s]).map(s=>`${n[s]} ${label(s)}`).join(', ');
    return `<section class="cr-coverage" aria-label="Recorded check outcomes"><div class="cr-between"><h3>Evidence across the selected scope</h3><span>${m.checks.length} recorded checks</span></div><div class="cr-bar" role="img" aria-label="${esc(desc)}">${statuses.filter(s=>n[s]).map(s=>`<span class="cr-${s}" style="flex:${n[s]}"></span>`).join('')}</div><div class="cr-legend">${statuses.filter(s=>n[s]).map(s=>`<span><i class="cr-${s}"></i><strong>${n[s]}</strong> ${label(s)}</span>`).join('')}</div><small>Selected checks, not total product coverage. Unexecuted checks are never passes.</small></section>`;
  }
  function preview(p,small=false) {return p?.image?`<button class="cr-capture ${small?'cr-small':''}" data-cr-zoom="${esc(p.id)}" aria-label="Enlarge captured ${esc(p.title)}"><img src="${esc(p.image)}" alt="Captured ${esc(p.title)}" loading="lazy"><span>${esc(p.title)} <b>↗</b></span></button>`:'';}
  function checkRow(c) {return `<details class="cr-check" data-cr-detail="${esc(c.id)}"><summary><span>${esc(c.title)}<small>${esc([c.type,c.domain].filter(Boolean).join(' · '))}</small></span>${pill(c.status)}</summary>${fact('Why this check',c.risk||c.why)}${fact('Steps / input',c.steps)}${fact('Expected',c.expected)}${fact('Observed',c.actual)}${fact('Evidence',c.evidence)}</details>`;}
  function findingRow(f){return `<button class="cr-finding" data-cr-finding="${esc(f.id)}"><span class="cr-marker ${demonstrated(f)?'cr-failed':'cr-blocked'}"></span><span><strong>${esc(f.title)}</strong>${meaningful(f.consequence)?`<small>${esc(f.consequence)}</small>`:''}<small>${esc([f.severity,demonstrated(f)?'Demonstrated':'Needs verification'].filter(Boolean).join(' · '))}</small></span><span aria-hidden="true">↗</span></button>`;}
  function nextActions(m) {
    return m.nextActions.length?m.nextActions:sortedFindings(m).filter(f=>meaningful(f.remediation)||meaningful(f.verification)).slice(0,3).map(f=>text(meaningful(f.remediation)?f.remediation:f.verification));
  }
  function brief(m) {
    const priority=sortedFindings(m),actions=nextActions(m);
    const shots=m.pages.filter(p=>p.image).slice(0,3),comp=m.comparison;
    const changes=comp&&['new','fixed','regressed','unresolved'].filter(k=>Number.isFinite(comp[k])&&comp[k]>=0);
    return `<div class="cr-brief"><div><p class="cr-kicker">RELEASE BRIEF · ${esc(m.status)}</p><h2 class="cr-verdict">${esc(verdict(m))}</h2>${meaningful(m.summary||m.decision?.summary)?`<p class="cr-lead">${esc(m.summary||m.decision.summary)}</p>`:''}${image(m.jayImage)?`<div class="cr-jay"><img src="${esc(image(m.jayImage))}" alt=""><span>Jay <small>AI test manager</small></span></div>`:''}</div>${actions.length?`<aside class="cr-actions"><h3>What to do next</h3><ol>${actions.slice(0,3).map(a=>`<li>${esc(a)}</li>`).join('')}</ol>${actions.length>3?`<details data-cr-detail="more-actions"><summary>${actions.length-3} more actions</summary><ol start="4">${actions.slice(3).map(a=>`<li>${esc(a)}</li>`).join('')}</ol></details>`:''}</aside>`:''}</div>${coverage(m)}${shots.length?`<section><div class="cr-between"><h3>Captured evidence</h3><button data-cr-view="evidence">Inspect evidence ↗</button></div><div class="cr-filmstrip">${shots.map(p=>preview(p,true)).join('')}</div></section>`:''}${priority.length?`<section><div class="cr-between"><h3>Findings that matter</h3><span>${m.findings.filter(demonstrated).length} demonstrated · ${m.findings.filter(f=>!demonstrated(f)).length} to verify</span></div>${priority.slice(0,3).map(findingRow).join('')}${priority.length>3?`<details data-cr-detail="all-findings"><summary>All ${priority.length} findings</summary>${priority.slice(3).map(findingRow).join('')}</details>`:''}</section>`:''}${changes?.length?`<section class="cr-changes"><h3>Since the compared run</h3>${changes.map(k=>`<span><strong>${comp[k]}</strong> ${esc(k)}</span>`).join('')}</section>`:''}${m.confidence&&meaningful(m.confidence.rationale)?`<details data-cr-detail="confidence"><summary>Confidence assessment${Number.isFinite(m.confidence.score)?' · '+m.confidence.score+'/100':''}</summary>${fact('Tested scope',m.confidence.scope)}${fact('Basis',m.confidence.rationale)}${fact('Limitations',m.confidence.limitations)}<p>Evidence-qualified judgment, not probability of correctness or certification.</p></details>`:''}${m.checks.length?`<details data-cr-detail="all-checks"><summary>All checks &amp; execution evidence · ${m.checks.length}</summary>${m.checks.map(checkRow).join('')}</details>`:''}`;
  }
  function evidence(m,ui) {
    const f=m.findings.find(f=>f.id===ui.finding),p=m.pages.find(p=>p.id===ui.page)||m.pages.find(p=>matching(f||{},p))||(!f?m.pages[0]:null);
    const chosen=f||m.findings.find(f=>matching(f,p));
    return `<div class="cr-evidence"><aside class="cr-rail" aria-label="Captured pages and findings">${m.pages.map(page=>`<button data-cr-page="${esc(page.id)}" aria-pressed="${page.id===p?.id}">${page.image?`<img src="${esc(page.image)}" alt="" loading="lazy">`:''}<strong>${esc(page.title)}</strong><small>${m.checks.filter(c=>matching(c,page)).length} linked checks</small></button>`).join('')}${m.findings.length?`<h3>Findings</h3>${m.findings.map(x=>`<button data-cr-finding="${esc(x.id)}" aria-pressed="${x.id===chosen?.id}">${esc(x.title)}</button>`).join('')}` : ''}</aside><section class="cr-surface">${p?`<p class="cr-kicker">CAPTURED SURFACE</p><h3>${esc(p.title)}</h3>${preview(p)}${fact('Context',p.description)}`:''}${!p&&!chosen?'<p class="cr-empty">Evidence will appear as the agent records checks, findings, or page captures.</p>':''}${m.checks.some(c=>matching(c,p))?`<h3>Inputs &amp; behavior</h3>${m.checks.filter(c=>matching(c,p)).map(checkRow).join('')}`:''}${!p&&m.checks.length?m.checks.map(checkRow).join(''):''}</section><aside class="cr-inspector">${chosen?`<p class="cr-kicker">${esc(chosen.severity)} · ${demonstrated(chosen)?'DEMONSTRATED':'NEEDS VERIFICATION'}</p><h3>${esc(chosen.title)}</h3>${fact('Consequence',chosen.consequence)}${fact('Reproduce',chosen.steps)}${fact('Evidence',chosen.evidence)}${fact('Suggested remediation',chosen.remediation)}${fact('Verification check',chosen.verification)}${ui.canGuide?`<button data-cr-guide="${esc(chosen.id)}">Guide the agent ↗</button>`:''}`:''}</aside></div>${m.checks.some(c=>!m.pages.some(p=>matching(c,p)))&&m.pages.length?`<details data-cr-detail="unlinked"><summary>Checks without a page link</summary>${m.checks.filter(c=>!m.pages.some(p=>matching(c,p))).map(checkRow).join('')}</details>`:''}`;
  }
  function map(m) {
    const journeys=m.journeys.filter(j=>j.steps.length);
    return `<p class="cr-kicker">JOURNEY ATLAS</p><h2>Where the experience holds.<br>Where it needs more evidence.</h2>${journeys.map(j=>`<section class="cr-route"><div><h3>${esc(j.title||j.name||'Recorded journey')}</h3>${fact('Intent',j.intent)}<small>Recorded sequence</small></div><ol>${j.steps.map(step=>{const p=m.pages.find(p=>p.id===step.page||p.url===step.page);return `<li><button ${p?`data-cr-page="${esc(p.id)}"`:'disabled'}>${p?.image?`<img src="${esc(p.image)}" alt="" loading="lazy">`:''}<strong>${esc(step.title||p?.title||'Step')}</strong>${pill(step.status)}</button></li>`;}).join('')}</ol></section>`).join('')}${m.pages.length?`<section><h3>Captured pages &amp; states</h3>${!journeys.length?'<p class="cr-muted">Page evidence only. No ordered journey was recorded; connections are not inferred.</p>':''}<div class="cr-page-grid">${m.pages.map(p=>{const checks=m.checks.filter(c=>matching(c,p));return `<button class="cr-page-card" data-cr-page="${esc(p.id)}">${p.image?`<img src="${esc(p.image)}" alt="" loading="lazy">`:''}<strong>${esc(p.title)}</strong><span>${checks.length} linked checks</span><span class="cr-legend">${statuses.filter(s=>checks.some(c=>c.status===s)).map(s=>`<span>${checks.filter(c=>c.status===s).length} ${label(s)}</span>`).join('')}</span></button>`;}).join('')}</div></section>`:!journeys.length?'<p class="cr-empty">Record page captures or ordered journey steps to build this view.</p>':''}`;
  }
  function live(m) {
    const events=[...m.history].sort((a,b)=>(Date.parse(b.at)||0)-(Date.parse(a.at)||0)),shot=m.pages.filter(p=>p.image).at(-1);
    const event=h=>`<li>${h.at?`<time>${esc(h.at)}</time>`:''}<strong>${esc(h.current)}</strong>${meaningful(h.why)?`<p>${esc(h.why)}</p>`:''}</li>`;
    return `<div class="cr-between"><p class="cr-kicker">LIVE INVESTIGATION · ${esc(m.status)}</p><span data-cr-elapsed></span></div><div class="cr-live"><section><h2>${esc(m.current||'Waiting for the next recorded update.')}</h2>${fact('Why this check matters',m.why)}${m.updatedAt?`<small>Agent update: ${esc(m.updatedAt)}</small>`:''}${events.length?`<ol class="cr-timeline">${events.slice(0,3).map(event).join('')}</ol>${events.length>3?`<details data-cr-detail="history"><summary>Completed history · ${events.length-3} earlier updates</summary><ol class="cr-timeline">${events.slice(3).map(event).join('')}</ol></details>`:''}`:''}</section><section>${shot?`<p class="cr-kicker">LATEST CAPTURED EVIDENCE</p>${preview(shot)}`:''}${sortedFindings(m)[0]?`<h3>Priority finding</h3>${findingRow(sortedFindings(m)[0])}`:''}${m.nextActions[0]?`<div class="cr-next"><small>NEXT RECORDED ACTION</small><p>${esc(m.nextActions[0])}</p></div>`:''}</section></div>${coverage(m)}`;
  }
  const controllers=new WeakMap();
  function mount(host,raw,options={}) {
    if(controllers.has(host)){const c=controllers.get(host);c.update(raw);return c;}
    let m=normalize(raw),ui={view:options.view||(['running','waiting'].includes(m.status)?'live':'brief'),page:'',finding:'',...options.selection,canGuide:!!options.onFinding};
    let dialog,returnFocus,pending;
    function closeZoom(){const id=returnFocus?.dataset.crZoom;dialog?.close();dialog?.remove();dialog=null;if(pending){const next=pending;pending=null;control.update(next);}const target=[...host.querySelectorAll('[data-cr-zoom]')].find(b=>b.dataset.crZoom===id);(target||host.querySelector('.cr-content'))?.focus({preventScroll:true});}
    function draw(focus=false) {
      const open=new Set([...(ui.expanded||[]),...[...host.querySelectorAll('details[open]')].map(d=>d.dataset.crDetail)]);ui.expanded=[];
      const active=host.contains(document.activeElement)?document.activeElement:null;
      const activeKey=active?.getAttribute('data-cr-page')||active?.getAttribute('data-cr-finding');
      const activeView=active?.getAttribute('data-cr-view'),activeDetail=active?.closest('details')?.dataset.crDetail;
      host.classList.add('cr-workspace');
      host.innerHTML=`${m.illustrative?'<div class="cr-demo">ILLUSTRATIVE EXAMPLE · Not a real product assessment</div>':''}<div class="cr-top"><div><strong>${esc(m.title)}</strong>${meaningful(m.target||m.project)?`<small>${esc(m.target||m.project)}</small>`:''}</div><nav class="cr-nav" aria-label="Report views">${[['brief','Release brief'],['evidence','Evidence lens'],['map','Journey atlas'],['live','Live investigation']].map(([v,t])=>`<button data-cr-view="${v}" aria-pressed="${ui.view===v}">${t}</button>`).join('')}</nav></div>${m.blockers.length?`<section class="cr-blockers"><strong>Needs attention</strong>${m.blockers.map(b=>`<p>${esc(b)}</p>`).join('')}</section>`:''}<div class="cr-content" tabindex="-1">${ui.view==='brief'?brief(m):ui.view==='evidence'?evidence(m,ui):ui.view==='map'?map(m):live(m)}</div>`;
      host.querySelectorAll('details').forEach(d=>{d.open=open.has(d.dataset.crDetail)});
      if(focus)host.querySelector('.cr-content').focus({preventScroll:true});
      else if(activeKey)[...host.querySelectorAll('button')].find(b=>b.dataset.crPage===activeKey||b.dataset.crFinding===activeKey)?.focus({preventScroll:true});
      else if(activeView)[...host.querySelectorAll('[data-cr-view]')].find(b=>b.dataset.crView===activeView)?.focus({preventScroll:true});
      else if(activeDetail)[...host.querySelectorAll('details')].find(d=>d.dataset.crDetail===activeDetail)?.querySelector('summary')?.focus({preventScroll:true});
      tick();
    }
    function tick(){const el=host.querySelector('[data-cr-elapsed]');if(!el)return;const start=Date.parse(m.createdAt),end=['running','waiting'].includes(m.status)?Date.now():Date.parse(m.updatedAt);if(!Number.isFinite(start)||!Number.isFinite(end))return;const s=Math.max(0,Math.floor((end-start)/1000));el.textContent=`${Math.floor(s/60)}m ${s%60}s elapsed`;}
    function click(e){const b=e.target.closest('button');if(!b||!host.contains(b))return;
      if(b.dataset.crView){ui.view=b.dataset.crView;draw(true);}
      if(b.hasAttribute('data-cr-page')){ui.page=b.dataset.crPage;ui.finding='';ui.view='evidence';draw(true);}
      if(b.dataset.crFinding){ui.finding=b.dataset.crFinding;ui.page=m.pages.find(p=>matching(m.findings.find(f=>f.id===ui.finding)||{},p))?.id||'';ui.view='evidence';draw(true);}
      if(b.dataset.crGuide)options.onFinding?.(b.dataset.crGuide);
      if(b.dataset.crZoom){const p=m.pages.find(p=>p.id===b.dataset.crZoom);if(!p?.image)return;returnFocus=b;dialog=document.createElement('dialog');dialog.className='cr-zoom';dialog.setAttribute('aria-label',p.title);dialog.innerHTML=`<button>Close screenshot</button><h2>${esc(p.title)}</h2><div class="cr-zoom-scroll"><img src="${esc(p.image)}" alt="${esc(p.title)} captured evidence"></div>`;host.ownerDocument.body.append(dialog);dialog.querySelector('button').onclick=closeZoom;dialog.addEventListener('cancel',e=>{e.preventDefault();closeZoom()});dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))closeZoom()});dialog.showModal();}
    }
    host.addEventListener('click',click);draw();
    const timer=setInterval(()=>{if(!host.isConnected){clearInterval(timer);dialog?.remove();return;}tick()},1000);
    const control={update(next){if(dialog?.open){pending=next;return;}const nm=normalize(next);if(nm.id!==m.id){ui.page='';ui.finding='';ui.view=['running','waiting'].includes(nm.status)?'live':'brief';}else if(['running','waiting'].includes(m.status)&&!['running','waiting'].includes(nm.status)&&ui.view==='live')ui.view='brief';m=nm;draw();},view(v){if(['brief','evidence','map','live'].includes(v)){ui.view=v;draw(true)}},state(){return {...ui,expanded:[...host.querySelectorAll("details[open]")].map(d=>d.dataset.crDetail)}},destroy(){clearInterval(timer);dialog?.remove();host.removeEventListener('click',click);controllers.delete(host)}};
    controllers.set(host,control);return control;
  }
  const api={normalize,counts,verdict,mount,image,nextActions};
  root.CarbonReportWorkspace=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
