'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { initialEvents, initialMaterials, initialPhotoStations, initialProjects, initialTasks, initialTechnicalElements, technicalDocs } from '@/lib/mock-data';
import { estimateGypsumWall, materialRemaining, materialTotalCost, sumArea, taskIndicator } from '@/lib/calculations';
import { CalendarEvent, Material, PhotoItem, Project, Task } from '@/types';

const nav = ['Portfolio','Dashboard','Project Hub','Calendar','Tasks','Gantt','Photo Stations','Costuri & Cantități','Elemente tehnice','Reports','Share View','Settings'];

export default function Home() {
  const [active, setActive] = useState('Dashboard');
  const [isLight, setIsLight] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [projectId, setProjectId] = useState('lemon');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedDay, setSelectedDay] = useState('2026-07-01');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectedPh, setSelectedPh] = useState('ph01');
  const [photoNote, setPhotoNote] = useState('');

  const project = useMemo(() => projects.find(p => p.id === projectId) || projects[0], [projects, projectId]);
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const projectEvents = events.filter(e => e.projectId === project.id);
  const stations = initialPhotoStations.filter(s => s.projectId === project.id);
  const elements = initialTechnicalElements.filter(e => e.projectId === project.id);
  const projectMaterials = materials.filter(m => m.projectId === project.id);
  const totalCost = projectMaterials.reduce((a,m)=>a+materialTotalCost(m).total,0);
  const risks = projectTasks.filter(t => taskIndicator(t).tone === 'red').length;

  function createProject() {
    const id = `project-${projects.length + 1}`;
    const p: Project = { id, name:'Proiect nou', code:`PRJ-${String(projects.length+1).padStart(3,'0')}`, beneficiary:'', client:'', contractor:'', address:'', pm:'', siteManager:'', startDate:'2026-07-01', endDate:'2026-07-31', status:'Planning', surface:0, floor:'', notes:'', zones:[] };
    setProjects([...projects,p]); setProjectId(id); setActive('Settings');
  }

  function updateProject(p: Project) { setProjects(projects.map(x => x.id === p.id ? { ...p, surface: sumArea(p.zones) } : x)); }

  function addTask() {
    const id = `T${String(tasks.length + 1).padStart(3,'0')}`;
    setTasks([...tasks, { id, projectId: project.id, title:'Task nou', zone:'', owner:'', start:'2026-07-01', end:'2026-07-01', status:'Todo', progress:0, depends:'', notes:'' }]);
  }

  function updateTask(id:string, field:keyof Task, value:any) {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value, ...(field==='status' && value==='Done' ? { progress:100 } : {}) } : t));
  }

  function addEvent() {
    if(!newEventTitle.trim()) return;
    setEvents([...events, { id:`E${events.length+1}`, projectId:project.id, title:newEventTitle, date:selectedDay, time:'09:00', type:'Reminder', description:'' }]);
    setNewEventTitle('');
  }

  function addMaterial() {
    setMaterials([...materials, { id:`M${String(materials.length+1).padStart(3,'0')}`, projectId:project.id, zoneId:'P01', elementType:'Perete gips-carton', materialName:'Material nou', manufacturer:'', supplier:'', specification:'', unit:'buc', quantityEstimated:0, quantityOrdered:0, quantityInstalled:0, wastePercent:10, unitPrice:0, priceSourceUrl:'', lastCheckedDate:'', laborNorm:0, laborUnitPrice:0, orderStatus:'Necesar' }]);
  }

  function updateMaterial(id:string, field:keyof Material, value:any) { setMaterials(materials.map(m => m.id === id ? { ...m, [field]: value } : m)); }

  function uploadPhotos(files: FileList | null) {
    const st = stations.find(s=>s.id===selectedPh);
    if(!files || !st) return;
    const uploaded = Array.from(files).map((f,i)=>({ id:`PHO-${Date.now()}-${i}`, projectId:project.id, photoStationId:selectedPh, zones:st.zones, fileName:f.name, localUrl:URL.createObjectURL(f), uploadedAt:new Date().toISOString(), notes:photoNote, uploadedBy:'local-user' }));
    setPhotos([...photos,...uploaded]); setPhotoNote('');
  }

  return (
    <div className={isLight ? 'app-shell light' : 'app-shell'}>
      <header className="header">
        <div className="logo-wrap"><Image src="/omifa-logo.png" alt="Omifa" width={88} height={40} className="logo-img" /><div><div className="title">PM Omifa</div><div className="subtitle">{project.name}</div></div></div>
        <button className="btn btn-secondary" onClick={()=>setIsLight(!isLight)}>{isLight?'Night mode':'Light mode'}</button>
      </header>
      <div className="layout">
        <aside className="sidebar"><div className="nav">{nav.map(n=><button key={n} className={active===n?'active':''} onClick={()=>setActive(n)}>{n}</button>)}</div></aside>
        <main className="main">
          <section className={active==='Portfolio'?'view active':'view'}><div className="card"><div className="row" style={{justifyContent:'space-between'}}><h2>Portofoliu proiecte</h2><button className="btn" onClick={createProject}>+ Proiect nou</button></div><table><thead><tr><th>Cod</th><th>Proiect</th><th>Beneficiar</th><th>Status</th><th>Suprafață</th><th>Riscuri</th><th></th></tr></thead><tbody>{projects.map(p=><tr key={p.id}><td>{p.code}</td><td>{p.name}</td><td>{p.beneficiary}</td><td>{p.status}</td><td>{sumArea(p.zones).toFixed(2)} mp</td><td>{tasks.filter(t=>t.projectId===p.id && taskIndicator(t).tone==='red').length}</td><td><button className="btn btn-secondary" onClick={()=>setProjectId(p.id)}>Deschide</button></td></tr>)}</tbody></table></div></section>

          <section className={active==='Dashboard'?'view active':'view'}>
            <div className="dashboard-grid"><div>
              <div className="grid"><K title="Suprafață" v={`${sumArea(project.zones).toFixed(2)} mp`} /><K title="Task-uri" v={projectTasks.length}/><K title="Riscuri" v={risks}/><K title="Cost estimat" v={`${Math.round(totalCost).toLocaleString('ro-RO')} lei`}/><K title="Materiale de comandat" v={projectMaterials.filter(m=>m.orderStatus==='Necesar').length}/><K title="Poze" v={photos.filter(p=>p.projectId===project.id).length}/></div>
              <div className="card"><h2>Sugestie proiect</h2><div className="notice">{risks?'Există task-uri blocate sau risc de întârziere. Verifică dependențele și comenzile de materiale.':'Proiectul este în grafic.'}</div></div>
              <div className="card"><h2>Timeline azi</h2><div className="timeline">
                <div className="timeline-item"><strong>08:30</strong><br/><span className="muted">Verificare front demolări și evacuare moloz.</span></div>
                <div className="timeline-item"><strong>11:00</strong><br/><span className="muted">Control tablou electric P11 / coordonare instalații.</span></div>
                <div className="timeline-item"><strong>17:00</strong><br/><span className="muted">Actualizare Photo Stations și raport zilnic.</span></div>
              </div></div>
              <TaskTable tasks={projectTasks} updateTask={updateTask}/>
            </div><CalendarMini events={projectEvents} setDay={setSelectedDay}/></div>
          </section>

          <section className={active==='Project Hub'?'view active':'view'}><ProjectHub project={project}/></section>
          <section className={active==='Calendar'?'view active':'view'}><CalendarFull events={projectEvents} selectedDay={selectedDay} setSelectedDay={setSelectedDay} title={newEventTitle} setTitle={setNewEventTitle} addEvent={addEvent}/></section>
          <section className={active==='Tasks'?'view active':'view'}><div className="card"><div className="row" style={{justifyContent:'space-between'}}><h2>Task-uri editabile</h2><button className="btn" onClick={addTask}>+ Task</button></div><TaskTable tasks={projectTasks} updateTask={updateTask} editable /></div></section>
          <section className={active==='Gantt'?'view active':'view'}><Gantt tasks={projectTasks}/></section>
          <section className={active==='Photo Stations'?'view active':'view'}><Photos stations={stations} selectedPh={selectedPh} setSelectedPh={setSelectedPh} photos={photos.filter(p=>p.projectId===project.id)} note={photoNote} setNote={setPhotoNote} upload={uploadPhotos}/></section>
          <section className={active==='Costuri & Cantități'?'view active':'view'}><Costs materials={projectMaterials} update={updateMaterial} add={addMaterial}/></section>
          <section className={active==='Elemente tehnice'?'view active':'view'}><Technical elements={elements}/></section>
          <section className={active==='Reports'?'view active':'view'}><Report project={project} tasks={projectTasks} materials={projectMaterials}/></section>
          <section className={active==='Share View'?'view active':'view'}><Share project={project} tasks={projectTasks}/></section>
          <section className={active==='Settings'?'view active':'view'}><Settings project={project} update={updateProject}/></section>
        </main>
      </div>
    </div>
  );
}

function K({title,v}:{title:string;v:any}){return <div className="card compact"><div className="muted">{title}</div><div className="stat">{v}</div></div>}

function TaskTable({tasks, updateTask, editable}:{tasks:Task[]; updateTask:(id:string,field:keyof Task,value:any)=>void; editable?:boolean}) {
  return <div className="card"><h2>Task-uri</h2><table><thead><tr><th>ID</th><th>Task</th><th>Zone</th><th>Status</th><th>%</th><th>Indicator</th></tr></thead><tbody>{tasks.map(t=>{const i=taskIndicator(t);return <tr key={t.id}><td>{t.id}</td><td>{editable?<input value={t.title} onChange={e=>updateTask(t.id,'title',e.target.value)}/>:t.title}</td><td>{editable?<input value={t.zone} onChange={e=>updateTask(t.id,'zone',e.target.value)}/>:t.zone}</td><td>{editable?<select value={t.status} onChange={e=>updateTask(t.id,'status',e.target.value)}><option>Todo</option><option>In Progress</option><option>Blocked</option><option>Done</option></select>:t.status}</td><td>{editable?<input type="number" value={t.progress} onChange={e=>updateTask(t.id,'progress',Number(e.target.value))}/>:`${t.progress}%`}</td><td><span className={i.tone==='red'?'pill pill-red':'pill pill-green'}>{i.label}</span></td></tr>})}</tbody></table></div>
}

function CalendarMini({events,setDay}:{events:CalendarEvent[];setDay:(d:string)=>void}){return <div className="card"><h2>Calendar lunar</h2><div className="calendar">{Array.from({length:31},(_,i)=>`2026-07-${String(i+1).padStart(2,'0')}`).map(d=><div className="day" key={d} onClick={()=>setDay(d)}><strong>{Number(d.slice(-2))}</strong>{events.filter(e=>e.date===d).slice(0,2).map(e=><div className="day-item" key={e.id}>{e.title}</div>)}</div>)}</div></div>}

function CalendarFull(p:{events:CalendarEvent[];selectedDay:string;setSelectedDay:(d:string)=>void;title:string;setTitle:(t:string)=>void;addEvent:()=>void}){return <div className="grid"><CalendarMini events={p.events} setDay={p.setSelectedDay}/><div className="card"><h2>Zi selectată: {p.selectedDay}</h2>{p.events.filter(e=>e.date===p.selectedDay).map(e=><div className="notice" key={e.id}>{e.time} – {e.title} <span className="pill">{e.type}</span></div>)}<label>Eveniment / reminder</label><input value={p.title} onChange={e=>p.setTitle(e.target.value)}/><button className="btn" onClick={p.addEvent}>Adaugă</button></div></div>}

function ProjectHub({project}:{project:Project}){return <div className="grid"><div className="card"><h2>Fișă proiect</h2><table><tbody><tr><td>Cod</td><td>{project.code}</td></tr><tr><td>Beneficiar</td><td>{project.beneficiary}</td></tr><tr><td>Antreprenor</td><td>{project.contractor}</td></tr><tr><td>Adresă</td><td>{project.address}</td></tr><tr><td>Suprafață calculată</td><td>{sumArea(project.zones).toFixed(2)} mp</td></tr></tbody></table></div><div className="card"><h2>Zone</h2><table><thead><tr><th>Cod</th><th>Nume</th><th>mp</th></tr></thead><tbody>{project.zones.map(z=><tr key={z.code}><td>{z.code}</td><td>{z.name}</td><td>{z.area.toFixed(2)}</td></tr>)}</tbody></table></div></div>}

function Gantt({tasks}:{tasks:Task[]}){return <div className="card"><button className="btn no-print" onClick={()=>window.print()}>Print / Export A2</button><h2>Gantt</h2>{tasks.map(t=>{const i=taskIndicator(t);return <div className="gantt-row" key={t.id}><div><strong>{t.id}</strong> {t.title}<br/><span className="muted">{t.depends?`depinde de ${t.depends}`:'fără dependență'}</span></div><div className="gantt-line"><div className={i.tone==='red'?'gantt-bar red':'gantt-bar'} style={{width:`${Math.max(8,t.progress)}%`}}>{t.progress}%</div></div><div><span className={i.tone==='red'?'pill pill-red':'pill pill-green'}>{i.label}</span></div></div>})}</div>}

function Photos(p:{stations:any[];selectedPh:string;setSelectedPh:(id:string)=>void;photos:PhotoItem[];note:string;setNote:(n:string)=>void;upload:(f:FileList|null)=>void}){const st=p.stations.find(s=>s.id===p.selectedPh);return <div className="grid"><div className="card"><h2>Photo Stations</h2><p className="muted">Pozele sunt salvate local până la configurarea Supabase Storage. Bucket recomandat: project-photos.</p>{p.stations.map(s=><div className="card compact" key={s.id} onClick={()=>p.setSelectedPh(s.id)}><strong>{s.code}</strong> <span className="pill">{s.type}</span><div>{s.name}</div><div className="muted">{s.zones}</div></div>)}</div><div className="card"><h2>{st?.code} – Galerie</h2><label>Note</label><input value={p.note} onChange={e=>p.setNote(e.target.value)}/><label>Upload poze</label><input type="file" multiple accept="image/*" onChange={e=>p.upload(e.target.files)}/><div className="gallery">{p.photos.filter(x=>x.photoStationId===p.selectedPh).map(img=><div key={img.id}><img src={img.localUrl||img.url} alt={img.fileName}/><div className="muted">{img.fileName}</div></div>)}</div><div className="notice">După activarea AI Vision, sistemul va analiza pozele și va propune materiale și cantități.</div></div></div>}

function Costs({materials,update,add}:{materials:Material[];update:(id:string,field:keyof Material,value:any)=>void;add:()=>void}){return <div className="card"><div className="row" style={{justifyContent:'space-between'}}><h2>Costuri & Cantități</h2><button className="btn" onClick={add}>+ Material</button></div><p className="muted">Prețurile se introduc/verifică pe baza magazinelor de profil: Dedeman, Hornbach, Mathaus, Arabesque sau furnizor local. Nu se folosesc prețuri neverificate automat pentru comandă.</p><div className="notice">Mod de lucru: alegi produsul disponibil, pui link-ul de sursă, data verificării și prețul unitar. Costul include pierderi și normă de manoperă.</div><table><thead><tr><th>Material</th><th>Producător</th><th>Furnizor</th><th>Estimat</th><th>Pierderi %</th><th>Comandat</th><th>Rămas</th><th>Preț zi</th><th>Normă manoperă</th><th>Preț manoperă</th><th>Total</th><th>Sursă</th><th>Verificat</th></tr></thead><tbody>{materials.map(m=>{const c=materialTotalCost(m);return <tr key={m.id}><td><input value={m.materialName} onChange={e=>update(m.id,'materialName',e.target.value)}/></td><td><input value={m.manufacturer} onChange={e=>update(m.id,'manufacturer',e.target.value)}/></td><td><input value={m.supplier} onChange={e=>update(m.id,'supplier',e.target.value)} placeholder="Dedeman / Hornbach / Mathaus / Arabesque"/></td><td><input type="number" value={m.quantityEstimated} onChange={e=>update(m.id,'quantityEstimated',Number(e.target.value))}/></td><td><input type="number" value={m.wastePercent} onChange={e=>update(m.id,'wastePercent',Number(e.target.value))}/></td><td><input type="number" value={m.quantityOrdered} onChange={e=>update(m.id,'quantityOrdered',Number(e.target.value))}/></td><td>{materialRemaining(m).toFixed(2)}</td><td><input type="number" value={m.unitPrice} onChange={e=>update(m.id,'unitPrice',Number(e.target.value))}/></td><td><input type="number" value={m.laborNorm} onChange={e=>update(m.id,'laborNorm',Number(e.target.value))}/></td><td><input type="number" value={m.laborUnitPrice} onChange={e=>update(m.id,'laborUnitPrice',Number(e.target.value))}/></td><td>{Math.round(c.total).toLocaleString('ro-RO')}</td><td><input value={m.priceSourceUrl} onChange={e=>update(m.id,'priceSourceUrl',e.target.value)}/></td><td><input value={m.lastCheckedDate} onChange={e=>update(m.id,'lastCheckedDate',e.target.value)}/></td></tr>})}</tbody></table><div className="ai-box"><strong>Sugestii comandă materiale</strong><p>AI Ready: după analiza pozelor, sistemul va propune materialele necesare, cantitățile cu pierderi și costul estimativ pe baza prețurilor verificate în acest tabel.</p></div></div>}
function Technical({elements}:{elements:any[]}){return <div className="grid"><div className="card"><h2>Elemente tehnice</h2>{elements.map(el=>{const q=estimateGypsumWall(el);return <div className="card" key={el.id}><h3>{el.code} – {el.type}</h3><p>{el.zone} | {el.length}m x {el.height}m | {el.profileType} | {el.boardType} | {el.finishLevel}</p><table><tbody><tr><td>Suprafață perete</td><td>{q.wallArea} mp</td></tr><tr><td>Suprafață plăci</td><td>{q.boardAreaTotal} mp</td></tr><tr><td>Plăci estimate</td><td>{q.boards} buc</td></tr><tr><td>Profile CW</td><td>{q.cwProfiles} buc</td></tr><tr><td>Profile UW</td><td>{q.uwProfiles} buc</td></tr><tr><td>Șuruburi</td><td>{q.screws} buc</td></tr><tr><td>Masă rosturi</td><td>{q.jointCompoundKg} kg</td></tr></tbody></table><p className="muted">Cantitățile sunt estimative și trebuie validate tehnic înainte de comandă.</p></div>})}</div><div className="card"><h2>Documentații tehnice producători</h2><p className="muted">Linkurile deschid biblioteci oficiale / pagini de sistem. PDF-ul exact se selectează în funcție de sistemul ales în proiect.</p>{technicalDocs.map(d=><div className="doc-card" key={d.id}><strong>{d.manufacturer}</strong><a href={d.url} target="_blank" rel="noreferrer">{d.title}</a><span className="pill">{d.documentType}</span><span className="muted">{d.notes}</span></div>)}<h3>Montaj corect perete gips-carton</h3><ol><li>Trasare poziție perete.</li><li>Montare UW cu bandă acustică.</li><li>Montare CW la interax conform sistemului.</li><li>Introducere instalații și izolație.</li><li>Placare cu rosturi decalate.</li><li>Tratare rosturi conform Q1-Q4.</li></ol><div className="ai-box"><strong>AI Ready</strong><p>După activarea AI Vision, sistemul va compara pozele cu elementele tehnice și va propune cantități de comandat, cost estimativ și nivel de încredere. Validarea finală rămâne la Project Manager.</p></div></div></div>}
function Report({project,tasks,materials}:{project:Project;tasks:Task[];materials:Material[]}){return <div className="card"><button className="btn no-print" onClick={()=>window.print()}>Print raport</button><h2>Raport lucrări – {project.name}</h2><p>Data: {new Date().toLocaleDateString('ro-RO')}</p><TaskTable tasks={tasks} updateTask={()=>{}}/><h3>Cost estimat</h3><p>{Math.round(materials.reduce((a,m)=>a+materialTotalCost(m).total,0)).toLocaleString('ro-RO')} lei</p></div>}

function Share({project,tasks}:{project:Project;tasks:Task[]}){return <div className="grid"><div className="card"><h2>Share View</h2><label><input type="checkbox" defaultChecked/> Dashboard</label><label><input type="checkbox" defaultChecked/> Tasks</label><label><input type="checkbox"/> Note interne</label><input readOnly value={`https://pm-omifa.vercel.app/share/${project.id}`}/></div><div className="card"><h2>Preview</h2><p>{project.name}</p><TaskTable tasks={tasks} updateTask={()=>{}}/></div></div>}

function Settings({project,update}:{project:Project;update:(p:Project)=>void}){function set(field:keyof Project,value:any){update({...project,[field]:value})}function setZone(code:string,area:number){const zones=project.zones.map(z=>z.code===code?{...z,area}:z);update({...project,zones,surface:sumArea(zones)})}return <div className="grid"><div className="card"><h2>Setări proiect</h2><div className="grid"><div><label>Nume</label><input value={project.name} onChange={e=>set('name',e.target.value)}/></div><div><label>Cod</label><input value={project.code} onChange={e=>set('code',e.target.value)}/></div><div><label>Beneficiar</label><input value={project.beneficiary} onChange={e=>set('beneficiary',e.target.value)}/></div><div><label>Suprafață calculată</label><input readOnly value={`${sumArea(project.zones).toFixed(2)} mp`}/></div></div></div><div className="card"><h2>Zone / camere</h2><table><thead><tr><th>Cod</th><th>Nume</th><th>mp</th></tr></thead><tbody>{project.zones.map(z=><tr key={z.code}><td>{z.code}</td><td>{z.name}</td><td><input type="number" value={z.area} onChange={e=>setZone(z.code,Number(e.target.value))}/></td></tr>)}</tbody><tfoot><tr><th colSpan={2}>Total</th><th>{sumArea(project.zones).toFixed(2)} mp</th></tr></tfoot></table></div></div>}
