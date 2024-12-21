import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import userRoutes from './routes/userRoutes';
import checkoutRoutes from './routes/checkoutRoutes';
import dotenv from 'dotenv';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', userRoutes);
app.use('/api/checkout', checkoutRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'API is running with TypeScript!' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));