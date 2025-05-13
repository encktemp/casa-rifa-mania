import React, { useState } from 'react';
import config from '../config/config';  // Caso esteja utilizando um arquivo de configuração

function PaymentForm() {
  const [paymentData, setPaymentData] = useState({});

  const handlePayment = () => {
    // Configura o Mercado Pago com a Public Key
    window.MercadoPago.configurations.setPublicKey('APP_USR-e6406b3a-f9c8-4629-b7df-ee474dc4f456');
    
    // Exemplo de inicialização do botão de pagamento ou QR code
    window.MercadoPago.checkout({
      preference_id: 'preference_id_aqui'  // A preference_id que será gerada no backend
    });
  };

  return (
    <div>
      <button onClick={handlePayment}>Pagar</button>
    </div>
  );
}

export default PaymentForm;
