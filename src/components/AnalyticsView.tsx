import React, { useState, useMemo } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target, Zap, ArrowUpRight, ArrowDownRight, Calendar, Filter } from 'lucide-react';
import { Client } from '../types';
import { cn } from '@/lib/utils';
import { USERS } from '../constants';

interface AnalyticsViewProps {
  clients: Client[];
}

const COLORS = ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export default function AnalyticsView({ clients }: AnalyticsViewProps) {
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });

  const handleSetCurrentMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    setDateRange({ from: firstDay, to: lastDay });
  };

  const handleSetLastMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    setDateRange({ from: firstDay, to: lastDay });
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      if (!dateRange.from && !dateRange.to) return true;
      const clientDate = new Date(client.fechaRegistro);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
      
      if (fromDate && clientDate < fromDate) return false;
      if (toDate && clientDate > toDate) return false;
      return true;
    });
  }, [clients, dateRange]);

  // Datos por tipo de negocio basados en filtros
  const businessTypeData = useMemo(() => {
    return filteredClients.reduce((acc: any[], client) => {
      const existing = acc.find(item => item.name === client.tipoNegocio);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: client.tipoNegocio, value: 1 });
      }
      return acc;
    }, []);
  }, [filteredClients]);

  // Datos de actividad (dinámicos basados en la distribución de fechas de los clientes filtrados)
  const activityData = useMemo(() => {
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const counts = days.map(day => ({ name: day, leads: 0, sales: 0 }));
    
    filteredClients.forEach(c => {
      const dayIndex = new Date(c.fechaRegistro).getDay();
      counts[dayIndex].leads += 1;
      if (c.estado === 'Venta cerrada') {
        counts[dayIndex].sales += 1;
      }
    });
    
    // Reordenar para empezar en Lunes
    return [...counts.slice(1), counts[0]];
  }, [filteredClients]);

  const totalLeads = filteredClients.length;
  const qualifiedLeads = filteredClients.filter(c => c.estado === 'Demo del sistema POS' || c.estado === 'Negociación' || c.estado === 'Envío de propuesta' || c.estado === 'Venta cerrada').length;
  const wonLeads = filteredClients.filter(c => c.estado === 'Venta cerrada').length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-foreground">Módulo de <span className="text-primary">Analytics</span></h2>
          <p className="text-muted-foreground mt-2 font-semibold text-lg">Visualiza el rendimiento de tu embudo y descubre oportunidades de crecimiento.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-card p-4 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSetCurrentMonth}
              className="rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary"
            >
              Mes Actual
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSetLastMonth}
              className="rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary"
            >
              Mes Anterior
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setDateRange({ from: '', to: '' })}
              className="rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted"
            >
              Limpiar
            </Button>
          </div>
          <div className="h-8 w-px bg-border mx-2 hidden md:block" />
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input 
                type="date" 
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="pl-9 h-10 rounded-xl bg-muted border-none text-[10px] font-bold w-36 text-foreground"
              />
            </div>
            <span className="text-muted-foreground font-black">/</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input 
                type="date" 
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="pl-9 h-10 rounded-xl bg-muted border-none text-[10px] font-bold w-36 text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: totalLeads, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10', trend: 'up', trendVal: '24%' },
          { label: 'Leads Calificados', value: qualifiedLeads, icon: Target, color: 'text-primary', bg: 'bg-primary/10', trend: 'up', trendVal: '12%' },
          { label: 'Conversión', value: `${conversionRate}%`, icon: Zap, color: 'text-warning', bg: 'bg-warning/10', trend: 'up', trendVal: '8%' },
          { label: 'Ventas Cerradas', value: wonLeads, icon: Users, color: 'text-secondary', bg: 'bg-secondary/10', trend: 'up', trendVal: '15%' },
        ].map((stat, i) => (
          <Card key={i} className="glass-card border-none overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:rotate-6", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full",
                  stat.trend === 'up' ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                )}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trendVal}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-foreground mt-1 tracking-tighter">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rendimiento por Tipo de Negocio */}
        <Card className="glass-card border-none overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-black text-foreground">Rendimiento por Segmento</CardTitle>
            <CardDescription className="font-bold text-muted-foreground">Distribución de leads según el tipo de negocio.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={businessTypeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))" 
                  radius={[8, 8, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Actividad Semanal */}
        <Card className="glass-card border-none overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-black text-foreground">Actividad Semanal</CardTitle>
            <CardDescription className="font-bold text-muted-foreground">Comparativa entre generación de leads y cierres.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorLeads)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 glass-card border-none overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-black text-foreground">Distribución</CardTitle>
          </CardHeader>
          <CardContent className="p-8 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={businessTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {businessTypeData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 glass-card border-none overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-black text-foreground">Actividad Reciente</CardTitle>
            <CardDescription className="font-bold text-muted-foreground">Últimos leads registrados en el periodo seleccionado.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {filteredClients.slice(0, 3).map((item, i) => {
              const assignedUser = USERS.find(u => u.id === item.assignedTo);
              return (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border hover:bg-muted transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-xs transition-transform group-hover:scale-110">
                      {assignedUser?.avatar || '👤'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {assignedUser?.name} <span className="text-muted-foreground font-medium">gestionando a</span> {item.nombreNegocio}
                      </p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                        {new Date(item.fechaRegistro).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "font-black text-[10px] uppercase tracking-widest border-none px-3 py-1",
                    item.estado === 'Venta cerrada' ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  )}>
                    {item.estado}
                  </Badge>
                </div>
              );
            })}
            {filteredClients.length === 0 && (
              <div className="py-10 text-center text-muted-foreground font-bold italic">
                No hay actividad registrada en este periodo.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
