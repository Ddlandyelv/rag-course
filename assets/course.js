/* ===== RAG 知识体系课 · 全站脚本 ===== */

/* ---------- 课程结构 ---------- */
const COURSE=[
 {p:'开始',items:[
   {id:'index',f:'index.html',n:'00',t:'学习地图与使用说明'}
 ]},
 {p:'第零幕 · 为什么需要 RAG',items:[
   {id:'why',f:'r01-why.html',n:'0.1',t:'大模型的三个死穴'},
   {id:'vs',f:'r02-vs.html',n:'0.2',t:'微调与 RAG：闭卷考与开卷考'},
   {id:'loop',f:'r03-loop.html',n:'0.3',t:'一个 RAG 系统的最小闭环'},
   {id:'vec',f:'r04-vector.html',n:'0.4',t:'向量：让「意思」变成距离'},
   {id:'chunk0',f:'r05-chunk.html',n:'0.5',t:'分块：为什么要切碎'}
 ]},
 {p:'第一部分 · 离线索引',items:[
   {id:'etl',f:'r06-etl.html',n:'01',t:'数据解析与清洗'},
   {id:'chunk',f:'r07-chunk2.html',n:'02',t:'分块策略的取舍'},
   {id:'vstore',f:'r08-index.html',n:'03',t:'向量库与索引结构'}
 ]},
 {p:'第二部分 · 在线问答',items:[
   {id:'retrieve',f:'r09-retrieve.html',n:'04',t:'检索：从问题到 Top-K'},
   {id:'prompt',f:'r10-prompt.html',n:'05',t:'增强：提示词怎么拼'},
   {id:'gen',f:'r11-gen.html',n:'06',t:'生成：约束与引用'}
 ]},
 {p:'第三部分 · Advanced RAG',items:[
   {id:'pre',f:'r12-pre.html',n:'07',t:'检索前：改写、拆解、HyDE'},
   {id:'mid',f:'r13-mid.html',n:'08',t:'检索中：混合检索与融合'},
   {id:'post',f:'r14-post.html',n:'09',t:'检索后：重排与压缩'},
   {id:'self',f:'r15-self.html',n:'10',t:'Self-RAG：要不要查，让它自己判断'}
 ]},
 {p:'第四部分 · Graph RAG',items:[
   {id:'limit',f:'r16-limit.html',n:'11',t:'碎片化的天花板'},
   {id:'graph',f:'r17-graph.html',n:'12',t:'知识图谱怎么建、怎么用'}
 ]},
 {p:'第五部分 · Agentic RAG',items:[
   {id:'route',f:'r18-route.html',n:'13',t:'从流水线到智能体'},
   {id:'reflect',f:'r19-reflect.html',n:'14',t:'自我反思与多轮检索'}
 ]},
 {p:'第六部分 · 评估',items:[
   {id:'tri',f:'r20-tri.html',n:'15',t:'评估铁三角'},
   {id:'measure',f:'r21-measure.html',n:'16',t:'怎么测：数据集与裁判'}
 ]},
 {p:'附录',items:[
   {id:'gloss',f:'r22-glossary.html',n:'A',t:'术语表'}
 ]}
];

const FLAT=COURSE.flatMap(g=>g.items);

(function(){
  const html=document.documentElement;
  const pageId=html.dataset.page||'index';
  const idx=FLAT.findIndex(x=>x.id===pageId);
  const cur=FLAT[idx]||FLAT[0];
  const doc=document.getElementById('doc');
  if(!doc) return;

  /* 主题 */
  let theme='light';
  try{theme=localStorage.getItem('rag-theme')||'light'}catch(e){}
  html.setAttribute('data-theme',theme);
  function setTheme(t){
    theme=t; html.setAttribute('data-theme',t);
    try{localStorage.setItem('rag-theme',t)}catch(e){}
    const tx=document.getElementById('themeTxt'); if(tx) tx.textContent=t==='dark'?'浅色':'深色';
    const ic=document.getElementById('themeIcon');
    if(ic) ic.innerHTML = t==='dark'
      ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
      : '<path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"/>';
  }

  /* 已完成 */
  let done=new Set();
  try{done=new Set(JSON.parse(localStorage.getItem('rag-done')||'[]'))}catch(e){}
  const saveDone=()=>{try{localStorage.setItem('rag-done',JSON.stringify([...done]))}catch(e){}};
  const pct=Math.round(done.size/FLAT.length*100);

  /* 顶栏 */
  const bar=document.createElement('header');
  bar.className='topbar';
  bar.innerHTML=`<div class="topbar-in">
    <button class="tbtn menu-btn" id="menuBtn" aria-label="目录">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    <div class="brand">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/><path d="M7.5 9.5h6M7.5 12h4"/></svg>
      <span>RAG 知识体系</span><small>· 从原理到评估</small>
    </div>
    <div class="sp"></div>
    <span class="prog-mini">${done.size}/${FLAT.length} · ${pct}%</span>
    <button class="tbtn" id="themeBtn"><svg id="themeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"/></svg><span id="themeTxt">深色</span></button>
  </div>`;
  document.body.prepend(bar);

  /* 侧栏 */
  const side=document.createElement('aside');
  side.className='side'; side.id='side';
  let navHTML='<div class="side-prog"><div class="bar"><i id="pbar" style="width:'+pct+'%"></i></div>'+
    '<div class="txt"><span>学习进度</span><span id="ptxt">'+done.size+' / '+FLAT.length+'</span></div></div>';
  COURSE.forEach(g=>{
    navHTML+='<div class="part">'+g.p+'</div><nav class="nav">';
    g.items.forEach(it=>{
      navHTML+='<a href="'+it.f+'" class="'+(it.id===pageId?'on':'')+(done.has(it.id)?' done':'')+'">'+
        '<em>'+it.n+'</em><span class="t">'+it.t+'</span><span class="dot"></span></a>';
    });
    navHTML+='</nav>';
  });
  side.innerHTML=navHTML;

  const scrim=document.createElement('div'); scrim.className='scrim'; scrim.id='scrim';

  const layout=document.createElement('div');
  layout.className='layout';
  doc.parentNode.insertBefore(layout,doc);
  layout.appendChild(side); layout.appendChild(doc);
  document.body.appendChild(scrim);

  document.getElementById('menuBtn').onclick=()=>{side.classList.toggle('open');scrim.classList.toggle('on')};
  scrim.onclick=()=>{side.classList.remove('open');scrim.classList.remove('on')};
  document.getElementById('themeBtn').onclick=()=>setTheme(theme==='dark'?'light':'dark');
  setTheme(theme);

  /* 翻页 + 完成 */
  const prev=FLAT[idx-1], next=FLAT[idx+1];
  const pager=document.createElement('div');
  pager.className='pager';
  pager.innerHTML=
    (prev?'<a href="'+prev.f+'"><div class="k">← 上一页 · '+prev.n+'</div><div class="v">'+prev.t+'</div></a>':'')+
    (next?'<a href="'+next.f+'" class="next"><div class="k">下一页 · '+next.n+' →</div><div class="v">'+next.t+'</div></a>':'');
  const isDone=done.has(pageId);
  const donebar=document.createElement('div');
  donebar.className='donebar';
  donebar.innerHTML='<button class="ctl '+(isDone?'on':'')+'" id="doneBtn">'+(isDone?'✓ 已标记学完':'标记本页为学完')+'</button>'+
    '<span class="done-tip" id="doneTip">进度保存在本地浏览器</span>';
  doc.appendChild(donebar);
  doc.appendChild(pager);
  donebar.querySelector('#doneBtn').onclick=function(){
    if(done.has(pageId)){done.delete(pageId)}else{done.add(pageId)}
    saveDone();
    const on=done.has(pageId);
    this.classList.toggle('on',on);
    this.textContent=on?'✓ 已标记学完':'标记本页为学完';
    const p=Math.round(done.size/FLAT.length*100);
    const pb=document.getElementById('pbar'), pt=document.getElementById('ptxt');
    if(pb)pb.style.width=p+'%'; if(pt)pt.textContent=done.size+' / '+FLAT.length;
    const a=side.querySelector('a.on'); if(a)a.classList.toggle('done',on);
    const pm=document.querySelector('.prog-mini'); if(pm)pm.textContent=done.size+'/'+FLAT.length+' · '+p+'%';
    document.getElementById('doneTip').textContent=on?'已完成 · 进度已更新':'已取消标记';
  };

  /* 页内小节导航 */
  const h2s=[...doc.querySelectorAll('h2')];
  if(h2s.length>2){
    h2s.forEach((h,i)=>{ if(!h.id) h.id='s'+(i+1); });
    const toc=document.createElement('nav');
    toc.className='pagetoc';
    toc.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin-top:20px';
    toc.innerHTML=h2s.map(h=>'<a href="#'+h.id+'" style="border:1px solid var(--line);background:var(--surface);padding:4px 10px;border-radius:20px;font-size:11.5px;color:var(--ink-2);text-decoration:none;border-bottom:1px solid var(--line)">'+h.textContent.replace(/^\d+\s*/,'')+'</a>').join('');
    const head=doc.querySelector('.lesson-head');
    if(head) head.appendChild(toc);
  }

  /* ---------- 自测交互 ---------- */
  document.querySelectorAll('.qz').forEach(function(qz,i){
    qz.querySelectorAll('.opt').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(qz.dataset.done) return;
        qz.dataset.done='1';
        const right=btn.hasAttribute('data-ok');
        btn.classList.add(right?'ok':'no');
        if(!right){
          const t=qz.querySelector('.opt[data-ok]'); if(t) t.classList.add('ok');
        }
        const ex=qz.querySelector('.ex'); if(ex) ex.classList.add('on');
        try{
          localStorage.setItem('rag-quiz:'+(html.dataset.page||'x')+':'+i, right?'1':'0');
        }catch(e){}
      });
    });
  });

  /* 键位：← → 翻页 */
  document.addEventListener('keydown',function(e){
    if(e.target.matches('input,textarea')) return;
    if(e.key==='ArrowLeft'&&prev){location.href=prev.f}
    if(e.key==='ArrowRight'&&next){location.href=next.f}
  });
})();
