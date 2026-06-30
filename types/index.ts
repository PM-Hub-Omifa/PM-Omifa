export type Status = 'Planning' | 'In Progress' | 'Blocked' | 'Done';
export type TaskStatus = 'Todo' | 'In Progress' | 'Blocked' | 'Done';

export type Zone = { id: string; code: string; name: string; area: number };

export type Project = {
  id: string; name: string; code: string; beneficiary: string; client: string; contractor: string;
  address: string; pm: string; siteManager: string; startDate: string; endDate: string;
  status: Status; surface: number; floor: string; notes: string; zones: Zone[];
};

export type Task = {
  id: string; projectId: string; title: string; zone: string; owner: string; start: string; end: string;
  status: TaskStatus; progress: number; depends: string; notes: string;
};

export type CalendarEvent = {
  id: string; projectId: string; title: string; date: string; time: string;
  type: 'Task' | 'Meeting' | 'Delivery' | 'Reminder' | 'Site Visit' | 'Note';
  description: string; relatedTaskId?: string;
};

export type PhotoStation = {
  id: string; projectId: string; code: string; name: string; zones: string; type: string; notes: string;
};

export type PhotoItem = {
  id: string; projectId: string; photoStationId: string; zones: string; fileName: string;
  localUrl?: string; url?: string; uploadedAt: string; notes: string; uploadedBy: string;
};

export type Material = {
  id: string; projectId: string; zoneId: string; elementType: string; materialName: string; manufacturer: string;
  supplier: string; specification: string; unit: string; quantityEstimated: number; quantityOrdered: number;
  quantityInstalled: number; wastePercent: number; unitPrice: number; priceSourceUrl: string; lastCheckedDate: string;
  laborNorm: number; laborUnitPrice: number; orderStatus: 'Necesar' | 'Comandat' | 'Livrat' | 'Montat'; relatedTaskId?: string;
};

export type TechnicalDocument = {
  id: string; manufacturer: string; title: string; url: string; documentType: 'PDF' | 'technical sheet' | 'system guide'; notes: string;
};

export type TechnicalElement = {
  id: string; projectId: string; code: string; type: string; zone: string; length: number; height: number;
  sideType: 'single side' | 'double side'; layerType: 'single layer' | 'double layer';
  boardType: 'standard' | 'hidrofob' | 'RF' | 'acoustic'; profileType: 'CW/UW 50' | 'CW/UW 75' | 'CW/UW 100';
  insulation: string; finishLevel: 'Q1' | 'Q2' | 'Q3' | 'Q4'; fireRating?: string; acousticRequirement?: string;
};

export type PhotoAnalysisSuggestion = {
  id: string; projectId: string; photoStationId: string; detectedElements: string[];
  suggestedMaterials: string[]; suggestedQuantities: string[]; confidenceScore: number; requiresPMValidation: boolean;
};
