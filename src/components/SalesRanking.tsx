import React, { useState } from 'react';
import { Trophy, Medal, Target, TrendingUp, ArrowUp, ArrowDown, Star, Award, Zap, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { USERS } from '../constants';
import { Client } from '../types';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

interface SalesRankingProps {
  clients: Client[];
  onSelectUser: (userId: string) => void;
}

export default function SalesRanking({ clients, onSelectUser }: SalesRankingProps) {
  const [isExporting, setIsExporting] = useState(false);

  const sortedUsers = [...USERS].map(user => {
    const userClients = clients.filter(c => c.assignedTo === user.id);
    const wonClients = userClients.filter(c => c.estado === 'Ganado');
    const totalRev = wonClients.reduce((acc, c) => acc + c.presupuestoEstimado, 0);
    const conversion = userClients.length > 0 ? (wonClients.length / userClients.length) * 100 : 0;
    
    return {
      ...user,
      assignedCount: userClients.length,
      wonCount: wonClients.length,
      realRevenue: totalRev,
      conversion: conversion.toFixed(1)
    };
  }).sort((a, b) => b.realRevenue - a.realRevenue);

  const handleExportAdvisor = async (advisor: any) => {
    setIsExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const brandColor = '2563EB';
      
      // Hoja 1: PERFORMANCE SUMMARY
      const summarySheet = workbook.addWorksheet('Desempeño Individual');
      summarySheet.addRow(['SMARTCRM - REPORTE DE RENDIMIENTO COMERCIAL']);
      summarySheet.addRow(['Asesor:', advisor.name]);
      summarySheet.addRow(['Periodo:', 'Trimestre Actual']);
      summarySheet.addRow(['Fecha Reporte:', new Date().toLocaleDateString()]);
      summarySheet.addRow([]);

      const headerRow = summarySheet.addRow(['INDICADOR', 'VALOR']);
      headerRow.eachCell(c => {
        c.font = { bold: true, color: { argb: 'FFFFFF' } };
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: brandColor } };
      });

      summarySheet.addRow(['Leads Asignados', advisor.assignedCount]);
      summarySheet.addRow(['Ventas Ganadas', advisor.wonCount]);
      summarySheet.addRow(['Facturación Total', advisor.realRevenue]);
      summarySheet.addRow(['Ticket Promedio', advisor.wonCount > 0 ? advisor.realRevenue / advisor.wonCount : 0]);
      summarySheet.addRow(['Tasa de Conversión', `${advisor.conversion}%`]);
      summarySheet.addRow(['Puntos de Gamificación', advisor.points]);

      summarySheet.getColumn(1).width = 30;
      summarySheet.getColumn(2).width = 20;
      summarySheet.getColumn(2).numFmt = '"$"#,##0';

      // Hoja 2: DETALLE DE NEGOCIOS
      const detailSheet = workbook.addWorksheet('Historial de Negocios');
      const detailHeader = detailSheet.addRow(['Fecha', 'Cliente / Negocio', 'Contacto', 'Estado', 'Valor', 'Prioridad']);
      detailHeader.eachCell(c => {
        c.font = { bold: true, color: { argb: 'FFFFFF' } };
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } };
      });

      const advisorClients = clients.filter(c => c.assignedTo === advisor.id);
      advisorClients.forEach(c => {
        detailSheet.addRow([
          new Date(c.fechaRegistro).toLocaleDateString(),
          c.nombreNegocio,
          c.nombreContacto,
          c.estado,
          c.presupuestoEstimado,
          // c.priority removed as it was not in Client type originally, using status instead
          c.estado === 'Ganado' ? 'ALTA' : 'MEDIA'
        ]);
      });
      detailSheet.getColumn(5).numFmt = '"$"#,##0';
      detailSheet.columns.forEach(col => col.width = 20);

      // Hoja 3: ANÁLISIS E INSIGHTS
      const insightSheet = workbook.addWorksheet('Análisis Estratégico');
      insightSheet.addRow(['OBSERVACIONES DE DESEMPEÑO']);
      insightSheet.addRow([]);
      
      const conv = parseFloat(advisor.conversion);
      const observations = [
        `• El asesor ${advisor.name} mantiene una tasa de conversión de ${conv}%.`,
        conv > 20 ? '• Desempeño excepcional: Se recomienda como mentor para nuevos ingresos.' : '• Oportunidad de mejora: Reforzar técnicas de cierre en etapa de negociación.',
        `• Ha generado un total de $${advisor.realRevenue.toLocaleString()} en ingresos reales.`,
        `• El ticket promedio por venta es de $${(advisor.wonCount > 0 ? advisor.realRevenue / advisor.wonCount : 0).toLocaleString()}.`
      ];

      observations.forEach(obs => {
        const row = insightSheet.addRow([obs]);
        row.font = { italic: true };
      });
      insightSheet.getColumn(1).width = 100;

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Reporte_Individual_${advisor.name.replace(' ', '_')}.xlsx`);
      toast.success(`Reporte empresarial de ${advisor.name} exportado`);
    } catch (e) {
      toast.error('Error al exportar reporte individual');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportRanking = async () => {
    setIsExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Ranking Comercial');

      // Header Branding
      sheet.mergeCells('A1:G2');
      const titleCell = sheet.getCell('A1');
      titleCell.value = 'RANKING CORPORATIVO DE VENTAS - SMARTCRM';
      titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFF' } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } };

      sheet.addRow(['Fecha Reporte:', new Date().toLocaleString()]);
      sheet.addRow(['Periodo de evaluación:', 'Trimestre en Curso']);
      sheet.addRow([]);

      const headerRow = sheet.addRow(['#', 'Nombre del Asesor', 'Leads Gestionados', 'Cierres', 'Eficiencia (%)', 'Recaudo Total', 'Puntos']);
      headerRow.eachCell(c => {
        c.font = { bold: true, color: { argb: 'FFFFFF' } };
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } };
      });

      sortedUsers.forEach((user, i) => {
        sheet.addRow([
          i + 1,
          user.name,
          user.assignedCount,
          user.wonCount,
          `${user.conversion}%`,
          user.realRevenue,
          user.points
        ]);
      });

      sheet.columns.forEach(col => { col.width = 18; });
      sheet.getColumn(1).width = 5;
      sheet.getColumn(2).width = 25;
      sheet.getColumn(6).numFmt = '"$"#,##0';
      
      // Zebra stripes
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 6 && rowNumber % 2 === 0) {
          row.eachCell(cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8FAFC' } };
          });
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Ranking_Ventas_${new Date().getTime()}.xlsx`);
      toast.success('Ranking empresarial exportado');
    } catch (error) {
      toast.error('Error al exportar ranking');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-foreground">Ranking de <span className="text-primary">Vendedores</span></h2>
          <p className="text-muted-foreground mt-2 font-semibold text-lg">Reconocimiento al desempeño y resultados comerciales del equipo.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleExportRanking}
            disabled={isExporting}
            variant="outline"
            className="rounded-2xl border-border font-black text-xs uppercase tracking-widest h-11 px-6 hover:bg-primary/5 hover:border-primary transition-all shadow-sm"
          >
            {isExporting ? <Zap className="w-4 h-4 mr-2 animate-spin text-primary" /> : <Download className="w-4 h-4 mr-2 text-primary" />}
            Exportar Ranking
          </Button>
          <div className="hidden sm:flex items-center gap-3 bg-card px-5 py-2.5 rounded-2xl border border-border shadow-sm">
            <Trophy className="w-4 h-4 text-warning" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Top Desempeño</span>
          </div>
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
                  "w-24 h-24 rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-xl overflow-hidden",
                  i === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                )}>
                  {user.avatar && user.avatar.startsWith('http') ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    user.avatar
                  )}
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
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Puntos</p>
                  <p className={cn("text-xl font-black mt-1 flex items-center justify-center gap-1", i === 0 ? "text-primary" : "text-foreground")}>
                    <Zap className="w-4 h-4" />
                    {user.points}
                  </p>
                </div>
                <div className={cn("p-4 rounded-3xl", i === 0 ? "bg-white/5 border border-white/10" : "bg-muted border border-border")}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ganados</p>
                  <p className={cn("text-xl font-black mt-1", i === 0 ? "text-white" : "text-foreground")}>{user.wonCount}</p>
                </div>
              </div>

              {user.medals.length > 0 && (
                <div className="flex gap-2 pt-2">
                  {user.medals.map(medal => (
                    <div key={medal.id} title={medal.title} className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
                      medal.type === 'oro' ? "bg-warning/20 text-warning" : 
                      medal.type === 'plata' ? "bg-slate-300/20 text-slate-400" : "bg-orange-300/20 text-orange-600"
                    )}>
                      <Award className="w-5 h-5" />
                    </div>
                  ))}
                </div>
              )}

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
        <CardHeader className="p-8 border-b border-border flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black text-foreground">Tabla de Posiciones</CardTitle>
            <CardDescription className="font-bold text-muted-foreground">Resultados acumulados del trimestre actual.</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Meta Mensual Equipo</p>
              <p className="text-sm font-black text-foreground">$50.000.000</p>
            </div>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[75%]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Posición</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vendedor</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Puntos</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ganados</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Logros</th>
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
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-xs overflow-hidden">
                          {user.avatar && user.avatar.startsWith('http') ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            user.avatar
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground">{user.name}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1 text-sm font-black text-primary">
                        <Zap className="w-3 h-3" />
                        {user.points}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-foreground">{user.wonCount}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-1">
                        {user.achievements.slice(0, 3).map(a => (
                          <span key={a.id} title={a.title} className="text-lg">{a.icon}</span>
                        ))}
                        {user.achievements.length > 3 && (
                          <span className="text-[10px] font-bold text-muted-foreground flex items-center">+{user.achievements.length - 3}</span>
                        )}
                        {user.achievements.length === 0 && <span className="text-xs text-muted-foreground italic">Sin logros</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[80px]">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${user.conversion}%` }} 
                          />
                        </div>
                        <span className="text-xs font-black text-muted-foreground">
                          {user.conversion}%
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-2 hover:bg-primary/10 rounded-lg h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportAdvisor(user);
                          }}
                        >
                          <Download className="w-3.5 h-3.5 text-primary" />
                        </Button>
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
