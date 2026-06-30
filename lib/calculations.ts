import { Material, Task, TechnicalElement } from '@/types';

export function sumArea(zones: { area: number }[]) {
  return Number(zones.reduce((acc, z) => acc + Number(z.area || 0), 0).toFixed(2));
}

export function taskIndicator(task: Task) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(task.start + 'T00:00:00');
  const end = new Date(task.end + 'T00:00:00');
  if (task.status === 'Done') return { label: 'Închis', tone: 'green' as const };
  if (task.status === 'Blocked') return { label: 'Blocat', tone: 'red' as const };
  if (today > end) return { label: 'Întârziere', tone: 'red' as const };
  const total = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);
  const elapsed = Math.max(0, Math.ceil((today.getTime() - start.getTime()) / 86400000) + 1);
  const expected = Math.min(100, Math.round((elapsed / total) * 100));
  if (task.progress + 10 < expected) return { label: 'Risc întârziere', tone: 'red' as const };
  return { label: 'În grafic', tone: 'green' as const };
}

export function estimateGypsumWall(el: TechnicalElement) {
  const wallArea = Number((el.length * el.height).toFixed(2));
  const sides = el.sideType === 'double side' ? 2 : 1;
  const layers = el.layerType === 'double layer' ? 2 : 1;
  const boardAreaTotal = Number((wallArea * sides * layers).toFixed(2));
  const boards = Math.ceil(boardAreaTotal / 3);
  const cwProfiles = Math.ceil(el.length / 0.6) + 1;
  const uwProfiles = Math.ceil((el.length * 2) / 3);
  const screws = Math.ceil(boardAreaTotal * 18);
  const jointTape = Math.ceil(el.length * layers * sides);
  const jointCompoundKg = Math.ceil(boardAreaTotal * 0.45);
  const insulationArea = el.insulation ? wallArea : 0;
  return { wallArea, boardAreaTotal, boards, cwProfiles, uwProfiles, screws, jointTape, jointCompoundKg, insulationArea };
}

export function materialRemaining(m: Material) {
  return Math.max(0, m.quantityEstimated * (1 + m.wastePercent / 100) - m.quantityOrdered);
}

export function materialTotalCost(m: Material) {
  const qtyWithWaste = m.quantityEstimated * (1 + m.wastePercent / 100);
  const materialCost = qtyWithWaste * m.unitPrice;
  const laborCost = qtyWithWaste * m.laborNorm * m.laborUnitPrice;
  return { qtyWithWaste, materialCost, laborCost, total: materialCost + laborCost };
}
