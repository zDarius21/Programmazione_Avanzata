import app from './app';

const APP_PORT = process.env.PORT || 3000;

// Entry point dell'applicazione: avvia il server Express sulla porta specificata
app.listen(APP_PORT, () => {
  console.log(`Server running on http://localhost:${APP_PORT}`);
});