import express from 'express';
import dotenv from 'dotenv';
import Database from './config/database';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json());

app.use('/auth', authRoutes);

Database.getInstance()
  .authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err: Error) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });

export default app;