import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, ShieldCheck, TrendingUp, Users, PieChart, 
  MessageSquare, Award, ArrowRight, MessageCircle,
  BarChart3, CheckCircle2, Clock, Globe,
  Facebook, Instagram, Linkedin, Twitter, Package, ListChecks, PhoneCall, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const targetAudience = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Restaurantes",
      description: "Gestiona reservas, pedidos y fidelización de comensales de forma integrada."
    },
    {
      icon: <Package className="w-8 h-8 text-indigo-500" />,
      title: "Tiendas Retail",
      description: "Control de inventario en tiempo real y seguimiento de clientes frecuentes."
    },
    {
      icon: <Clock className="w-8 h-8 text-emerald-500" />,
      title: "Minimercados",
      description: "Optimiza la rotación de productos y mejora la facturación en caja."
    },
    {
      icon: <Globe className="w-8 h-8 text-amber-500" />,
      title: "Negocios POS",
      description: "Cualquier negocio que use sistemas de punto de venta y quiera escalar."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Registras tus clientes",
      description: "Centraliza toda tu base de datos de prospectos y clientes actuales en un solo lugar seguro."
    },
    {
      num: "02",
      title: "Gestionas oportunidades",
      description: "Usa nuestro pipeline visual para mover los negocios por etapas personalizadas."
    },
    {
      num: "03",
      title: "Das seguimiento",
      description: "Automatiza recordatorios y mantén una comunicación fluida por WhatsApp y chat."
    },
    {
      num: "04",
      title: "Cierras ventas",
      description: "Analiza tus métricas y optimiza tu proceso para maximizar el retorno de inversión."
    }
  ];

  const detailedBenefits = [
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: "Incrementa la conversión hasta un 30%",
      description: "Nuestra lógica de seguimiento automatizado asegura que no se pierda ningún lead en el camino."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-indigo-500" />,
      title: "Analítica nivel empresarial",
      description: "Reportes en tiempo real sobre el rendimiento de tu equipo y proyecciones de venta precisas."
    },
    {
      icon: <ListChecks className="w-6 h-6 text-emerald-500" />,
      title: "Control total del Pipeline",
      description: "Visualiza cuellos de botella en tu proceso comercial y actúa de inmediato para resolverlos."
    }
  ];

  const handleWhatsApp = () => {
    window.open("https://wa.me/573001234567", "_blank");
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-foreground">Smart<span className="text-primary">CRM</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin} 
              className="hidden sm:block text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Iniciar Sesión
            </button>
            <Button onClick={onGetStarted} className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/10 px-6">
              Empezar Ahora
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-6 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Star className="w-3 h-3 fill-primary" /> El CRM #1 para sistemas POS
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.95] max-w-5xl mx-auto">
              Vende más rápido <br />
              con <span className="text-primary italic">SmartCRM</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
              La plataforma definitiva para negocios con POS que buscan automatizar su gestión comercial y triplicar su tasa de conversión.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button onClick={onGetStarted} size="lg" className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl shadow-primary-500/30 group w-full sm:w-auto">
                Comenzar gratis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={handleWhatsApp} variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-border font-black text-lg hover:bg-muted w-full sm:w-auto">
                Agendar Consultoría
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 mb-24">
        <div className="max-w-6xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-500/20 blur-2xl rounded-[3rem] opacity-75 group-hover:opacity-100 transition duration-1000" />
          <div className="relative bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-700">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop" 
              alt="Plataforma SmartCRM" 
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ¿Para quién es? */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">¿Para quién es <span className="text-primary italic">SmartCRM</span>?</h2>
            <p className="text-muted-foreground font-semibold text-lg max-w-2xl mx-auto">No importa tu sector, si usas un POS, necesitas una herramienta comercial que potencie tus cierres.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {targetAudience.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Cómo funciona? */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-5xl font-black tracking-tighter text-foreground leading-[1.1]">
                  Tu flujo comercial <br />
                  <span className="text-primary italic">optimizado al 100%</span>
                </h2>
                <p className="text-xl text-muted-foreground font-medium">Un proceso circular diseñado para que ningún cliente se quede sin respuesta.</p>
              </div>
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-6 items-start group">
                    <div className="text-4xl font-black text-primary/10 group-hover:text-primary/30 transition-colors leading-none pt-1">
                      {step.num}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-foreground">{step.title}</h3>
                      <p className="text-muted-foreground font-medium">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="h-64 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col items-center justify-center p-6 text-center">
                    <TrendingUp className="w-12 h-12 text-primary mb-4" />
                    <span className="font-black text-primary text-2xl">+45%</span>
                    <span className="text-xs font-bold text-muted-foreground">Conversión promedio</span>
                  </div>
                  <div className="h-48 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col items-center justify-center p-6 text-center">
                    <Users className="w-10 h-10 text-indigo-500 mb-4" />
                    <span className="font-black text-indigo-500 text-xl">10k+</span>
                    <span className="text-xs font-bold text-muted-foreground">Leads procesados</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-48 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center justify-center p-6 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-4" />
                    <span className="font-black text-emerald-500 text-xl">100%</span>
                    <span className="text-xs font-bold text-muted-foreground">Trazabilidad</span>
                  </div>
                  <div className="h-64 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex flex-col items-center justify-center p-6 text-center">
                    <BarChart3 className="w-12 h-12 text-amber-500 mb-4" />
                    <span className="font-black text-amber-500 text-2xl">Real-time</span>
                    <span className="text-xs font-bold text-muted-foreground">Dashboard Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios Detallados */}
      <section className="py-24 px-6 bg-slate-950 text-white rounded-[4rem] mx-6 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white">Resultados Empresariales</h2>
            <p className="text-slate-400 font-bold text-lg">No somos un software más, somos tu socio en crecimiento.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {detailedBenefits.map((benefit, index) => (
              <div key={index} className="space-y-6 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                  {benefit.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white">{benefit.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 text-center relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <Zap className="w-[600px] h-[600px] text-primary" />
        </div>
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <h2 className="text-6xl md:text-7xl font-black tracking-tight text-foreground">
            Escala tu negocio <br />
            <span className="text-primary italic">hoy mismo</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button onClick={onGetStarted} size="lg" className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-2xl shadow-primary-500/40 w-full sm:w-auto">
              Empezar mi Prueba Gratis
            </Button>
            <Button onClick={handleWhatsApp} variant="outline" size="lg" className="h-16 px-12 rounded-2xl border-border font-black text-xl w-full sm:w-auto hover:bg-muted">
              Hablar con Soporte
            </Button>
          </div>
          <p className="text-muted-foreground font-black text-xs uppercase tracking-widest">Sin tarjetas de crédito • Configuración en 5 minutos • Soporte 24/7</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white shadow-lg">S</div>
                <span className="text-2xl font-black tracking-tighter text-foreground">SmartCRM</span>
              </div>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Empoderando a negocios con sistemas POS para que conviertan cada lead en un cliente fiel.
              </p>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors hover:border-primary/30"><Facebook className="w-5 h-5" /></button>
                <button className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors hover:border-primary/30"><Instagram className="w-5 h-5" /></button>
                <button className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors hover:border-primary/30"><Linkedin className="w-5 h-5" /></button>
                <button className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors hover:border-primary/30"><Twitter className="w-5 h-5" /></button>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8">Solución</h4>
              <ul className="space-y-4 text-sm font-bold text-foreground">
                <li><button className="hover:text-primary transition-colors">Pipeline Visual</button></li>
                <li><button className="hover:text-primary transition-colors">Analítica Avanzada</button></li>
                <li><button className="hover:text-primary transition-colors">Ranking de Asesores</button></li>
                <li><button className="hover:text-primary transition-colors">Chat Integrado</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8">Recursos</h4>
              <ul className="space-y-4 text-sm font-bold text-foreground">
                <li><button className="hover:text-primary transition-colors">Centro de Soporte</button></li>
                <li><button className="hover:text-primary transition-colors">Blog Comercial</button></li>
                <li><button className="hover:text-primary transition-colors">Webinar POS</button></li>
                <li><button className="hover:text-primary transition-colors">Documentación</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8">Legal</h4>
              <ul className="space-y-4 text-sm font-bold text-foreground">
                <li><button className="hover:text-primary transition-colors">Políticas de Privacidad</button></li>
                <li><button className="hover:text-primary transition-colors">Términos de Servicio</button></li>
                <li><button className="hover:text-primary transition-colors">GDPR / Protección de Datos</button></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:row items-center justify-between gap-8 pt-8 border-t border-border/50">
            <p className="text-xs font-bold text-muted-foreground grayscale opacity-70">SmartCRM © 2024. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <span>Status:</span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                <div className="w-1 H-1 rounded-full bg-emerald-600 animate-pulse" />
                Operativo
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <button 
        onClick={handleWhatsApp}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[60] group"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute right-[110%] bg-white text-slate-900 border border-slate-200 px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
          ¿En qué puedo ayudarte?
        </span>
      </button>
    </div>
  );
}
