const tasks = [
  { id: 'T001', title: 'Finalizare demolări pereți', zone: 'P01,P02,P03,P05,P06', start: '2026-06-30', end: '2026-07-02', progress: 85, indicator: 'Risc întârziere', type: 'red' },
  { id: 'T002', title: 'Evacuare moloz și profile', zone: 'P01,P02,P03,P04,P05,P06', start: '2026-07-01', end: '2026-07-03', progress: 20, indicator: '3 zile rămase', type: 'green' },
  { id: 'T003', title: 'Trasare pereți noi', zone: 'P02,P03,P04,P05,P06,P07', start: '2026-07-03', end: '2026-07-04', progress: 0, indicator: 'Depinde de T002', type: 'green' },
  { id: 'T004', title: 'Verificare tablou electric', zone: 'P11', start: '2026-07-01', end: '2026-07-01', progress: 0, indicator: 'Spațiu critic', type: 'red' },
];

const photoStations = [
  { code: 'Ph01', name: 'Intrare / spațiu deschis existent', zones: 'P01,P02,P03,P05,P06', type: 'General' },
  { code: 'Ph05', name: 'Volum central / open space + chicinetă', zones: 'P04,P07', type: 'General' },
  { code: 'Ph06', name: 'Grupuri sanitare existente', zones: 'P09,P12', type: 'Zonă' },
  { code: 'Ph07', name: 'Meeting Room existent', zones: 'P08', type: 'Zonă' },
  { code: 'Ph08', name: 'Spațiu tehnic', zones: 'P10', type: 'Spațiu tehnic' },
  { code: 'Ph09', name: 'Depozitare / tablou electric', zones: 'P11', type: 'Spațiu tehnic critic' },
];

function MiniCalendar() {
  return <div className="calendar">{Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
    <div className="day" key={day}><strong>{day}</strong>{day===30 && <div className="day-item">Demolări</div>}{day===1 && <div className="day-item">Evacuare moloz</div>}{day===3 && <div className="day-item">Trasare pereți</div>}</div>
  ))}</div>;
}

export default function Home() {
  return (
    <>
      <header className="header">
        <div><strong>PM Omifa</strong><div className="muted">Lemon – One Cotroceni</div></div>
        <div className="pill pill-green">Live starter v0.1</div>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <div className="card"><strong>Module</strong><div className="nav" style={{ marginTop: 12 }}>
            <button>Dashboard</button><button>Project Hub</button><button>Calendar</button><button>Task-uri</button><button>Photo Stations</button><button>Gantt</button><button>Reports</button><button>Share View</button>
          </div></div>
        </aside>
        <main className="main">
          <section className="grid">
            <div className="card"><div className="muted">Zile lucrate</div><div className="stat">1</div></div>
            <div className="card"><div className="muted">Zile rămase</div><div className="stat">24</div></div>
            <div className="card"><div className="muted">Task-uri</div><div className="stat">{tasks.length}</div></div>
            <div className="card"><div className="muted">Riscuri / întârzieri</div><div className="stat">2</div></div>
          </section>
          <section className="grid">
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <h2>Dashboard task-uri</h2>
              <table><thead><tr><th>ID</th><th>Task</th><th>Zone</th><th>Start</th><th>Final</th><th>%</th><th>Indicator</th></tr></thead>
              <tbody>{tasks.map((t) => <tr key={t.id}><td>{t.id}</td><td>{t.title}</td><td>{t.zone}</td><td>{t.start}</td><td>{t.end}</td><td>{t.progress}%</td><td><span className={t.type === 'red' ? 'pill pill-red' : 'pill pill-green'}>{t.indicator}</span></td></tr>)}</tbody></table>
            </div>
            <div className="card"><h2>Calendar lunar</h2><MiniCalendar /></div>
          </section>
          <section className="grid">
            <div className="card"><h2>Photo Stations</h2>{photoStations.map((ph) => <div className="card" key={ph.code}><strong>{ph.code}</strong> <span className="pill">{ph.type}</span><div>{ph.name}</div><div className="muted">Zone: {ph.zones}</div></div>)}</div>
            <div className="card"><h2>Priorități azi</h2><p><span className="pill pill-red">Risc</span> Evacuarea molozului poate bloca frontul de lucru.</p><p><span className="pill pill-red">Critic</span> Verificare tablou electric P11.</p><p><span className="pill pill-green">OK</span> Baseline foto configurat pentru Ph01–Ph09.</p><button className="btn btn-primary">Generează Share View</button></div>
          </section>
        </main>
      </div>
    </>
  );
}
