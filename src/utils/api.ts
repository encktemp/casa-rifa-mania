export const startPayment = async (user: {
  name: string;
  email: string;
}, product: {
  title: string;
  quantity: number;
  price: number;
}) => {
  const response = await fetch('http://localhost:3333/api/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...user, ...product }),
  });

  if (!response.ok) {
    throw new Error('Erro ao iniciar pagamento');
  }

  return await response.json();
};
