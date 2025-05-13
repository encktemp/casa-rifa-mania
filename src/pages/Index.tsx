
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useRaffle } from '@/contexts/RaffleContext';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const { totalTickets, availableTickets, purchasedTickets } = useRaffle();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-white mb-8 md:mb-0">
              <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
                SORTEIO: 01 CASA
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-white/80">
                Realize seu sonho da casa própria por apenas R$ 1,00!
              </p>
              <p className="mb-8">
                Bilhetes disponíveis: <span className="font-bold">{availableTickets}</span> de <span className="font-bold">{totalTickets}</span>
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-orange hover:bg-orange-dark font-bold text-white">
                  <Link to="/tickets">
                    Quero Participar
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-gray-800 font-bold hover:bg-white/20">
                  <Link to="/register">
                    Cadastrar
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8 flex justify-center">
              <div className="relative w-full max-w-md">
                <img
                  src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&w=800"
                  alt="Casa Sorteada"
                  className="rounded-lg shadow-2xl animate-float w-full h-auto"
                />
                <div className="absolute -bottom-4 -right-4 bg-orange text-white py-2 px-4 rounded-lg shadow-lg">
                  <p className="font-bold">Apenas R$ 1,00</p>
                  <p className="text-sm">por bilhete!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Como Funciona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-300 text-blue-800 rounded-full mb-4">
                  <span className="font-bold text-xl">1</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Escolha seus Números</h3>
                <p className="text-gray-600">
                  Selecione quantos bilhetes quiser! Cada número custa apenas R$ 1,00.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-300 text-blue-800 rounded-full mb-4">
                  <span className="font-bold text-xl">2</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Faça o Pagamento</h3>
                <p className="text-gray-600">
                  Pague via PIX ou cartão de crédito de forma rápida e segura.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-300 text-blue-800 rounded-full mb-4">
                  <span className="font-bold text-xl">3</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Aguarde o Sorteio</h3>
                <p className="text-gray-600">
                  O sorteio será realizado após a venda de todos os bilhetes.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-orange hover:bg-orange-dark text-white">
              <Link to="/tickets">
                Ver Bilhetes Disponíveis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Prize Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">O Prêmio</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Conheça a incrível casa que pode ser sua com apenas R$ 1,00! Uma oportunidade única de realizar o sonho da casa própria.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&w=800"
                alt="Casa Sorteada - Exterior"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-bold text-2xl mb-4">
                Casa em Localização Privilegiada
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-purple mr-2">✓</span>
                  <span>3 quartos (1 suíte)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple mr-2">✓</span>
                  <span>Sala ampla com cozinha americana</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple mr-2">✓</span>
                  <span>Área de lazer com churrasqueira</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple mr-2">✓</span>
                  <span>2 vagas de garagem</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple mr-2">✓</span>
                  <span>Próximo a comércios e escolas</span>
                </li>
              </ul>
              <Button asChild className="bg-orange hover:bg-orange-dark text-white">
                <Link to="/tickets">
                  Quero Concorrer!
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{totalTickets}</div>
              <p className="text-white/70">Bilhetes Totais</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{availableTickets}</div>
              <p className="text-white/70">Bilhetes Disponíveis</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{purchasedTickets}</div>
              <p className="text-white/70">Bilhetes Vendidos</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">R$ 1,00</div>
              <p className="text-white/70">Valor por Número</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-bold text-xl mb-2">
                Como funciona o sorteio?
              </h3>
              <p className="text-gray-600">
                O sorteio será realizado após a venda de todos os bilhetes, utilizando a Loteria Federal como base para determinar o número ganhador.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-2">
                Quando vou receber meu bilhete?
              </h3>
              <p className="text-gray-600">
                Seus bilhetes ficam disponíveis automaticamente em sua área de usuário após a confirmação do pagamento.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-2">
                Como saberei se ganhei?
              </h3>
              <p className="text-gray-600">
                O resultado será divulgado nas nossas redes sociais e o ganhador será contatado diretamente pelos dados fornecidos no cadastro.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-2">
                Posso escolher mais de um número?
              </h3>
              <p className="text-gray-600">
                Sim! Você pode escolher quantos números quiser, aumentando suas chances de ganhar.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="mb-4 text-gray-600">
              Ainda tem dúvidas? Entre em contato conosco!
            </p>
            <a 
              href="https://wa.me/5511999999999" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              Falar pelo WhatsApp
            </a>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-orange">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Não perca essa oportunidade!
          </h2>
          <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
            Por apenas R$ 1,00 você pode realizar o sonho da casa própria.
            Garanta já seu bilhete!
          </p>
          <Button asChild size="lg" className="bg-white text-orange hover:bg-gray-100">
            <Link to="/tickets">
              Comprar Bilhetes
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
