import React, { useState, useMemo } from 'react';
import { dataService, ExtendedDateRange } from '../lib/data-service';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  ChevronDown,
  Download,
  Loader2,
  TrendingDown,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Filter,
  PhoneIncoming, 
  Sparkles
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
import { cn, formatCurrency } from '@/lib/utils';
import { USERS } from '../constants';
import { generateMockData } from '../lib/data-utils';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

interface DashboardProps {
  clients: Client[];
  onViewPriority: () => void;
  dateRange: ExtendedDateRange;
  setDateRange: (r: ExtendedDateRange) => void;
  customDates: { start: string; end: string };
  setCustomDates: (d: { start: string; end: string }) => void;
}

export default function Dashboard({ 
  clients: filteredClients, 
  onViewPriority,
  dateRange,
  setDateRange,
  customDates,
  setCustomDates
}: DashboardProps) {
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const summary = useMemo(() => dataService.getSummary(filteredClients), [filteredClients]);
  const insights = useMemo(() => dataService.getInsights(filteredClients), [filteredClients]);

  const { totalLeads, wonLeads, totalRevenue, conversionRate, avgTicket, contactedLeads } = summary;

  const rangeLabels: Record<ExtendedDateRange, string> = {
    today: 'Hoy',
    week: 'Esta Semana',
    current_month: 'Mes Actual',
    last_month: 'Mes Anterior',
    all: 'Histórico',
    custom: 'Personalizado'
  };

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'SmartCRM Executive Service';
      workbook.lastModifiedBy = 'SmartCRM Administrator';
      workbook.created = new Date();
      
      // Hoja 1: RESUMEN EJECUTIVO
      const summarySheet = workbook.addWorksheet('Resumen Ejecutivo');
      
      // Estilos Corporativos
      const primaryColor = 'FF2563EB';
      const secondaryColor = 'FF1E293B';
      const whiteColor = 'FFFFFFFF';
      
      // Header Corporativo
      summarySheet.mergeCells('A1:F3');
      const headerCell = summarySheet.getCell('A1');
      headerCell.value = 'SMARTCRM SAAS POS - REPORTE EJECUTIVO COMERCIAL';
      headerCell.font = { bold: true, size: 20, color: { argb: whiteColor } };
      headerCell.alignment = { vertical: 'middle', horizontal: 'center' };
      headerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: secondaryColor.replace('FF', '') } };

      summarySheet.addRow([]);
      summarySheet.addRow(['INFORME DE GESTIÓN Y PERSPECTIVAS COMERCIALES']);
      summarySheet.getRow(5).font = { bold: true, size: 14, color: { argb: primaryColor } };
      
      summarySheet.addRow(['FECHA DE EMISIÓN:', new Date().toLocaleDateString('es-CO', { dateStyle: 'long' })]);
      summarySheet.addRow(['PERIODO ANALIZADO:', rangeLabels[dateRange].toUpperCase()]);
      summarySheet.addRow(['SISTEMA:', 'SMARTCRM POS V2.0']);
      
      summarySheet.addRow([]);

      // KPIs Principales
      summarySheet.addRow(['INDICADORES CLAVE DE DESEMPEÑO (KPIs)']).font = { bold: true, size: 12 };
      
      const kpiHeader = summarySheet.addRow(['INDICADOR', 'VALOR ACTUAL', 'TENDENCIA', 'ANÁLISIS']);
      kpiHeader.eachCell(c => {
        c.font = { bold: true, color: { argb: whiteColor } };
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: primaryColor.replace('FF', '') } };
      });

      summarySheet.addRow(['Volumen de Leads', totalLeads, 'Estable', 'Captación de prospectos en el periodo.']);
      summarySheet.addRow(['Ventas Efectivas (Won)', wonLeads, 'Incremento', 'Cierres confirmados y contratos firmados.']);
      summarySheet.addRow(['Ingresos Brutos (COP)', totalRevenue, 'Ascendente', 'Valor total de negocios cerrados.']);
      summarySheet.addRow(['Ticket Promedio', avgTicket, 'Óptimo', 'Valor promedio por cada venta exitosa.']);
      summarySheet.addRow(['Tasa de Conversión', `${conversionRate.toFixed(2)}%`, 'Crítico', 'Relación entre leads y ventas cerradas.']);

      summarySheet.getCell('B13').numFmt = '"$ "#,##0';
      summarySheet.getCell('B14').numFmt = '"$ "#,##0';

      summarySheet.addRow([]);
      
      // Secciòn de Conclusiones Automáticas IA
      summarySheet.addRow(['CONCLUSIONES Y RECOMENDACIONES ESTRATÉGICAS']).font = { bold: true, size: 12 };
      summarySheet.addRow(['Basado en el análisis de datos del periodo, se concluye:']).font = { italic: true };
      
      insights.forEach((insight, idx) => {
        summarySheet.addRow([`${idx + 1}. ${insight}`]);
      });

      summarySheet.addRow([]);
      summarySheet.addRow(['ACCIONES RECOMENDADAS:']).font = { bold: true };
      summarySheet.addRow(['• Aumentar el seguimiento en leads con probabilidad superior al 70%.']);
      summarySheet.addRow(['• Optimizar la etapa de "Presentación" para elevar la tasa de conversión.']);
      summarySheet.addRow(['• Revisar la estrategia de captación si el ticket promedio desciende del objetivo.']);

      summarySheet.getColumn(1).width = 40;
      summarySheet.getColumn(2).width = 25;
      summarySheet.getColumn(3).width = 15;
      summarySheet.getColumn(4).width = 50;

      // Hoja 2: DATA DETALLADA
      const dataSheet = workbook.addWorksheet('Detalle de Clientes');
      const header = dataSheet.addRow(['FECHA REGISTRO', 'NEGOCIO', 'CONTACTO', 'CIUDAD', 'ESTADO', 'VALOR ESTIMADO', 'ASESOR', 'ÉXITO %']);
      
      header.eachCell(c => {
        c.font = { bold: true, color: { argb: whiteColor } };
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF475569'.replace('FF', '') } };
        c.alignment = { horizontal: 'center' };
      });

      filteredClients.forEach(c => {
        dataSheet.addRow([
          new Date(c.fechaRegistro).toLocaleDateString(),
          c.nombreNegocio,
          c.nombreContacto,
          c.ciudad,
          c.estado,
          c.presupuestoEstimado,
          USERS.find(u => u.id === c.assignedTo)?.name || 'Sin asignar',
          c.closingProbability / 100
        ]);
      });

      dataSheet.getColumn(7).numFmt = '"$ "#,##0';
      dataSheet.getColumn(9).numFmt = '0%';
      dataSheet.columns.forEach(col => col.width = 20);

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `SMARTCRM_REPORTE_EJECUTIVO_${new Date().getTime()}.xlsx`);
      toast.success('Reporte Excel Profesional generado');
    } catch (error) {
      console.error(error);
      toast.error('Error al exportar Excel');
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Portada Moderna
      doc.setFillColor(15, 23, 42); // Dark Slate
      doc.rect(0, 0, pageWidth, 297, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(36);
      doc.setFont("helvetica", "bold");
      doc.text('SMARTCRM', pageWidth / 2, 80, { align: 'center' });
      
      doc.setFontSize(24);
      doc.text('INFORME EJECUTIVO', pageWidth / 2, 100, { align: 'center' });
      doc.setFontSize(16);
      doc.text('GESTIÓN COMERCIAL POS', pageWidth / 2, 115, { align: 'center' });
      
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(1.5);
      doc.line(70, 125, 140, 125);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Periodo: ${rangeLabels[dateRange]}`, pageWidth / 2, 145, { align: 'center' });
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO', { dateStyle: 'full' })}`, pageWidth / 2, 155, { align: 'center' });
      
      // Página 2
      doc.addPage();
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text('Resumen de Operaciones', 14, 30);
      
      // KPIs visuales
      const kpoBg = [248, 250, 252];
      doc.setFillColor(kpoBg[0], kpoBg[1], kpoBg[2]);
      doc.roundedRect(14, 40, 55, 40, 5, 5, 'F');
      doc.roundedRect(77, 40, 55, 40, 5, 5, 'F');
      doc.roundedRect(140, 40, 55, 40, 5, 5, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text('LEADS', 20, 52);
      doc.text('CONVERSIÓN', 83, 52);
      doc.text('INGRESOS', 146, 52);
      
      doc.setFontSize(18);
      doc.setTextColor(37, 99, 235);
      doc.text(totalLeads.toString(), 20, 68);
      doc.text(`${conversionRate.toFixed(1)}%`, 83, 68);
      doc.text(`$${(totalRevenue/1000000).toFixed(1)}M`, 146, 68);
      
      // Tabla Detallada
      autoTable(doc, {
        startY: 95,
        head: [['Negocio', 'Estado', 'Valor Estimado', 'Probabilidad']],
        body: filteredClients.slice(0, 12).map(c => [
          c.nombreNegocio,
          c.estado,
          `$ ${c.presupuestoEstimado.toLocaleString()}`,
          `${c.closingProbability}%`
        ]),
        headStyles: { fillColor: [30, 41, 59], fontSize: 10 },
        styles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [249, 250, 251] }
      });

      // Página 3: Conclusiones
      doc.addPage();
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text('Análisis y Conclusiones', 14, 30);
      
      doc.setFontSize(11);
      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "italic");
      
      let y = 45;
      insights.forEach(insight => {
        const lines = doc.splitTextToSize(`• ${insight}`, 180);
        doc.text(lines, 14, y);
        y += (lines.length * 7) + 5;
      });

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text('Recomendación Estratégica:', 14, y + 10);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const conclusion = "Se recomienda priorizar el seguimiento en las etapas finales del embudo (Negociación y Propuesta) para maximizar el ROI del periodo. La automatización de procesos POS sigue siendo el principal motor de interés de los leads.";
      const splitConclusion = doc.splitTextToSize(conclusion, 180);
      doc.text(splitConclusion, 14, y + 18);

      doc.save(`SMARTCRM_REPORTE_EJECUTIVO_${new Date().getTime()}.pdf`);
      toast.success('Informe PDF Corporativo generado');
    } catch (error) {
      console.error(error);
      toast.error('Error al generar PDF');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const stats = [
    { label: 'Leads Totales', value: totalLeads, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', trend: 'Base de Datos' },
    { label: 'Ventas Ganadas', value: wonLeads, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: 'Cierres' },
    { label: 'Ingresos Totales', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-100', trend: 'COP' },
    { label: 'Ticket Promedio', value: formatCurrency(avgTicket), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100', trend: 'Valor' },
    { label: 'Conversión', value: `${conversionRate.toFixed(1)}%`, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-100', trend: 'Efectividad' },
  ];

  const statusData = [
    { name: 'Nuevos', value: filteredClients.filter(c => c.estado === 'Nuevos prospectos').length },
    { name: 'Contactados', value: filteredClients.filter(c => c.estado === 'Contacto inicial').length },
    { name: 'Presentación', value: filteredClients.filter(c => c.estado === 'Presentación').length },
    { name: 'Negociación', value: filteredClients.filter(c => c.estado === 'Negociación').length },
    { name: 'Ganados', value: wonLeads },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">Métricas <span className="text-primary italic">Comerciales</span></h2>
          <p className="text-muted-foreground font-semibold text-lg mt-1">Análisis profundo del rendimiento POS.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2 bg-card p-1.5 rounded-2xl border border-border shadow-sm">
            {(['today', 'week', 'current_month', 'last_month', 'all', 'custom'] as ExtendedDateRange[]).map((r) => (
              <Button
                key={r}
                variant={dateRange === r ? "default" : "ghost"}
                size="sm"
                onClick={() => setDateRange(r)}
                className={cn(
                  "rounded-xl font-black text-[10px] uppercase tracking-wider px-3",
                  dateRange === r ? "shadow-lg bg-primary" : "text-muted-foreground"
                )}
              >
                {rangeLabels[r]}
              </Button>
            ))}
          </div>

          {dateRange === 'custom' && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
              <div className="flex flex-col">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 ml-1">Inicio</Label>
                <Input 
                  type="date" 
                  className="h-10 rounded-xl bg-card border-border font-bold text-xs" 
                  value={customDates.start}
                  onChange={(e) => setCustomDates({...customDates, start: e.target.value})}
                />
              </div>
              <div className="flex flex-col">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 ml-1">Fin</Label>
                <Input 
                  type="date" 
                  className="h-10 rounded-xl bg-card border-border font-bold text-xs" 
                  value={customDates.end}
                  onChange={(e) => setCustomDates({...customDates, end: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportExcel}
              disabled={isExportingExcel}
              className="rounded-2xl border-border px-5 h-12 font-black text-[10px] uppercase tracking-widest hover:border-primary bg-card"
            >
              {isExportingExcel ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />}
              Excel
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="rounded-2xl border-border px-5 h-12 font-black text-[10px] uppercase tracking-widest hover:border-primary bg-card"
            >
              {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 mr-2 text-rose-600" />}
              PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border border-border rounded-[2.5rem] shadow-xl overflow-hidden group">
            <CardContent className="p-8 relative">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", stat.bg)}>
                <stat.icon className={cn("w-7 h-7", stat.color)} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-3xl text-kpi-value tracking-tighter">{stat.value}</h3>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                <ArrowUpRight className="w-3 h-3 text-primary" />
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card border border-border rounded-[2.5rem] shadow-xl overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-black text-foreground">Embudo Comercial</CardTitle>
                <CardDescription className="text-sm font-semibold mt-1">Cualificación de prospectos por nivel</CardDescription>
              </div>
              <div className="p-3 bg-primary/10 rounded-2xl">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[12, 12, 12, 12]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-8">
           <Card className="bg-slate-900 border-none rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full -mr-24 -mt-24 blur-3xl opacity-50" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">IA Insights</span>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xl font-black leading-tight">Oportunidades de Cierre</h4>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    Prioriza los <span className="text-primary font-black">{filteredClients.filter(c => c.closingProbability > 80).length} negocios</span> más calientes para optimizar el ratio de éxito.
                  </p>
                </div>
                <Button 
                  onClick={onViewPriority}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-2xl shadow-xl shadow-primary/30"
                >
                  Ver Prioritarios
                </Button>
              </div>
           </Card>

           <Card className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl">
              <h4 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" /> Metas Globales
              </h4>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                       <span>Conversión</span>
                       <span className="text-kpi">{conversionRate}% / 25%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${Math.min((Number(conversionRate)/25)*100, 100)}%` }} />
                    </div>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
