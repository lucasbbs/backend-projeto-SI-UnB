import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();
const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', authRoutes);
app.listen(3000, () => console.log('Server listening at port 3000'));

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});
