import express from 'express';
import cors from 'cors';
import paymentRoutes from './routes/payment';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', paymentRoutes);

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
