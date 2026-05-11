import { Client, LeadStatus } from '../types';
import { INITIAL_CLIENTS } from '../constants';

export type ExtendedDateRange = 'today' | 'week' | 'current_month' | 'last_month' | 'all' | 'custom';

export class DataService {
  private static instance: DataService;
  private clients: Client[] = INITIAL_CLIENTS;

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  public setClients(clients: Client[]) {
    this.clients = clients;
  }

  public getClients() {
    return this.clients;
  }

  public filterByRange(clients: Client[], range: ExtendedDateRange, startDate?: Date, endDate?: Date): Client[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (range) {
      case 'today':
        return clients.filter(c => {
          const d = new Date(c.fechaRegistro);
          return d >= today;
        });
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return clients.filter(c => new Date(c.fechaRegistro) >= weekAgo);
      case 'current_month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return clients.filter(c => new Date(c.fechaRegistro) >= startOfMonth);
      case 'last_month':
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return clients.filter(c => {
          const d = new Date(c.fechaRegistro);
          return d >= firstDayLastMonth && d <= lastDayLastMonth;
        });
      case 'custom':
        if (!startDate || !endDate) return clients;
        return clients.filter(c => {
          const d = new Date(c.fechaRegistro);
          return d >= startDate && d <= endDate;
        });
      case 'all':
      default:
        return clients;
    }
  }

  public getSummary(filteredClients: Client[]) {
    const totalLeads = filteredClients.length;
    const wonLeads = filteredClients.filter(c => c.estado === 'Ganado').length;
    const totalRevenue = filteredClients
      .filter(c => c.estado === 'Ganado')
      .reduce((acc, c) => acc + c.presupuestoEstimado, 0);
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;
    const avgTicket = wonLeads > 0 ? totalRevenue / wonLeads : 0;

    return {
      totalLeads,
      wonLeads,
      totalRevenue,
      conversionRate,
      avgTicket,
      contactedLeads: filteredClients.filter(c => c.estado !== 'Nuevos prospectos').length
    };
  }

  public getInsights(filteredClients: Client[]) {
    const { conversionRate, totalLeads } = this.getSummary(filteredClients);
    const insights = [];

    if (totalLeads === 0) return ["Sin datos suficientes para generar insights."];

    if (conversionRate < 15) {
      insights.push("Alerta: La tasa de conversión está por debajo del objetivo. Se recomienda reforzar el seguimiento en etapa de negociación.");
    } else if (conversionRate > 25) {
      insights.push("Excelente: El equipo mantiene una efectividad superior al promedio del sector.");
    }

    const negotiationLeads = filteredClients.filter(c => c.estado === 'Negociación').length;
    const percentageNegotiation = (negotiationLeads / totalLeads) * 100;
    
    if (percentageNegotiation > 50) {
      insights.push(`El ${percentageNegotiation.toFixed(0)}% de las oportunidades se concentran en la etapa de negociación. Es momento de un empuje final.`);
    }

    return insights;
  }
}

export const dataService = DataService.getInstance();
