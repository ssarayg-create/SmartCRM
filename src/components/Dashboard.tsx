
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Target,
  Zap,
  AlertCircle,
  Lightbulb,
  Trophy,
  BarChart3,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Client } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { USERS } from '../constants';

interface DashboardProps {
  clients: Client[];
}

type DateRange = 'today' | 'week' | 'month' | 'all';

export default function Dashboard({ clients }: DashboardProps) {
  const [range, setRange] = useState<DateRange>('all');

  const filteredClients = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return clients.filter(client => {
      const clientDate = new Date(client.fechaRegistro);
      
      if (range === 'today') {
        return clientDate >= today;
      }
      if (range === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return clientDate >= weekAgo;
      }
      if (range === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        return clientDate >= monthAgo;
      }
      return true;
    });
  }, [clients, range]);

  const totalLeads = filteredClients.length;
  const wonLeads = filteredClients.filter(c => c.estado === 'Venta cerrada').length;
  const demosRealized = filteredClients.filter(c => c.estado === 'Demo del sistema POS' || c.estado === 'Envío de propuesta' || c.estado === 'Negociación' || c.estado === 'Venta cerrada').length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0;
  const avgSaleValue = wonLeads > 0 
    ? (filteredClients.filter(c => c.estado === 'Venta cerrada').reduce((acc, c) => acc + c.presupuestoEstimado, 0) / wonLeads).toLocaleString()
    : 0;

  const rangeLabels: Record<DateRange, string> = {
    today: 'Hoy',
    week: 'Esta Semana',
    month: 'Este Mes',
    all: 'Todo el tiempo'
  };

  const stats = [
    { label: 'Leads Generados', value: totalLeads, icon: Users, color: 'text-primary', bg: 'bg-primary/10', trend: range === 'all' ? '+12%' : '+4%' },
    { label: 'Demos Realizadas', value: demosRealized, icon: Zap, color: 'text-secondary', bg: 'bg-secondary/10', trend: range === 'all' ? '+5%' : '+2%' },
    { label: 'Ventas Cerradas', value: wonLeads, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', trend: range === 'all' ? '+8%' : '+3%' },
    { label: 'Valor Promedio', value: `$${avgSaleValue}`, icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10', trend: 'Ticket Promedio' },
  ];

  const businessTypeData = Object.entries(
    filteredClients.reduce((acc, client) => {
      acc[client.tipoNegocio] = (acc[client.tipoNegocio] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const statusData = [
    { name: 'Nuevo lead', value: filteredClients.filter(c => c.estado === 'Nuevo lead').length },
    { name: 'Contacto inicial', value: filteredClients.filter(c => c.estado === 'Contacto inicial').length },
    { name: 'Demo POS', value: filteredClients.filter(c => c.estado === 'Demo del sistema POS').length },
    { name: 'Propuesta', value: filteredClients.filter(c => c.estado === 'Envío de propuesta').length },
    { name: 'Negociación', value: filteredClients.filter(c => c.estado === 'Negociación').length },
    { name: 'Cerrado', value: filteredClients.filter(c => c.estado === 'Venta cerrada').length },
  ];

  const COLORS = ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-foreground">Dashboard <span className="text-primary">SaaS Pro</span></h2>
          <p className="text-muted-foreground mt-2 font-semibold text-lg">Bienvenido al centro de control de tu fuerza de ventas.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="bg-card border-border rounded-2xl px-5 h-12 font-black text-[10px] uppercase tracking-widest shadow-sm hover:border-primary transition-all text-foreground"
                >
                  <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
                  {rangeLabels[range]}
                  <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="rounded-2xl p-2 border-border shadow-xl bg-card min-w-[180px]">
              <DropdownMenuItem onClick={() => setRange('today')} className="rounded-xl font-bold text-xs py-2.5 cursor-pointer text-foreground">Hoy</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRange('week')} className="rounded-xl font-bold text-xs py-2.5 cursor-pointer text-foreground">Esta Semana</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRange('month')} className="rounded-xl font-bold text-xs py-2.5 cursor-pointer text-foreground">Este Mes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRange('all')} className="rounded-xl font-bold text-xs py-2.5 cursor-pointer text-foreground">Todo el tiempo</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden lg:flex items-center gap-3 bg-card px-5 py-2.5 rounded-2xl border border-border shadow-sm h-12">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sincronizado</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="glass-card border-none group overflow-hidden relative">
            <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500", stat.bg)} />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className={cn("p-3.5 rounded-2xl transition-all group-hover:rotate-6 duration-300", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider",
                  stat.trend.includes('+') ? "text-success bg-success/10" : "text-primary bg-primary/10"
                )}>
                  {stat.trend.includes('+') && <ArrowUpRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-4xl font-black text-foreground mt-1 tracking-tighter">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div>
              <CardTitle className="text-xl font-black text-foreground">Embudo de Ventas <span className="text-primary">Pro</span></CardTitle>
              <p className="text-sm text-muted-foreground font-semibold mt-1">Distribución de leads por etapa comercial</p>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 rounded-lg bg-muted border border-border text-[10px] font-black text-muted-foreground uppercase tracking-widest">Mensual</div>
              <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">En Vivo</div>
            </div>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 800 }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 800 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderRadius: '20px', 
                    border: '1px solid hsl(var(--border))', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                    color: 'hsl(var(--foreground))'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card border-none">
            <CardHeader className="pb-6">
              <CardTitle className="text-lg font-black text-foreground flex items-center gap-2">
                <Trophy className="w-5 h-5 text-warning" />
                Top Vendedores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {USERS.slice(0, 3).map((user, i) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-black text-foreground">{user.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user.salesCount} ventas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-success">${(user.closedRevenue / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-none bg-slate-950 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Predicción de Cierre
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Probabilidad Promedio</span>
                  <span className="text-primary">72%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '72%' }} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Basado en el comportamiento histórico, se espera cerrar <span className="text-white font-bold">4 leads</span> adicionales esta semana.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
