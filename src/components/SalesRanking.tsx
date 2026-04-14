import React from 'react';
import { Trophy, Medal, Target, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { USERS } from '../constants';
import { Client } from '../types';

interface SalesRankingProps {
  clients: Client[];
  onSelectUser: (userId: string) => void;
}

export default function SalesRanking({ clients, onSelectUser }: SalesRankingProps) {
  const sortedUsers = [...USERS].map(user => {
    const userClients = clients.filter(c => c.assignedTo === user.id);
    const wonClients = userClients.filter(c => c.estado === 'Venta cerrada');
    return {
      ...user,
      assignedCount: userClients.length,
      wonCount: wonClients.length,
      // Keep original revenue for sorting if needed, or calculate from won clients if possible
      // For now, let's stick to the USERS data for revenue but show real counts
    };
  }).sort((a, b) => b.closedRevenue - a.closedRevenue);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-foreground">Ranking de <span className="text-primary">Vendedores</span></h2>
          <p className="text-muted-foreground mt-2 font-semibold text-lg">Reconocimiento al desempeño y resultados comerciales del equipo.</p>
        </div>
        <div className="flex items-center gap-3 bg-card px-5 py-2.5 rounded-2xl border border-border shadow-sm">
          <Trophy className="w-5 h-5 text-warning" />
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Top Desempeño</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top 3 Cards */}
        {sortedUsers.slice(0, 3).map((user, i) => (
          <Card 
            key={user.id} 
            className={cn(
              "border-none rounded-[2.5rem] overflow-hidden relative cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]",
              i === 0 ? "bg-slate-950 text-white shadow-2xl shadow-primary/20 scale-105 z-10" : "glass-card hover:shadow-xl"
            )}
            onClick={() => onSelectUser(user.id)}
          >
            {i === 0 && (
              <div className="absolute top-0 right-0 p-8">
                <Trophy className="w-12 h-12 text-warning opacity-20" />
              </div>
            )}
            <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className={cn(
                  "w-24 h-24 rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-xl",
                  i === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                )}>
                  {user.avatar}
                </div>
                <div className={cn(
                  "absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg",
                  i === 0 ? "bg-warning text-slate-900" : i === 1 ? "bg-slate-300 text-slate-600" : "bg-orange-300 text-orange-900"
                )}>
                  {i === 0 ? <Trophy className="w-5 h-5" /> : <Medal className="w-5 h-5" />}
                </div>
              </div>

              <div>
                <h3 className={cn("text-2xl font-black tracking-tight", i === 0 ? "text-white" : "text-foreground")}>{user.name}</h3>
                <p className={cn("text-sm font-bold mt-1", i === 0 ? "text-slate-400" : "text-muted-foreground")}>{user.role}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full pt-4">
                <div className={cn("p-4 rounded-3xl", i === 0 ? "bg-white/5 border border-white/10" : "bg-muted border border-border")}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asignados</p>
                  <p className={cn("text-xl font-black mt-1", i === 0 ? "text-white" : "text-foreground")}>{user.assignedCount}</p>
                </div>
                <div className={cn("p-4 rounded-3xl", i === 0 ? "bg-white/5 border border-white/10" : "bg-muted border border-border")}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ganados</p>
                  <p className={cn("text-xl font-black mt-1", i === 0 ? "text-white" : "text-foreground")}>{user.wonCount}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-success">
                <ArrowUp className="w-4 h-4" />
                <span>+15% vs mes anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full List */}
      <Card className="glass-card border-none overflow-hidden">
        <CardHeader className="p-8 border-b border-border">
          <CardTitle className="text-xl font-black text-foreground">Tabla de Posiciones</CardTitle>
          <CardDescription className="font-bold text-muted-foreground">Resultados acumulados del trimestre actual.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Posición</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vendedor</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Asignados</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ganados</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ingresos Totales</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tasa de Éxito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedUsers.map((user, i) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-muted/50 transition-colors group cursor-pointer"
                    onClick={() => onSelectUser(user.id)}
                  >
                    <td className="px-8 py-6">
                      <span className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm",
                        i === 0 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                      )}>
                        #{i + 1}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-xs">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground">{user.name}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-foreground">{user.assignedCount}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-foreground">{user.wonCount}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-foreground">${user.closedRevenue.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${user.assignedCount > 0 ? (user.wonCount / user.assignedCount * 100) : 0}%` }} 
                          />
                        </div>
                        <span className="text-xs font-black text-muted-foreground">
                          {user.assignedCount > 0 ? Math.round(user.wonCount / user.assignedCount * 100) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
