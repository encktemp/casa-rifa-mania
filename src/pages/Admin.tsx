
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth, User } from '@/contexts/AuthContext';
import { useRaffle, Ticket } from '@/contexts/RaffleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const { 
    tickets, 
    refreshTickets,
    setAdminTicketOwner,
    setTicketStatus,
    totalTickets,
    availableTickets,
    reservedTickets,
    purchasedTickets
  } = useRaffle();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    isAdmin: false
  });
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  
  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
    
    // Load all users from localStorage
    const storedUsers = localStorage.getItem('casa-rifa-mania-users');
    if (storedUsers) {
      try {
        setAllUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error('Failed to parse stored users:', error);
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  if (!user || !isAdmin) {
    return null;
  }
  
  const handleAddUser = () => {
    setIsAddingUser(true);
  };
  
  const handleSaveUser = () => {
    try {
      // Validate inputs
      if (!newUserData.name || !newUserData.email || !newUserData.phone) {
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios.",
        });
        return;
      }
      
      // Check if email already exists
      if (allUsers.some(u => u.email === newUserData.email)) {
        toast({
          variant: "destructive",
          title: "Email já cadastrado",
          description: "Este email já está em uso por outro usuário.",
        });
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: newUserData.name,
        email: newUserData.email,
        phone: newUserData.phone,
        isAdmin: newUserData.isAdmin,
        purchasedTickets: []
      };
      
      // Update users array
      const updatedUsers = [...allUsers, newUser];
      localStorage.setItem('casa-rifa-mania-users', JSON.stringify(updatedUsers));
      setAllUsers(updatedUsers);
      
      // Close dialog and reset form
      setIsAddingUser(false);
      setNewUserData({
        name: '',
        email: '',
        phone: '',
        password: '',
        isAdmin: false
      });
      
      toast({
        title: "Usuário criado",
        description: `O usuário ${newUserData.name} foi criado com sucesso.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  };
  
  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setSelectedUser(ticket.ownerId || '');
    setShowTicketDialog(true);
  };
  
  const handleTicketStatusChange = (status: Ticket['status']) => {
    if (!selectedTicket) return;
    setTicketStatus(selectedTicket.number, status);
    setShowTicketDialog(false);
  };
  
  const handleAssignTicket = () => {
    if (!selectedTicket || !selectedUser) return;
    setAdminTicketOwner(selectedTicket.number, selectedUser);
    setShowTicketDialog(false);
  };
  
  // Filter tickets based on search
  const filteredTickets = tickets.filter(ticket => {
    if (!searchQuery) return true;
    return ticket.number.includes(searchQuery) || 
           ticket.ownerName?.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Filter users based on search
  const filteredUsers = allUsers.filter(user => {
    if (!userSearchQuery) return true;
    return user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
           user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
  });
  
  // Calculate stats
  const totalUsers = allUsers.length;
  const totalSales = purchasedTickets; // In a real app, this would be multiplied by ticket price
  
  return (
    <Layout>
      {/* Header */}
      <div className="bg-blue-800 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          <p className="text-white/80 mt-2">
            Gerencie usuários, bilhetes e configurações.
          </p>
        </div>
      </div>
      
      {/* Admin Content */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="tickets">Bilhetes</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total de Usuários
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalUsers}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Bilhetes Vendidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{purchasedTickets} / {totalTickets}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total Arrecadado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">R$ {totalSales.toFixed(2)}</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo de Bilhetes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total de Bilhetes</span>
                        <span className="font-bold">{totalTickets}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Bilhetes Disponíveis</span>
                        <span className="font-bold text-green-600">{availableTickets}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Bilhetes Reservados</span>
                        <span className="font-bold text-yellow-600">{reservedTickets}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Bilhetes Vendidos</span>
                        <span className="font-bold text-blue-600">{purchasedTickets}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-purple h-2.5 rounded-full" 
                          style={{ width: `${(purchasedTickets / totalTickets) * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 text-right">
                        {Math.round((purchasedTickets / totalTickets) * 100)}% vendidos
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button
                        className="w-full"
                        onClick={handleAddUser}
                      >
                        Adicionar Novo Usuário
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={refreshTickets}
                      >
                        Atualizar Dados dos Bilhetes
                      </Button>
                      
                      <a
                        href="https://wa.me/5511999999999"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Acessar WhatsApp de Suporte
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tickets">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gerenciar Bilhetes</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Buscar bilhete ou comprador..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Nº</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Comprador</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTickets
                          .filter(ticket => ticket.status !== 'available')
                          .slice(0, 10)
                          .map((ticket) => (
                            <TableRow key={ticket.number}>
                              <TableCell className="font-medium">{ticket.number}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                  ${ticket.status === 'purchased' ? 'bg-green-100 text-green-800' : 
                                    ticket.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {ticket.status === 'purchased' ? 'Pago' : 
                                   ticket.status === 'reserved' ? 'Reservado' : 
                                   'Disponível'}
                                </span>
                              </TableCell>
                              <TableCell>{ticket.ownerName || '--'}</TableCell>
                              <TableCell>{ticket.ownerPhone || '--'}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleTicketClick(ticket)}
                                >
                                  Gerenciar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        
                        {filteredTickets.filter(ticket => ticket.status !== 'available').length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                              Nenhum bilhete vendido ou reservado encontrado.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gerenciar Usuários</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Buscar usuário..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-64"
                    />
                    <Button onClick={handleAddUser}>
                      Adicionar Usuário
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Bilhetes</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>{user.purchasedTickets.length}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}
                              >
                                {user.isAdmin ? 'Admin' : 'Usuário'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost"
                                size="sm"
                                disabled
                              >
                                Detalhes
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={newUserData.phone}
                onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Deixe em branco para usar o padrão (nome de usuário).
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAdmin"
                checked={newUserData.isAdmin}
                onChange={(e) => setNewUserData({ ...newUserData, isAdmin: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isAdmin">
                Usuário é administrador
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddingUser(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveUser}>
              Adicionar Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Manage Ticket Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Bilhete #{selectedTicket?.number}</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Status Atual</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedTicket.status === 'available' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTicketStatusChange('available')}
                  >
                    Disponível
                  </Button>
                  <Button
                    variant={selectedTicket.status === 'reserved' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTicketStatusChange('reserved')}
                  >
                    Reservado
                  </Button>
                  <Button
                    variant={selectedTicket.status === 'purchased' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTicketStatusChange('purchased')}
                  >
                    Pago2
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Proprietário Atual</Label>
                <p className="text-gray-700">
                  {selectedTicket.ownerName || 'Nenhum proprietário atribuído'}
                </p>
                {selectedTicket.ownerPhone && (
                  <p className="text-sm text-gray-500">
                    Tel: {selectedTicket.ownerPhone}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ownerId">Atribuir a Outro Usuário</Label>
                <Select
                  value={selectedUser}
                  onValueChange={setSelectedUser}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {allUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTicketDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAssignTicket}>
              Atribuir Bilhete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Admin;
