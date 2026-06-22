import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import Database from './singleton/database';
import MinioStorage from './singleton/minio';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import regulationRoutes from './routes/regulations';
import documentRoutes from './routes/documents';

// Carica le variabili d'ambiente dal file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rimuove l'header X-Powered-By
app.disable('x-powered-by');
app.use(express.json());

// Rotte di autenticazione
app.use('/auth', authRoutes);
app.use('/regulations', regulationRoutes);

// Rotte utenti (solo admin)
app.use('/users', userRoutes);
app.use('/documents', documentRoutes);

// Gestione centralizzata degli errori non catturati nei controller async
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, error: 'Errore interno del server' });
});

// Prima di avviare il server verifichiamo la connessione e sincronizziamo i modelli con il database
Database.getInstance()
  .authenticate()
  .then(() => Database.getInstance().sync())
  .then(() => MinioStorage.ensureBucket())
  .then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err: Error) => {
    console.error('Startup failed:', err.message);
    process.exit(1);
  });

export default app;