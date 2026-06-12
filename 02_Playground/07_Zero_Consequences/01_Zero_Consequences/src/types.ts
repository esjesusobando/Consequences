export interface SignalEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'alpha' | 'beta' | 'omega' | 'custom' | string;
  iconType: 'calendar' | 'video' | 'phone' | 'group' | 'alert' | string;
  active?: boolean;
  syncedToGoogleCalendar?: boolean;
  googleEventId?: string;
  sessionUrl?: string;
  date?: string; // YYYY-MM-DD for calendar day association
}

export type AccentColor = 'cyan' | 'magenta' | 'lime' | 'amber' | 'tokyo' | 'custom';

export interface TerminalLine {
  type: 'prompt' | 'info' | 'ok' | 'warn' | 'err';
  text: string;
  command?: string;
  timestamp?: string;
}

export interface MetricStats {
  systemActive: boolean;
  netProtocol: string;
  dbConnected: boolean;
  speedMbps: number;
  nodeStatus: 'OPTIMAL' | 'DEGRADED' | 'WARNING';
}

// === Personal_Os Linear-style Project Management ===
export interface Project {
  id: string;
  name: string;
  goal: string;
  scope: string; // List of scopes separated by newline
  outOfScope: string; // List of out-of-scopes separated by newline
  status: 'planning' | 'active' | 'completed';
}

export interface Issue {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeEstimate: string; // e.g., "5h", "2d"
  dateEstimate: string; // target date e.g., "2026-06-15"
  status: 'backlog' | 'todo' | 'in_progress' | 'blocked' | 'done';
  acceptanceCriteria: string[]; // clear checklist
}

// === Industrial Operations / Products / Inventory ===
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  variants: {
    sku: string;
    name: string;
    price: number;
    cost: number;
    stock: { [warehouseId: string]: number };
    expiringDate?: string; // Optional shelf-life date
  }[];
}

export interface ProviderProposal {
  providerName: string;
  cost: number;
  deliveryDays: number;
  reliabilityScore: number; // Percentage e.g. 95%
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  providerName: string;
  createdAt: string;
  status: 'generada' | 'enviada' | 'recibida';
  items: {
    sku: string;
    qty: number;
    cost: number;
  }[];
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export interface WarehouseTransfer {
  id: string;
  sku: string;
  qty: number;
  fromWarehouseId: string;
  toWarehouseId: string;
  timestamp: string;
  status: 'completed' | 'in_transit';
}

// === Customizable System Space ===
export type ThemeMode = 'dark' | 'light_neocraft' | 'craft' | 'cyber';

export interface PresentationConfig {
  backgroundImage: string;
  backdropBlur: number;
  overlayOpacity: number;
  accentPreference: AccentColor;
  audioLoop: string;
  volume: number;
  isPlayingSound: boolean;
  customH?: number;
  customS?: number;
  customL?: number;
  panelsSwapped?: boolean;
  sidebarWidth?: number;
  themeMode?: ThemeMode;
}

// === Audit Log ===
export interface AuditLog {
  id: string;
  timestamp: string;
  module: string;
  action: string;
  user: string;
  detail: string;
}

