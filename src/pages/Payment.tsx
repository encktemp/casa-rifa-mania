import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { startPayment } from '@/utils/api';

const Payment = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const user = {
        name: 'João da Silva',
        email: 'joao@email.com'
      };

      const product = {
        title: 'Rifa Casa dos Sonhos',
        quantity: 1,
        price: 10
      };

      const response = await startPayment(user, product);
      if (response?.init_point) {
        toast.success('Redirecionando para o pagamento...');
        window.open(response.init_point, '_blank');
      } else {
        toast.error('Erro ao criar pagamento');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro no pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Comprar Rifa</h1>
        <p className="text-gray-600">R$10,00 por número</p>
        <Button onClick={handlePayment} disabled={loading} className="bg-blue-600 text-white">
          {loading ? 'Carregando...' : 'Pagar com Mercado Pago'}
        </Button>
      </div>
    </div>
  );
};

export default Payment;
