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
import VideoPresentation from './components/VideoPresentation';

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
  const [showVideo, setShowVideo] = useState(false);

  // Check for standalone video mode
  const isStandaloneVideo = typeof window !== 'undefined' && window.location.search.includes('video=true');

  useEffect(() => {
    if (isStandaloneVideo) {
      setShowVideo(true);
    }
  }, [isStandaloneVideo]);

  if (isStandaloneVideo && showVideo) {
    return (
      <div className="h-screen w-screen bg-slate-950">
        <VideoPresentation onClose={() => {
          // In standalone mode, closing just resets or stays there
          window.location.search = '';
        }} />
      </div>
    );
  }

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const tourShown = localStorage.getItem(`tour_shown_${currentUser.id}`);
      if (!tourShown) {
        setShowTour(true);
      }
    }
  }, [isAuthenticated, currentUser]);

  const handleTourComplete = () => {
    if (currentUser) {
      localStorage.setItem(`tour_shown_${currentUser.id}`, 'true');
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
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const newInt: Interaction = {
          ...interaction,
          id: Math.random().toString(36).substr(2, 9)
        };
        return { ...c, historial: [newInt, ...c.historial] };
      }
      return c;
    }));
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
        onShowVideo={() => setShowVideo(true)}
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

      {showVideo && (
        <VideoPresentation onClose={() => setShowVideo(false)} />
      )}
    </div>
  );
}
