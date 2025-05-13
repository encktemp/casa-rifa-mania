
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth, User } from './AuthContext';

// Define types
export type Ticket = {
  number: string;
  status: 'available' | 'reserved' | 'purchased';
  ownerId?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerRg?: string;
};

type RaffleContextType = {
  tickets: Ticket[];
  selectedTickets: string[];
  toggleTicketSelection: (number: string) => void;
  clearSelectedTickets: () => void;
  reserveTickets: () => void;
  purchaseTickets: () => void;
  isLoading: boolean;
  refreshTickets: () => void;
  totalTickets: number;
  availableTickets: number;
  reservedTickets: number;
  purchasedTickets: number;
  setAdminTicketOwner: (ticketNumber: string, userId: string) => void;
  totalValue: number;
  ticketPrice: number;
  setTicketStatus: (ticketNumber: string, status: Ticket['status']) => void;
};

// Create context
const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

// LocalStorage keys
const TICKETS_STORAGE_KEY = 'casa-rifa-mania-tickets';
const MAX_TICKETS = 999;
const TICKET_PRICE = 1.0; // R$ 1,00 per ticket

// Helper function to generate ticket numbers with leading zeros
const formatTicketNumber = (num: number): string => {
  return num.toString().padStart(3, '0');
};

// Provider component
export const RaffleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize tickets on mount
  useEffect(() => {
    initializeTickets();
  }, []);

  const initializeTickets = () => {
    const storedTickets = localStorage.getItem(TICKETS_STORAGE_KEY);
    
    if (storedTickets) {
      try {
        setTickets(JSON.parse(storedTickets));
      } catch (error) {
        console.error('Failed to parse stored tickets:', error);
        createInitialTickets();
      }
    } else {
      createInitialTickets();
    }
  };

  const createInitialTickets = () => {
    const newTickets: Ticket[] = Array.from({ length: MAX_TICKETS }, (_, i) => ({
      number: formatTicketNumber(i + 1),
      status: 'available'
    }));
    
    setTickets(newTickets);
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(newTickets));
  };

  const saveTickets = (updatedTickets: Ticket[]) => {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(updatedTickets));
    setTickets(updatedTickets);
  };

  const toggleTicketSelection = (number: string) => {
    // Only allow selection of available tickets
    const ticket = tickets.find(t => t.number === number);
    if (!ticket || ticket.status !== 'available') return;
    
    setSelectedTickets(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      } else {
        return [...prev, number];
      }
    });
  };

  const clearSelectedTickets = () => {
    setSelectedTickets([]);
  };

  const reserveTickets = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Não autorizado",
        description: "Você precisa estar logado para reservar bilhetes.",
      });
      return;
    }

    if (selectedTickets.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum bilhete selecionado",
        description: "Selecione ao menos um bilhete para reservar.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const updatedTickets = tickets.map(ticket => {
        if (selectedTickets.includes(ticket.number)) {
          return {
            ...ticket,
            status: 'reserved' as const,
            ownerId: user.id,
            ownerName: user.name,
            ownerPhone: user.phone,
            ownerRg: user.rg
          };
        }
        return ticket;
      });
      
      saveTickets(updatedTickets);
      
      toast({
        title: "Bilhetes reservados!",
        description: `${selectedTickets.length} bilhete(s) foram reservados com sucesso.`,
      });
      
      setSelectedTickets([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao reservar bilhetes",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseTickets = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Não autorizado",
        description: "Você precisa estar logado para comprar bilhetes.",
      });
      return;
    }

    if (selectedTickets.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum bilhete selecionado",
        description: "Selecione ao menos um bilhete para comprar.",
      });
      return;
    }

    setIsLoading(true);
    
    // In a real app, this would integrate with a payment provider
    // Here we'll just simulate a successful payment after 2 seconds
    setTimeout(() => {
      try {
        // Update ticket status
        const updatedTickets = tickets.map(ticket => {
          if (selectedTickets.includes(ticket.number)) {
            return {
              ...ticket,
              status: 'purchased' as const,
              ownerId: user.id,
              ownerName: user.name,
              ownerPhone: user.phone,
              ownerRg: user.rg
            };
          }
          return ticket;
        });
        
        saveTickets(updatedTickets);
        
        // Update user's purchased tickets in localStorage
        const users = JSON.parse(localStorage.getItem('casa-rifa-mania-users') || '[]');
        const updatedUsers = users.map((u: User) => {
          if (u.id === user.id) {
            return {
              ...u,
              purchasedTickets: [
                ...u.purchasedTickets,
                ...selectedTickets
              ]
            };
          }
          return u;
        });
        
        localStorage.setItem('casa-rifa-mania-users', JSON.stringify(updatedUsers));
        
        // Update current user if needed
        if (user) {
          const updatedUser = {
            ...user,
            purchasedTickets: [
              ...user.purchasedTickets,
              ...selectedTickets
            ]
          };
          
          localStorage.setItem('casa-rifa-mania-user', JSON.stringify(updatedUser));
        }
        
        toast({
          title: "Pagamento confirmado!",
          description: `${selectedTickets.length} bilhete(s) foram comprados com sucesso.`,
        });
        
        setSelectedTickets([]);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro na compra",
          description: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  const refreshTickets = () => {
    initializeTickets();
  };

  const setAdminTicketOwner = (ticketNumber: string, userId: string) => {
    if (!user?.isAdmin) return;
    
    const targetUser = JSON.parse(localStorage.getItem('casa-rifa-mania-users') || '[]')
      .find((u: User) => u.id === userId);
    
    if (!targetUser) {
      toast({
        variant: "destructive",
        title: "Usuário não encontrado",
        description: "O usuário selecionado não existe.",
      });
      return;
    }
    
    const updatedTickets = tickets.map(ticket => {
      if (ticket.number === ticketNumber) {
        return {
          ...ticket,
          status: 'purchased' as const,
          ownerId: targetUser.id,
          ownerName: targetUser.name,
          ownerPhone: targetUser.phone,
          ownerRg: targetUser.rg,
        };
      }
      return ticket;
    });
    
    saveTickets(updatedTickets);
    
    // Update user's purchased tickets in localStorage
    const users = JSON.parse(localStorage.getItem('casa-rifa-mania-users') || '[]');
    const updatedUsers = users.map((u: User) => {
      if (u.id === targetUser.id) {
        return {
          ...u,
          purchasedTickets: [
            ...u.purchasedTickets,
            ticketNumber
          ]
        };
      }
      return u;
    });
    
    localStorage.setItem('casa-rifa-mania-users', JSON.stringify(updatedUsers));
    
    toast({
      title: "Bilhete atribuído",
      description: `O bilhete ${ticketNumber} foi atribuído a ${targetUser.name}.`,
    });
  };

  const setTicketStatus = (ticketNumber: string, status: Ticket['status']) => {
    if (!user?.isAdmin) return;
    
    const updatedTickets = tickets.map(ticket => {
      if (ticket.number === ticketNumber) {
        if (status === 'available') {
          return {
            number: ticket.number,
            status: 'available' as const
          };
        }
        return {
          ...ticket,
          status: status
        };
      }
      return ticket;
    });
    
    saveTickets(updatedTickets);
    
    toast({
      title: "Status atualizado",
      description: `O bilhete ${ticketNumber} agora está ${status === 'available' ? 'disponível' : status === 'reserved' ? 'reservado' : 'comprado'}.`,
    });
  };

  // Calculate statistics
  const totalTickets = tickets.length;
  const availableTickets = tickets.filter(t => t.status === 'available').length;
  const reservedTickets = tickets.filter(t => t.status === 'reserved').length;
  const purchasedTickets = tickets.filter(t => t.status === 'purchased').length;
  const totalValue = selectedTickets.length * TICKET_PRICE;

  return (
    <RaffleContext.Provider value={{
      tickets,
      selectedTickets,
      toggleTicketSelection,
      clearSelectedTickets,
      reserveTickets,
      purchaseTickets,
      isLoading,
      refreshTickets,
      totalTickets,
      availableTickets,
      reservedTickets,
      purchasedTickets,
      setAdminTicketOwner,
      totalValue,
      ticketPrice: TICKET_PRICE,
      setTicketStatus,
    }}>
      {children}
    </RaffleContext.Provider>
  );
};

// Custom hook to use the raffle context
export const useRaffle = () => {
  const context = useContext(RaffleContext);
  if (context === undefined) {
    throw new Error('useRaffle must be used within a RaffleProvider');
  }
  return context;
};
