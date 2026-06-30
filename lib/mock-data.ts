import { CalendarEvent, Material, PhotoStation, Project, Task, TechnicalDocument, TechnicalElement } from '@/types';
import { sumArea } from './calculations';

const lemonZones = [
  { id: 'z01', code: 'P01', name: 'Foyer / Vestibul Acces', area: 7.71 },
  { id: 'z02', code: 'P02', name: 'Showroom', area: 21.93 },
  { id: 'z03', code: 'P03', name: 'Depozitare aparate', area: 5.62 },
  { id: 'z04', code: 'P04', name: 'Birou Open Space', area: 40.81 },
  { id: 'z05', code: 'P05', name: 'Meeting Room', area: 11.74 },
  { id: 'z06', code: 'P06', name: 'Depozitare aparate', area: 5.78 },
  { id: 'z07', code: 'P07', name: 'Chicinetă', area: 5.01 },
  { id: 'z08', code: 'P08', name: 'Meeting Room', area: 5.76 },
  { id: 'z09', code: 'P09', name: 'G.S.01', area: 3.71 },
  { id: 'z10', code: 'P10', name: 'Camera IT', area: 4.80 },
  { id: 'z11', code: 'P11', name: 'Depozitare', area: 4.65 },
  { id: 'z12', code: 'P12', name: 'G.S.02', area: 3.70 },
];

export const initialProjects: Project[] = [
  { id: 'lemon', name: 'Lemon – One Cotroceni', code: 'LEM-OC-001', beneficiary: 'Lemon', client: 'Lemon',
    contractor: 'ADERUS Construct', address: 'One Cotroceni, București', pm: 'Ionuț', siteManager: '',
    startDate: '2026-06-30', endDate: '2026-07-24', status: 'In Progress', surface: sumArea(lemonZones),
    floor: 'E0', notes: 'Fit-out showroom. Proiect pilot PM Omifa.', zones: lemonZones },
];

export const initialTasks: Task[] = [
  { id: 'T001', projectId: 'lemon', title: 'Finalizare demolări pereți', zone: 'P01,P02,P03,P05,P06', owner: 'ADERUS', start: '2026-06-30', end: '2026-07-02', status: 'In Progress', progress: 85, depends: '', notes: '' },
  { id: 'T002', projectId: 'lemon', title: 'Evacuare moloz și profile', zone: 'P01,P02,P03,P04,P05,P06', owner: 'ADERUS', start: '2026-07-01', end: '2026-07-03', status: 'Todo', progress: 20, depends: 'T001', notes: '' },
  { id: 'T003', projectId: 'lemon', title: 'Trasare pereți noi', zone: 'P02,P03,P04,P05,P06,P07', owner: 'ADERUS', start: '2026-07-03', end: '2026-07-04', status: 'Todo', progress: 0, depends: 'T002', notes: '' },
  { id: 'T004', projectId: 'lemon', title: 'Verificare tablou electric', zone: 'P11', owner: 'Electric', start: '2026-07-01', end: '2026-07-01', status: 'Todo', progress: 0, depends: '', notes: 'Spațiu tehnic critic.' },
];

export const initialPhotoStations: PhotoStation[] = [
  { id: 'ph01', projectId: 'lemon', code: 'Ph01', name: 'Intrare / spațiu deschis existent', zones: 'P01,P02,P03,P05,P06', type: 'General', notes: '' },
  { id: 'ph05', projectId: 'lemon', code: 'Ph05', name: 'Volum central / open space + chicinetă', zones: 'P04,P07', type: 'General', notes: '' },
  { id: 'ph06', projectId: 'lemon', code: 'Ph06', name: 'Grupuri sanitare existente', zones: 'P09,P12', type: 'Zonă', notes: '' },
  { id: 'ph07', projectId: 'lemon', code: 'Ph07', name: 'Meeting Room existent', zones: 'P08', type: 'Zonă', notes: '' },
  { id: 'ph08', projectId: 'lemon', code: 'Ph08', name: 'Spațiu tehnic', zones: 'P10', type: 'Spațiu tehnic', notes: '' },
  { id: 'ph09', projectId: 'lemon', code: 'Ph09', name: 'Depozitare / tablou electric', zones: 'P11', type: 'Spațiu tehnic critic', notes: 'Tablou electric activ.' },
];

export const initialEvents: CalendarEvent[] = [
  { id: 'E001', projectId: 'lemon', title: 'Evacuare moloz', date: '2026-07-01', time: '09:00', type: 'Task', description: 'Front principal showroom', relatedTaskId: 'T002' },
  { id: 'E002', projectId: 'lemon', title: 'Verificare tablou electric', date: '2026-07-01', time: '11:00', type: 'Reminder', description: 'P11 - spațiu critic', relatedTaskId: 'T004' },
];

export const technicalDocs: TechnicalDocument[] = [
  { id: 'DOC-KNAUF-01', manufacturer: 'Knauf', title: 'Knauf – documentație sisteme pereți gips-carton', url: 'https://www.knauf.ro/ro/documentatie', documentType: 'system guide', notes: 'Bibliotecă oficială producător. Selectează PDF-ul exact pentru sistemul folosit în proiect.' },
  { id: 'DOC-KNAUF-WALLS', manufacturer: 'Knauf', title: 'Knauf – sisteme pereți interiori / compartimentări', url: 'https://www.knauf.ro/ro/sisteme/constructii-uscate/pereti.html', documentType: 'technical sheet', notes: 'Referință pentru configurarea pereților gips-carton.' },
  { id: 'DOC-RIGIPS-01', manufacturer: 'Rigips / Saint-Gobain', title: 'Rigips – documentații tehnice și sisteme', url: 'https://www.rigips.ro/documentatii', documentType: 'system guide', notes: 'Bibliotecă documentații Rigips / Saint-Gobain.' },
  { id: 'DOC-SINIAT-01', manufacturer: 'Siniat / Etex', title: 'Siniat – centru documentație tehnică', url: 'https://www.siniat.ro/ro-ro/centru-de-documentatie', documentType: 'system guide', notes: 'Bibliotecă documentații Siniat / Etex.' },
  { id: 'DOC-SINIAT-WALLS', manufacturer: 'Siniat / Etex', title: 'Siniat – sisteme pereți despărțitori', url: 'https://www.siniat.ro/ro-ro/produse-sisteme/sisteme/pereti-despartitori', documentType: 'technical sheet', notes: 'Referință pentru soluții de pereți despărțitori.' },
];

export const initialMaterials: Material[] = [
  { id: 'M001', projectId: 'lemon', zoneId: 'P02', elementType: 'Perete gips-carton', materialName: 'Placă gips-carton standard', manufacturer: 'Configurabil', supplier: 'Furnizor local', specification: '12.5 mm', unit: 'mp', quantityEstimated: 120, quantityOrdered: 0, quantityInstalled: 0, wastePercent: 10, unitPrice: 0, priceSourceUrl: 'Actualizează cu link Dedeman/Hornbach/Mathaus/Arabesque', lastCheckedDate: 'never', laborNorm: 0.35, laborUnitPrice: 0, orderStatus: 'Necesar', relatedTaskId: 'T003' },
  { id: 'M002', projectId: 'lemon', zoneId: 'P02', elementType: 'Perete gips-carton', materialName: 'Profil CW/UW 75', manufacturer: 'Configurabil', supplier: 'Furnizor local', specification: '3 m', unit: 'buc', quantityEstimated: 65, quantityOrdered: 0, quantityInstalled: 0, wastePercent: 5, unitPrice: 0, priceSourceUrl: 'Actualizează cu link Dedeman/Hornbach/Mathaus/Arabesque', lastCheckedDate: 'never', laborNorm: 0.1, laborUnitPrice: 0, orderStatus: 'Necesar', relatedTaskId: 'T003' },
];

export const initialTechnicalElements: TechnicalElement[] = [
  { id: 'TE001', projectId: 'lemon', code: 'PGC-01', type: 'Perete gips-carton', zone: 'P02', length: 12, height: 3, sideType: 'double side', layerType: 'single layer', boardType: 'standard', profileType: 'CW/UW 75', insulation: 'Vată minerală 50 mm', finishLevel: 'Q2' },
];
