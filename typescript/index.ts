import express from 'express';
import dotenv from 'dotenv';
import Database from './config/database';
import authRoutes from './routes/auth';

// Carica le variabili d'ambiente dal file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rimuove l'header X-Powered-By 
app.disable('x-powered-by');
app.use(express.json());

// Rotte di autenticazione
app.use('/auth', authRoutes);

// Prima di avviare il server verifichiamo la connessione e sincronizziamo i modelli con il database
Database.getInstance()
  .authenticate()
  .then(() => Database.getInstance().sync())
  .then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err: Error) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });

export default app;