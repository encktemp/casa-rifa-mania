
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Home, Ticket, ShieldCheck } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-purple-dark to-purple shadow-md">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-white font-montserrat font-bold text-xl md:text-2xl">
              Casa Rifa Mania
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="hidden md:inline text-white">
                  Olá, {user?.name.split(' ')[0]}
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/20"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">Sair</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Link to="/login">
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">Entrar</span>
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/register">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {isAuthenticated && (
        <nav className="bg-white border-b shadow-sm">
          <div className="container mx-auto py-2 px-4">
            <ul className="flex space-x-2 md:space-x-8 overflow-x-auto">
              <li>
                <Link 
                  to="/" 
                  className={`flex items-center py-2 px-2 text-sm font-medium ${location.pathname === '/' ? 'text-purple border-b-2 border-purple' : 'text-gray-600 hover:text-purple'}`}
                >
                  <Home className="h-4 w-4 mr-1" />
                  Início
                </Link>
              </li>
              <li>
                <Link 
                  to="/tickets" 
                  className={`flex items-center py-2 px-2 text-sm font-medium ${location.pathname === '/tickets' ? 'text-purple border-b-2 border-purple' : 'text-gray-600 hover:text-purple'}`}
                >
                  <Ticket className="h-4 w-4 mr-1" />
                  Bilhetes
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center py-2 px-2 text-sm font-medium ${location.pathname === '/dashboard' ? 'text-purple border-b-2 border-purple' : 'text-gray-600 hover:text-purple'}`}
                >
                  <User className="h-4 w-4 mr-1" />
                  Meus Bilhetes
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link 
                    to="/admin" 
                    className={`flex items-center py-2 px-2 text-sm font-medium ${location.pathname === '/admin' ? 'text-purple border-b-2 border-purple' : 'text-gray-600 hover:text-purple'}`}
                  >
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      )}
      
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">Casa Rifa Mania</h3>
              <p className="text-gray-400 text-sm">
                Realize seu sonho de ter uma casa própria através da nossa rifa online!
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Links Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Início
                  </Link>
                </li>
                <li>
                  <Link to="/tickets" className="text-gray-400 hover:text-white">
                    Comprar Bilhetes
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-400 hover:text-white">
                    Cadastrar
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Contato</h3>
              <p className="text-gray-400 text-sm mb-2">
                Para dúvidas, entre em contato via WhatsApp.
              </p>
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Casa Rifa Mania. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
