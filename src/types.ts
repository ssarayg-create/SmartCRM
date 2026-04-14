
export type BusinessType = 
  | "Restaurante" 
  | "Cafetería" 
  | "Minimarket" 
  | "Tienda de ropa" 
  | "Otros";

export type LeadStatus = 
  | "Nuevo lead" 
  | "Contacto inicial" 
  | "Demo del sistema POS"
  | "Envío de propuesta" 
  | "Negociación"
  | "Venta cerrada";

export type Role = "Admin" | "Vendedor";
export type PlanType = "Básico" | "Pyme" | "Macro";
export type ClientTemperature = "Frío" | "Tibio" | "Caliente";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface Medal {
  id: string;
  type: 'oro' | 'plata' | 'bronce';
  title: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  plan: PlanType;
  avatar?: string;
  salesCount: number;
  closedRevenue: number;
  points: number;
  achievements: Achievement[];
  medals: Medal[];
  hasSeenOnboarding?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Interaction {
  id: string;
  type: 'Llamada' | 'Email' | 'Reunión' | 'Demo' | 'Nota';
  content: string;
  timestamp: string;
  userId: string;
}

export interface InternalChat {
  id: string;
  name: string;
  type: 'individual' | 'group';
  participants: string[]; // User IDs
  lastMessage?: string;
  lastMessageTime?: string;
  avatar?: string;
  messages: Message[];
}

export interface Client {
  id: string;
  nombreNegocio: string;
  tipoNegocio: BusinessType;
  nombreContacto: string;
  telefono: string;
  email: string;
  ciudad: string;
  estado: LeadStatus;
  temperatura: ClientTemperature;
  fechaRegistro: string;
  ultimoContacto: string;
  proximoSeguimiento: string;
  necesidadDetectada: string;
  solucionOfrecida: string;
  equipoOfrecido: string;
  presupuestoEstimado: number;
  assignedTo: string; // User ID
  closingProbability: number; // 0-100
  messages: Message[];
  historial: Interaction[];
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'followup' | 'system' | 'sale';
  priority: 'high' | 'medium' | 'low';
  read: boolean;
}

export interface Recommendation {
  recomendar: string;
  plan: string;
  equipos: string;
}
