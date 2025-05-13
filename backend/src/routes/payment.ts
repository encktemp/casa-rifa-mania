import express from 'express';
import mercadopago from '../mercadopago';
import { Payment } from 'mercadopago';
import QRCode from 'qrcode';

const router = express.Router();

router.post('/create-payment', async (req, res) => {
  const {
    payment_method,         // 'visa', 'master', 'pix' etc.
    transaction_amount,     // Ex: 100.0
    token,                  // token do cartão
    description,            // Descrição da compra
    installments,           // Parcelas
    payer,                  // { email, identification: { type, number } }
  } = req.body;

  try {
    let result;
    
    if (payment_method === 'pix') {
      // Criar pagamento via PIX
      const payment = new Payment(mercadopago);
      result = await payment.create({
        body: {
          transaction_amount,
          description,
          payer,
          payment_method_id: payment_method,
        },
      });

      // Log detalhado da resposta do Mercado Pago
      console.log("Resultado completo do Mercado Pago:", JSON.stringify(result, null, 2));

      // Retornar o QR Code do PIX
      const qrCode = result.point_of_interaction?.transaction_data?.qr_code;
      let qrCodeBase64 = null;
      if (qrCode) {
        qrCodeBase64 = await QRCode.toDataURL(qrCode); // Gera imagem base64
        // Remove o prefixo "data:image/png;base64," para usar direto no src
        qrCodeBase64 = qrCodeBase64.replace(/^data:image\/png;base64,/, '');
      }
      res.status(200).json({ qrCode, qrCodeBase64 });
    } else if (payment_method === 'card') {
      // Criar pagamento via Cartão
      const payment = new Payment(mercadopago);
      result = await payment.create({
        body: {
          transaction_amount,
          token,
          description,
          installments,
          payment_method_id: payment_method,
          payer,
        },
      });
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: 'Método de pagamento não suportado' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


