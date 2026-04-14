
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
export type PlanType = "Básico" | "Profesional" | "Premium";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  plan: PlanType;
  avatar?: string;
  salesCount: number;
  closedRevenue: number;
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
  fechaRegistro: string;
  ultimoContacto: string;
  proximoSeguimiento: string;
  necesidadDetectada: string;
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
