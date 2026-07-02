'use client';

import { useMemo, useState } from 'react';

type Photo = { id: string; station: string; zone: string; fileName: string; url: string; date: string };
type Task = { id:string; phase:string; title:string; zone:string; status:string; progress:number; priority:string };
type Material = { name:string; qty:number; ordered:number; price:number; source:string; status:string };

const navGroups = [
  ['PROJECT','Planuri','Gantt','Calendar','Task Manager','Site Diary','Photo Station','AI Vision','Materials','Cloud Storage','Procurement','Cost Control','Technical Library','Reports','Share View','Settings']
];

const stations = [
  ['Ph01','P01/P02','Open Space'],
  ['Ph02','P10/P11','IT + Electric'],
  ['Ph03','P12','Grup sanitar'],
  ['Ph04','P08','Meeting Room'],
  ['Ph05','P01/P02/P05','Open Space + P05 viitor'],
];

export default function Home(){
  const [active,setActive] = useState('Dashboard');
  const [photos,setPhotos] = useState<Photo[]>([]);
  const [selectedStation,setSelectedStation] = useState('Ph05');
  const [tasks,setTasks] = useState<Task[]>([
    {id:'T001',phase:'Demolări',title:'Finalizare demolări pereți',zone:'P01,P02',status:'In Progress',progress:93,priority:'High'},
    {id:'T002',phase:'Evacuare',title:'Evacuare deșeuri rămase',zone:'P01,P02,P05',status:'In Progress',progress:70,priority:'High'},
    {id:'T003',phase:'Instalații',title:'Sortare și etichetare cabluri',zone:'P01,P02,P11',status:'Todo',progress:0,priority:'High'},
    {id:'T004',phase:'Trasare',title:'Trasare pereți noi',zone:'P05',status:'Todo',progress:0,priority:'Medium'},
  ]);
  const [materials,setMaterials] = useState<Material[]>([
    {name:'Sac pentru moloz',qty:220,ordered:120,price:3.5,source:'',status:'Stoc scăzut'},
    {name:'Profil CW75',qty:120,ordered:0,price:22,source:'https://www.dedeman.ro/ro/search?text=profil%20CW%2075',status:'Planificat'},
    {name:'Profil UW75',qty:80,ordered:0,price:22,source:'https://www.dedeman.ro/ro/search?text=profil%20UW%2075',status:'Planificat'},
    {name:'Placă gips-carton RF',qty:180,ordered:0,price:30,source:'https://www.dedeman.ro/ro/search?text=placa%20gips%20carton%20RF',status:'HOLD'},
  ]);

  function uploadPhotos(files: FileList | null){
    if(!files) return;
    const station = stations.find(s=>s[0]===selectedStation);
    const newPhotos = Array.from(files).map((file,i)=>({
      id:`ph-${Date.now()}-${i}`,
      station:selectedStation,
      zone:station?.[1] || '',
      fileName:file.name,
      url:URL.createObjectURL(file),
      date:new Date().toLocaleString('ro-RO')
    }));
    setPhotos(prev=>[...newPhotos,...prev]);
    setActive('Photo Station');
  }

  const progress = Math.round(tasks.reduce((a,t)=>a+t.progress,0)/tasks.length);
  const cost = materials.reduce((a,m)=>a+(m.qty*m.price),0);

  return <div className="app">
    <Sidebar active={active} setActive={setActive}/>
    <main className="main">
      <Topbar/>
      <div className="content">
        <div className="page-title">
          <div><h1>{active}</h1><p className="muted">Prezentare generală proiect și progres actual</p></div>
          <div className="actions">
            <button className="btn" onClick={()=>setActive('Photo Station')}>+ Adaugă poze</button>
            <button className="btn light" onClick={()=>setActive('Reports')}>Export raport</button>
          </div>
        </div>

        {active==='Dashboard' && <Dashboard photos={photos} tasks={tasks} materials={materials} progress={progress} cost={cost} setActive={setActive}/>}
        {active==='Photo Station' && <PhotoStation photos={photos} uploadPhotos={uploadPhotos} selectedStation={selectedStation} setSelectedStation={setSelectedStation}/>}
        {active==='Cloud Storage' && <CloudStorage/>}
        {active==='Task Manager' && <TaskManager tasks={tasks} setTasks={setTasks}/>}
        {active==='Materials' && <Materials materials={materials} setMaterials={setMaterials}/>}
        {active==='Gantt' && <Gantt tasks={tasks}/>}
        {active==='Calendar' && <Calendar/>}
        {active==='Site Diary' && <SiteDiary photos={photos}/>}
        {active==='AI Vision' && <AiVision photos={photos}/>}
        {active==='Reports' && <Reports photos={photos} tasks={tasks} materials={materials}/>}
        {!['Dashboard','Photo Station','Cloud Storage','Task Manager','Materials','Gantt','Calendar','Site Diary','AI Vision','Reports'].includes(active) && <Placeholder title={active}/>}
      </div>
    </main>
  </div>
}

function Sidebar({active,setActive}:any){
  return <aside className="sidebar">
    <div className="brand"><div className="shield">⌂</div><div><div className="brand-title">PM OMIFA</div><div className="brand-sub">v2.3 Functional</div></div></div>
    <button className={active==='Dashboard'?'navbtn active':'navbtn'} onClick={()=>setActive('Dashboard')}>⌂ Dashboard</button>
    {navGroups.map(([g,...items])=><div key={g}><div className="section-label">{g}</div>{items.map(i=><button key={i} className={active===i?'navbtn active':'navbtn'} onClick={()=>setActive(i)}>{i}</button>)}</div>)}
    <div className="project-mini"><div style={{display:'flex',gap:10,alignItems:'center'}}><div className="thumb"/><div><b>Lemon Office Fit-Out</b><div className="brand-sub">București, România</div></div></div></div>
  </aside>
}

function Topbar(){
  return <div className="topbar"><div className="top-left"><span style={{fontSize:22}}>☰</span><span className="project-name">Lemon Office</span><span className="status">Activ</span><span className="top-muted">Actualizat: 02.07.2026 16:45</span></div><div className="top-right"><span>☀️ 33°C</span><span>🔔</span><div className="avatar">PM</div><b>Project Manager</b></div></div>
}

function Dashboard({photos,tasks,materials,progress,cost,setActive}:any){
  return <>
    <div className="kpis">
      <Kpi title="Progres general" val={`${progress}%`} small="actualizat din task-uri" color="green" w={`${progress}%`}/>
      <Kpi title="Demolări" val="93%" small="aproape finalizat" color="green" w="93%"/>
      <Kpi title="Evacuare deșeuri" val="70%" small="în desfășurare" color="orange" w="70%"/>
      <Kpi title="Cost materiale" val={Math.round(cost).toLocaleString('ro-RO')} small="RON estimat" color="blue" w="58%"/>
      <Kpi title="Poze încărcate" val={photos.length} small="în Photo Station" color="blue" w={`${Math.min(100,photos.length*10)}%`}/>
      <Kpi title="Riscuri active" val="3" small="1 critic, 2 medii" color="red" w="60%"/>
    </div>
    <div className="grid2">
      <div><div className="grid-left">
        <Zones/>
        <Critical setActive={setActive}/>
        <Gantt tasks={tasks} compact/>
        <PhotoPreview photos={photos} setActive={setActive}/>
        <Risks/>
        <Costs cost={cost}/>
        <MaterialsPreview materials={materials} setActive={setActive}/>
        <AiSummary photos={photos} setActive={setActive}/>
      </div></div>
      <div><Calendar/><Timeline photos={photos}/></div>
    </div>
  </>
}

function Kpi(p:any){return <div className="card"><div className="kpi-head">{p.title}</div><div className={'kpi-val '+(p.color+'Text')}>{p.val}</div><div className="barbg"><span className={'bar '+p.color} style={{width:p.w}}></span></div><div className="muted">{p.small}</div></div>}

function Zones(){
  const rows=[['P01','Open Space','92%','green'],['P02','Open Space','95%','green'],['P05','P05 (viitor)','0%','orange'],['P08','Meeting Room','0%','blue'],['P10','Camera IT','100%','green'],['P11','Camera Electrică','100%','green'],['P12','Grup Sanitar','0%','blue']];
  return <div className="card"><div className="panel-title">Progres pe zone</div>{rows.map(r=><div className="zone-row" key={r[0]}><b>{r[0]}</b><span>{r[1]}</span><div className="barbg" style={{margin:0}}><span className={'bar '+r[3]} style={{width:r[2]}}/></div><span>{r[2]}</span></div>)}</div>
}

function Critical({setActive}:any){
  const rows=[['Evacuare deșeuri rămase','P01, P02','High','red'],['Sortare și etichetare cabluri','P01, P02, P11','High','red'],['Curățare front de lucru','P01, P02','Medium','orange'],['Verificare instalații HVAC','Toate zonele','High','orange']];
  return <div className="card"><div className="panel-title">Activități critice</div>{rows.map(r=><div className="task-row" key={r[0]} onClick={()=>setActive('Task Manager')}><span className={'round '+r[3]}>!</span><div><b>{r[0]}</b><div className="muted">{r[1]}</div></div><span className={'badge '+(r[2]==='High'?'high':'med')}>{r[2]}</span></div>)}</div>
}

function Calendar(){
  const days=['L','M','M','J','V','S','D'], nums=['30','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
  return <div className="card"><div className="panel-title">Calendar</div><h3>Iulie 2026</h3><div className="calendar">{days.map(d=><div className="calh" key={d}>{d}</div>)}{nums.map(n=><div className={n==='2'?'day active':'day'} key={n}>{n}{['3','16','25','26'].includes(n)&&<div className="dot"/>}</div>)}</div></div>
}

function Timeline({photos}:any){
  const items=[['16:45','Poze încărcate',`${photos.length} imagini în Photo Station`],['16:40','AI Vision ready','Pregătit pentru analiză locală'],['16:30','Site Diary actualizat','Raport zilnic generabil'],['16:10','Task-uri active','Evacuare, sortare cabluri, curățare']];
  return <div className="card"><div className="panel-title">Timeline astăzi</div><div className="timeline">{items.map(i=><div className="timeline-item" key={i[0]}><div className="time">{i[0]}</div><b>{i[1]}</b><div className="muted">{i[2]}</div></div>)}</div></div>
}

function Gantt({tasks,compact}:any){
  return <div className={compact?'card wide':'card'}><div className="panel-title">Gantt {compact?'- sumar':''}</div><div className="gantt"><div className="g-head"><div>Activitate</div><div>Jun 30 - Jul 13</div></div>{tasks.map((t:any,i:number)=><div className="g-row" key={t.id}><div>{t.phase}</div><div className="g-area"><div className="today"/><div className={'gbar '+(t.progress>80?'green':t.progress>0?'orange':'gray')} style={{left:(8+i*12)+'%',width:Math.max(10,t.progress*.45)+'%'}}/></div></div>)}</div></div>
}

function PhotoPreview({photos,setActive}:any){
  return <div className="card wide"><div className="panel-title">Photo Station - Astăzi</div>{photos.length===0?<div className="muted">Nu există poze încărcate. Apasă „+ Adaugă poze”.</div>:<div className="photos">{photos.slice(0,6).map((p:any)=><PhotoCard key={p.id} p={p}/>)}</div>}<button className="btn light" style={{marginTop:12}} onClick={()=>setActive('Photo Station')}>Deschide Photo Station</button></div>
}

function PhotoCard({p}:any){return <div className="photo"><img src={p.url} alt={p.fileName}/><div className="photo-info"><b>{p.station} · {p.zone}</b><br/><span className="muted">{p.date}</span></div></div>}

function Risks(){return <div className="card"><div className="panel-title">Riscuri principale</div>{['Evacuarea întârzie compartimentările','Instalațiile trebuie verificate','Goluri în pardoseala tehnică'].map((r,i)=><div className="risk-row" key={r}><span className="round red">!</span><span>{r}</span><span className={i===0?'badge high':'badge med'}>{i===0?'Critic':'Mediu'}</span></div>)}</div>}
function Costs({cost}:any){return <div className="card"><div className="panel-title">Costuri materiale</div><div className="donut"><div className="donut-inner">{Math.round(cost).toLocaleString('ro-RO')}<br/>RON</div></div><p className="muted">Prețuri orientative, verificabile prin link produs.</p></div>}
function MaterialsPreview({materials,setActive}:any){return <div className="card"><div className="panel-title">Materiale urgente</div>{materials.slice(0,4).map((m:any)=><div className="mat-row" key={m.name}><b>{m.name}</b><span>{m.qty}</span><span>{m.ordered}</span><span className="badge med">{m.status}</span></div>)}<button className="btn light" onClick={()=>setActive('Materials')}>Vezi materiale</button></div>}
function AiSummary({photos,setActive}:any){return <div className="card"><div className="panel-title">AI Vision Summary</div><div className="ai-score">{photos.length?96:0}%</div><p className="muted">{photos.length?'Pozele sunt pregătite pentru analiză.':'Încarcă poze pentru analiză.'}</p><button className="btn light" onClick={()=>setActive('AI Vision')}>Deschide AI Vision</button></div>}

function PhotoStation({photos,uploadPhotos,selectedStation,setSelectedStation}:any){
  return <div className="grid2"><div className="card"><div className="panel-title">Upload poze</div><label>Photo Station</label><select value={selectedStation} onChange={e=>setSelectedStation(e.target.value)}>{stations.map(s=><option key={s[0]} value={s[0]}>{s[0]} · {s[1]} · {s[2]}</option>)}</select><label style={{marginTop:12,display:'block'}}>Încarcă imagini</label><input type="file" multiple accept="image/*" onChange={e=>uploadPhotos(e.target.files)}/><p className="muted" style={{marginTop:10}}>Momentan imaginile se văd local în browser. Pentru stocare permanentă recomand Supabase Storage.</p></div><div className="card"><div className="panel-title">Galerie</div>{photos.length===0?<p className="muted">Nu există poze încărcate.</p>:<div className="photos">{photos.map((p:any)=><PhotoCard key={p.id} p={p}/>)}</div>}</div></div>
}

function CloudStorage(){
  return <div className="grid">
    <div className="cloud-card recommended"><h3>Supabase Storage — recomandat</h3><p className="muted">Cel mai potrivit pentru dashboard: upload direct, linkuri publice/private, cost mic, deja ai Supabase în proiect.</p><ul><li>Bucket: project-photos</li><li>Folder: /lemon/ph05/2026-07-02/</li><li>Se poate lega direct de Photo Station.</li></ul><button className="btn blue">Pregătește integrarea Supabase</button></div>
    <div className="cloud-card"><h3>Google Drive</h3><p className="muted">Bun pentru arhivare și colaborare, dar integrarea reală cere OAuth și permisiuni Google.</p><button className="btn light">Plan integrare Drive</button></div>
    <div className="cloud-card"><h3>Dropbox</h3><p className="muted">Bun pentru sincronizare simplă, dar tot necesită API key și autorizare utilizator.</p><button className="btn light">Plan integrare Dropbox</button></div>
  </div>
}

function TaskManager({tasks,setTasks}:any){
  function upd(id:string,field:string,value:any){setTasks(tasks.map((t:any)=>t.id===id?{...t,[field]:value}:t))}
  return <div className="card"><div className="panel-title">Task Manager funcțional</div>{tasks.map((t:any)=><div className="card" key={t.id}><div className="grid"><input value={t.title} onChange={e=>upd(t.id,'title',e.target.value)}/><select value={t.status} onChange={e=>upd(t.id,'status',e.target.value)}><option>Todo</option><option>In Progress</option><option>Blocked</option><option>Done</option></select><input type="number" value={t.progress} onChange={e=>upd(t.id,'progress',Number(e.target.value))}/></div></div>)}</div>
}

function Materials({materials,setMaterials}:any){
  function upd(i:number,field:string,value:any){setMaterials(materials.map((m:any,idx:number)=>idx===i?{...m,[field]:value}:m))}
  return <div className="card"><div className="panel-title">Materials funcțional</div>{materials.map((m:any,i:number)=><div className="card" key={m.name}><div className="grid"><input value={m.name} onChange={e=>upd(i,'name',e.target.value)}/><input type="number" value={m.qty} onChange={e=>upd(i,'qty',Number(e.target.value))}/><input type="number" value={m.price} onChange={e=>upd(i,'price',Number(e.target.value))}/><input value={m.source} onChange={e=>upd(i,'source',e.target.value)}/></div>{m.source&&<a href={m.source} target="_blank">Deschide referință preț</a>}</div>)}</div>
}

function SiteDiary({photos}:any){return <div className="card"><div className="panel-title">Site Diary</div><p>02.07.2026 — Demolări 93%, evacuare deșeuri 70%, poze încărcate: {photos.length}.</p><p className="muted">Următorul pas: finalizare evacuare, sortare cabluri, verificare instalații, curățare front.</p></div>}
function AiVision({photos}:any){return <div className="card"><div className="panel-title">AI Vision</div><div className="ai-score">{photos.length?96:0}%</div><p>{photos.length?'Analiză locală pregătită: moloz, cabluri, pereți demolați, zone păstrate.':'Încarcă poze în Photo Station.'}</p></div>}
function Reports({photos,tasks,materials}:any){return <div className="card"><div className="panel-title">Raport zilnic</div><p>Poze: {photos.length}</p><p>Task-uri: {tasks.length}</p><p>Materiale: {materials.length}</p><button className="btn" onClick={()=>window.print()}>Print raport</button></div>}
function Placeholder({title}:any){return <div className="card"><h2>{title}</h2><p className="muted">Meniul funcționează. Acest modul este pregătit pentru extindere.</p></div>}
