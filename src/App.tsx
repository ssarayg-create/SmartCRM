/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadsList from './components/LeadsList';
import KanbanBoard from './components/KanbanBoard';
import ClientForm from './components/ClientForm';
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
import ClientDetailView from './components/ClientDetailView';
import OnboardingTour from './components/OnboardingTour';

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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [internalChats, setInternalChats] = useState<InternalChat[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showTour, setShowTour] = useState(false);
  const [advisors, setAdvisors] = useState<User[]>(USERS);

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
      
      // Persistir en localStorage si no es el usuario especial
      if (currentUser.email !== 'valentinagutierrez@gmail.com') {
        const savedUsers = JSON.parse(localStorage.getItem('crm_users') || '[]');
        const updatedUsers = savedUsers.map((u: any) => 
          u.email === currentUser.email ? updatedUser : u
        );
        localStorage.setItem('crm_users', JSON.stringify(updatedUsers));
      }
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
      if (currentUser.email === 'valentinagutierrez@gmail.com') {
        setClients(INITIAL_CLIENTS);
        setInternalChats(INTERNAL_CHATS);
      } else {
        const savedClients = localStorage.getItem(`clients_${currentUser.id}`);
        setClients(savedClients ? JSON.parse(savedClients) : []);
        
        const savedChats = localStorage.getItem(`chats_${currentUser.id}`);
        setInternalChats(savedChats ? JSON.parse(savedChats) : []);
      }
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    if (isAuthenticated && currentUser && currentUser.email !== 'valentinagutierrez@gmail.com') {
      localStorage.setItem(`clients_${currentUser.id}`, JSON.stringify(clients));
      localStorage.setItem(`chats_${currentUser.id}`, JSON.stringify(internalChats));
    }
  }, [clients, internalChats, isAuthenticated, currentUser]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [businessTypes, setBusinessTypes] = useState<string[]>(DEFAULT_BUSINESS_TYPES);
  const [selectedChatClient, setSelectedChatClient] = useState<Client | null>(null);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const [selectedSalespersonFilter, setSelectedSalespersonFilter] = useState<string>('all');

  const handleSelectSalesperson = (userId: string) => {
    setSelectedSalespersonFilter(userId);
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
        fecha_registro: new Date().toISOString(),
        assignedTo: currentUser?.id || 'u1',
        closingProbability: 20,
        messages: []
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
        if (newStatus === 'Venta cerrada') prob = 100;
        if (newStatus === 'Negociación') prob = 85;
        if (newStatus === 'Envío de propuesta') prob = 70;
        if (newStatus === 'Demo del sistema POS') prob = 50;
        if (newStatus === 'Contacto inicial') prob = 30;
        if (newStatus === 'Nuevo lead') prob = 10;
        
        const interaction: Interaction = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          type: 'Nota',
          content: `Estado actualizado a: ${newStatus}`,
          userId: currentUser?.id || 'u1'
        };
        
        return { ...c, estado: newStatus, closingProbability: prob, historial: [interaction, ...c.historial] };
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
    return (
      <>
        <AuthView onLogin={handleLogin} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  // Filtrar clientes si el usuario es Vendedor
  const visibleClients = currentUser?.role === 'Admin' 
    ? clients 
    : clients.filter(c => c.assignedTo === currentUser?.id);

  return (
    <div className="flex min-h-screen bg-background font-sans overflow-x-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userProfile={{ name: currentUser?.name || '', email: currentUser?.email || '' }}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 lg:ml-72">
        <header className="h-20 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-10 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-muted-foreground hover:text-primary lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <div className="hidden sm:block w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="hidden xs:block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">SmartCRM</span>
            <span className="hidden xs:block text-border mx-1">/</span>
            <span className="text-sm font-black text-foreground capitalize tracking-tight truncate max-w-[100px] sm:max-w-none">
              {activeTab === 'leads' ? 'Clientes' : activeTab === 'pipeline' ? 'Pipeline' : activeTab}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <button 
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <div className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-card" />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-muted rounded-full border border-border">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Online</span>
            </div>
            <div className="flex -space-x-3">
              {USERS.slice(0, 3).map(u => (
                <div key={u.id} className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl border-2 sm:border-4 border-card bg-primary/10 flex items-center justify-center text-[10px] sm:text-xs font-black text-primary shadow-sm">
                  {u.avatar}
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-10">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard clients={visibleClients} />}
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
            {activeTab === 'analytics' && <AnalyticsView clients={visibleClients} />}
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
      {showTour && (
        <OnboardingTour 
          onComplete={handleTourComplete} 
          onTabChange={setActiveTab} 
        />
      )}
    </div>
  );
}
