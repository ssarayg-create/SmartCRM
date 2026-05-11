/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadsList from './components/LeadsList';
import KanbanBoard from './components/KanbanBoard';
import ClientForm from './components/ClientForm';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Client, LeadStatus, User, PlanType, InternalChat, Interaction } from './types';
import { INITIAL_CLIENTS, DEFAULT_BUSINESS_TYPES, USERS, INTERNAL_CHATS } from './constants';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import SettingsView from './components/SettingsView';
import NotificationsView from './components/NotificationsView';
import AuthView from './components/AuthView';
import AnalyticsView from './components/AnalyticsView';
import SalesRanking from './components/SalesRanking';
import PricingView from './components/PricingView';
import ChatView from './components/ChatView';
import InternalChatView from './components/InternalChatView';
import CalendarView from './components/CalendarView';
import ClientDetailView from './components/ClientDetailView';
import OnboardingTour from './components/OnboardingTour';
import AIAssistant from './components/AIAssistant';
import LandingPage from './components/LandingPage';
import { authService } from './services/authService';
import { dataService, ExtendedDateRange } from './lib/data-service';
import { generateMockData } from './lib/data-utils';

function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-12 px-4 md:px-10 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-white">S</div>
            <span className="text-xl font-black tracking-tighter">SmartCRM</span>
          </div>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            La plataforma líder en gestión comercial para el sector POS en Latinoamérica.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Legal</h4>
          <ul className="space-y-3 text-sm font-bold text-slate-400">
            <li><button className="hover:text-primary transition-colors">Políticas de Privacidad</button></li>
            <li><button className="hover:text-primary transition-colors">Términos de Servicio</button></li>
            <li><button className="hover:text-primary transition-colors">Tratamiento de Datos</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Soporte</h4>
          <ul className="space-y-3 text-sm font-bold text-slate-400">
            <li><button className="hover:text-primary transition-colors">Centro de Ayuda</button></li>
            <li><button className="hover:text-primary transition-colors">Documentación API</button></li>
            <li><button className="hover:text-primary transition-colors">Estado del Sistema</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Contacto</h4>
          <ul className="space-y-3 text-sm font-bold text-slate-400">
            <li className="flex items-center gap-2">
              <span className="text-slate-500">Email:</span>
              <a href="mailto:soporte@smartcrm.com" className="hover:text-primary transition-colors">soporte@smartcrm.com</a>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-500">Tel:</span>
              <a href="tel:+573001234567" className="hover:text-primary transition-colors">+57 300 123 4567</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs font-bold text-slate-500">© 2024 SmartCRM. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <button className="text-slate-500 hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></button>
          <button className="text-slate-500 hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></button>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [internalChats, setInternalChats] = useState<InternalChat[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [showTour, setShowTour] = useState(false);
  const [advisors, setAdvisors] = useState<User[]>(USERS);

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Si hay sesión guardada en localStorage dedicada para la demo o persistente
    const demoAuth = localStorage.getItem('auth');
    if (demoAuth && !isAuthenticated) {
      handleLogin(JSON.parse(demoAuth).user);
    }
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // 1. Prioridad: Sesión Local (Híbrida)
        const savedSession = localStorage.getItem('smartcrm_session');
        if (savedSession) {
          const { user, accessToken } = JSON.parse(savedSession);
          setCurrentUser(user);
          setIsAuthenticated(true);
          localStorage.setItem('accessToken', accessToken);
          setIsRefreshing(false);
          return;
        }

        // 2. Fallback: Recuperación mediante Token (Full-stack)
        const { accessToken } = await authService.refreshToken();
        localStorage.setItem('accessToken', accessToken);
        const userResponse = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (userResponse.ok) {
          const user = await userResponse.json();
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.log('No active session found in storage or server');
      } finally {
        setIsRefreshing(false);
      }
    };
    restoreSession();
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('accessToken');
      setIsAuthenticated(false);
      setCurrentUser(null);
    } catch (err) {
      toast.error('Error al cerrar sesión');
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (!currentUser.hasSeenOnboarding) {
        setShowTour(true);
      }
    }
  }, [isAuthenticated, currentUser]);

  const handleTourComplete = () => {
    if (currentUser) {
      const updatedUser = { ...currentUser, hasSeenOnboarding: true };
      setCurrentUser(updatedUser);
      
      // Update DB or local (DB is prioritized in new system)
      // fetch('/api/users/onboarding', { method: 'POST', ... })
    }
    setShowTour(false);
    setActiveTab('dashboard');
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // In professional mode, we fetch these from API
      // fetch('/api/clients').then(...)
      // For demo, we use generateMockData to fulfill "every day since March 3" requirement
      if (clients.length === 0) setClients(generateMockData('all'));
      if (internalChats.length === 0) setInternalChats(INTERNAL_CHATS);
    }
  }, [isAuthenticated, currentUser]);

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [businessTypes, setBusinessTypes] = useState<string[]>(DEFAULT_BUSINESS_TYPES);
  const [selectedChatClient, setSelectedChatClient] = useState<Client | null>(null);

  const [selectedSalespersonFilter, setSelectedSalespersonFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState(false);

  // Sync Date Filtering State
  const [dateRange, setDateRange] = useState<ExtendedDateRange>('all');
  const [customDates, setCustomDates] = useState({ start: '', end: '' });

  useEffect(() => {
    dataService.setClients(clients);
  }, [clients]);

  const filteredByDateClients = useMemo(() => {
    if (dateRange === 'custom') {
      const start = customDates.start ? new Date(customDates.start) : undefined;
      const end = customDates.end ? new Date(customDates.end) : undefined;
      return dataService.filterByRange(clients, 'custom', start, end);
    }
    return dataService.filterByRange(clients, dateRange);
  }, [dateRange, customDates, clients]);

  if (isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-black text-foreground uppercase tracking-widest animate-pulse">SmartCRM verificando sesión...</p>
        </div>
      </div>
    );
  }

  const handleSelectSalesperson = (userId: string) => {
    setSelectedSalespersonFilter(userId);
    setPriorityFilter(false);
    setActiveTab('leads');
  };

  const handleViewPriority = () => {
    setPriorityFilter(true);
    setActiveTab('leads');
  };

  const handleAddLead = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEditLead = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData: Partial<Client>) => {
    if (editingClient) {
      // Check for duplicates excluding the current client
      const isDuplicate = clients.some(c => c.id !== editingClient.id && c.telefono === formData.telefono);
      if (isDuplicate) {
        toast.error('Ya existe un cliente con este número de teléfono');
        return;
      }
      setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...formData } as Client : c));
      toast.success('Cliente actualizado correctamente');
    } else {
      // Check for duplicates
      const isDuplicate = clients.some(c => c.telefono === formData.telefono);
      if (isDuplicate) {
        toast.error('Ya existe un cliente con este número de teléfono');
        return;
      }
      const newClient: Client = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        fechaRegistro: new Date().toISOString(),
        ultimoContacto: new Date().toISOString(),
        proximoSeguimiento: new Date(Date.now() + 86400000 * 2).toISOString(),
        assignedTo: currentUser?.id || 'u1',
        closingProbability: 20,
        messages: [],
        historial: []
      } as Client;
      setClients(prev => [newClient, ...prev]);
      toast.success('Nuevo lead registrado con éxito');
    }
    setIsFormOpen(false);
  };

  const handleMoveLead = (clientId: string, newStatus: LeadStatus) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        let prob = c.closingProbability;
        if (newStatus === 'Ganado') {
          prob = 100;
          toast.success('¡NEGOCIO GANADO!', {
            description: `Felicidades, el negocio ${c.nombreNegocio} ha sido cerrado con éxito. 🏆`,
            duration: 5000,
          });

          // Manejo de Notificaciones con petición de permiso proactiva
          if ('Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification('¡Negocio Ganado! 🏆', {
                body: `El negocio ${c.nombreNegocio} ha pasado a estado Ganado.`,
              });
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  new Notification('¡Negocio Ganado! 🏆', {
                    body: `Felicidades, acabas de cerrar el negocio ${c.nombreNegocio}.`,
                  });
                }
              });
            }
          }
        }
        if (newStatus === 'Propuesta enviada') prob = 85;
        if (newStatus === 'Negociación') prob = 70;
        if (newStatus === 'Presentación') prob = 50;
        if (newStatus === 'Contacto inicial') prob = 30;
        if (newStatus === 'Nuevos prospectos') prob = 10;
        if (newStatus === 'Perdido') prob = 0;
        
        const interaction: Interaction = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          type: 'Nota',
          content: `Estado actualizado a: ${newStatus}`,
          userId: currentUser?.id || 'u1'
        };
        
        return { 
          ...c, 
          estado: newStatus, 
          closingProbability: prob, 
          ultimoContacto: new Date().toISOString(),
          historial: [interaction, ...c.historial] 
        };
      }
      return c;
    }));
    toast.info(`Estado actualizado a: ${newStatus}`);
  };

  const handleAddInteraction = (clientId: string, interaction: Omit<Interaction, 'id'>) => {
    const newInt: Interaction = {
      ...interaction,
      id: Math.random().toString(36).substr(2, 9)
    };

    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return { ...c, historial: [newInt, ...c.historial] };
      }
      return c;
    }));

    if (viewingClient?.id === clientId) {
      setViewingClient(prev => prev ? { ...prev, historial: [newInt, ...prev.historial] } : null);
    }
  };

  const handleUpdateClient = (clientId: string, data: Partial<Client>) => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, ...data } : c
    ));
    if (viewingClient?.id === clientId) {
      setViewingClient(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    setViewingClient(null);
    toast.success("Cliente eliminado correctamente");
  };

  const handleTransferClient = (clientId: string, userId: string) => {
    handleUpdateClient(clientId, { assignedTo: userId });
    toast.success("Cliente transferido con éxito");
  };

  const handleSendMessage = (clientId: string, text: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const newMessage = {
          id: Math.random().toString(36).substr(2, 9),
          senderId: currentUser?.id || 'u1',
          text,
          timestamp: new Date().toISOString()
        };
        return { ...c, messages: [...c.messages, newMessage] };
      }
      return c;
    }));
  };

  const handleUpgrade = (plan: PlanType) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, plan });
      toast.success(`¡Plan actualizado a ${plan}!`);
    }
  };

  if (!isAuthenticated) {
    if (showAuth) {
      return (
        <>
          <AuthView onLogin={handleLogin} initialMode={authMode} />
          <Toaster position="top-right" richColors />
        </>
      );
    }
    return (
      <LandingPage 
        onGetStarted={() => {
          setAuthMode('register');
          setShowAuth(true);
        }} 
        onLogin={() => {
          setAuthMode('login');
          setShowAuth(true);
        }}
      />
    );
  }

  // Filtrar clientes si el usuario es Vendedor
  const visibleClients = currentUser?.role === 'Admin' 
    ? filteredByDateClients 
    : filteredByDateClients.filter(c => c.assignedTo === currentUser?.id);

  return (
    <div className="flex min-h-screen bg-background font-sans overflow-x-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userProfile={{ name: currentUser?.name || '', email: currentUser?.email || '' }}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      
      <main className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-300">
        <header className="h-20 bg-card/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 md:px-10 z-30 sticky top-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 -ml-2 text-muted-foreground hover:text-primary lg:hidden bg-muted/50 rounded-xl transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block w-1.5 h-6 bg-primary rounded-full" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] leading-none mb-1">Módulo Actual</span>
                <span className="text-lg font-black text-slate-900 dark:text-white capitalize tracking-tighter leading-none">
                  {activeTab === 'leads' ? 'Gestión de Leads' : 
                   activeTab === 'pipeline' ? 'Pipeline Comercial' : 
                   activeTab === 'calendar' ? 'Calendario Empresarial' : 
                   activeTab === 'chat' ? 'Comunicaciones' : 
                   activeTab === 'analytics' ? 'Inteligencia de Datos' : 
                   activeTab === 'ranking' ? 'Panel de Ventas' : activeTab}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-2xl border border-border">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Servidor Operativo</span>
            </div>
            
            <button 
              onClick={() => setActiveTab('notifications')}
              className="relative p-3 text-muted-foreground hover:text-primary transition-all bg-muted hover:bg-primary/5 rounded-2xl group active:scale-90"
            >
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-card ring-4 ring-rose-500/20" />
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>

            <div className="hidden md:flex -space-x-3 hover:translate-x-3 transition-transform cursor-pointer">
              {USERS.slice(0, 3).map((u, i) => (
                <div 
                  key={u.id} 
                  className={cn(
                    "w-10 h-10 rounded-2xl border-[3px] border-card bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xs font-black text-primary shadow-lg transition-all hover:-translate-y-2 overflow-hidden",
                    i === 0 ? "relative z-30" : i === 1 ? "relative z-20" : "relative z-10"
                  )}
                  title={u.name}
                >
                  {u.avatar && u.avatar.startsWith('http') ? (
                    <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    u.avatar
                  )}
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-10">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard 
                clients={visibleClients} 
                onViewPriority={handleViewPriority}
                dateRange={dateRange}
                setDateRange={setDateRange}
                customDates={customDates}
                setCustomDates={setCustomDates}
              />
            )}
            {activeTab === 'leads' && (
              <LeadsList 
                clients={visibleClients} 
                onAddLead={handleAddLead} 
                onEditLead={handleEditLead}
                onViewLead={(c) => setViewingClient(c)}
                onOpenChat={(c) => {
                  setSelectedChatClient(c);
                  setActiveTab('client-chat');
                }}
                initialFilterUser={selectedSalespersonFilter}
                initialFilterPriority={priorityFilter}
                onFilterReset={() => setPriorityFilter(false)}
              />
            )}
            {activeTab === 'pipeline' && (
              <KanbanBoard 
                clients={visibleClients} 
                onMoveLead={handleMoveLead} 
                onViewLead={(c) => setViewingClient(c)}
                currentUserId={currentUser?.id || 'u1'}
              />
            )}
            {activeTab === 'calendar' && (
              <CalendarView 
                currentUser={currentUser!}
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsView 
                clients={visibleClients}
                dateRange={dateRange}
                setDateRange={setDateRange}
                customDates={customDates}
                setCustomDates={setCustomDates}
              />
            )}
            {activeTab === 'ranking' && <SalesRanking clients={visibleClients} onSelectUser={handleSelectSalesperson} />}
            {activeTab === 'pricing' && <PricingView currentPlan={currentUser?.plan || 'Básico'} onUpgrade={handleUpgrade} />}
            {activeTab === 'chat' && currentUser && (
              <InternalChatView 
                currentUser={currentUser} 
                initialChats={internalChats} 
                onUpdateChats={setInternalChats}
              />
            )}
            {activeTab === 'client-chat' && selectedChatClient && (
              <ChatView 
                client={selectedChatClient} 
                onSendMessage={handleSendMessage} 
              />
            )}
            {activeTab === 'settings' && (
              <SettingsView 
                userProfile={{ name: currentUser?.name || '', email: currentUser?.email || '' }} 
                setUserProfile={(p) => setCurrentUser(prev => prev ? { ...prev, ...p } : null)}
                businessTypes={businessTypes}
                setBusinessTypes={setBusinessTypes}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                advisors={advisors}
                onUpdateAdvisors={setAdvisors}
              />
            )}
            {activeTab === 'notifications' && (
              <NotificationsView 
                clients={visibleClients} 
                onViewLead={(c) => setViewingClient(c)}
                onNavigateToAnalytics={() => setActiveTab('analytics')}
              />
            )}
          </div>
        </div>
        <Footer />
      </main>

      <ClientForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onSubmit={handleFormSubmit}
        initialData={editingClient}
        businessTypes={businessTypes}
      />

      {viewingClient && (
        <ClientDetailView 
          client={viewingClient}
          onClose={() => setViewingClient(null)}
          onEdit={(c) => {
            setViewingClient(null);
            handleEditLead(c);
          }}
          onDelete={handleDeleteClient}
          onTransfer={handleTransferClient}
          onUpdateClient={handleUpdateClient}
          onOpenChat={(c) => {
            setViewingClient(null);
            setSelectedChatClient(c);
            setActiveTab('client-chat');
          }}
          onAddInteraction={handleAddInteraction}
        />
      )}
      
      <Toaster position="top-right" richColors />
      <AIAssistant />
      {showTour && (
        <OnboardingTour 
          onComplete={handleTourComplete} 
          onTabChange={setActiveTab} 
        />
      )}
    </div>
  );
}
