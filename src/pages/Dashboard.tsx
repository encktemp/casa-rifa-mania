
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRaffle } from '@/contexts/RaffleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TicketCard from '@/components/TicketCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { tickets } = useRaffle();
  
  const [activeTab, setActiveTab] = useState('tickets');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    rg: user?.rg || '',
  });
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!user) {
    return null;
  }
  
  // Filter user's purchased tickets
  const userTickets = tickets.filter(ticket => 
    ticket.ownerId === user.id && ticket.status === 'purchased'
  );
  
  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setProfileData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      rg: user.rg || '',
    });
  };
  
  const handleProfileSave = () => {
    // In a real app, this would update the user in a database
    // For now we'll just close the dialog
    setIsEditingProfile(false);
  };
  
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <Layout>
      {/* Header */}
      <div className="bg-purple py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Minha Área</h1>
          <p className="text-white/80 mt-2">
            Bem-vindo(a), {user.name.split(' ')[0]}!
          </p>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="tickets">Meus Bilhetes</TabsTrigger>
              <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tickets">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Bilhetes</CardTitle>
                </CardHeader>
                <CardContent>
                  {userTickets.length > 0 ? (
                    <div>
                      <p className="mb-4 text-gray-600">
                        Você tem {userTickets.length} bilhetes para o sorteio:
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {userTickets.map(ticket => (
                          <TicketCard
                            key={ticket.number}
                            number={ticket.number}
                            status={ticket.status}
                            ownerName={user.name}
                            ownerPhone={user.phone}
                            ownerRg={user.rg}
                            displayMode="full"
                          />
                        ))}
                      </div>
                      
                      <div className="mt-8 p-4 bg-gray-50 rounded-md border">
                        <h3 className="font-bold mb-2">Informações do Sorteio</h3>
                        <p className="text-sm text-gray-600">
                          O sorteio será realizado após a venda de todos os bilhetes.
                          O resultado será divulgado em nossas redes sociais e o ganhador será contactado através das informações cadastradas.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">
                        Você ainda não tem bilhetes para o sorteio.
                      </p>
                      <Button asChild className="bg-orange hover:bg-orange-dark">
                        <a href="/tickets">Comprar Bilhetes</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Meu Perfil</CardTitle>
                  <Button
                    variant="outline"
                    onClick={handleProfileEdit}
                  >
                    Editar Perfil
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Nome</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium">{user.phone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">RG</p>
                        <p className="font-medium">{user.rg || '-'}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-bold mb-2">Bilhetes Comprados</h3>
                      <p className="text-gray-600">
                        Total de bilhetes: <span className="font-medium">{userTickets.length}</span>
                      </p>
                      {userTickets.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {userTickets.map(ticket => (
                            <span 
                              key={ticket.number} 
                              className="inline-flex items-center justify-center rounded-md bg-purple-light text-purple px-2 py-1 text-xs font-medium"
                            >
                              {ticket.number}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileInputChange}
                disabled
              />
              <p className="text-xs text-gray-500">O email não pode ser alterado.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                name="rg"
                value={profileData.rg}
                onChange={handleProfileInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditingProfile(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleProfileSave}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Dashboard;
