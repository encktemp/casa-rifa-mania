// src/api/payment.ts
export const createPayment = async (data: any) => {
  const res = await fetch("/api/mercadopago/create-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar pagamento");
  }

  return await res.json();
};
