import express from 'express';
import cors from 'cors';
import paymentRoutes from './routes/payment';

const app = express();
app.use(cors());
app.use(express.json());

// CORRETO: define o prefixo /api
app.use('/api', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
