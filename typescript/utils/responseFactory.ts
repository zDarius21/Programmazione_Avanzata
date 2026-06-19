import { Response } from 'express';

// Pattern Factory per generare le risposte HTTP standard, questo evita di ripetere lo stesso codice in tutti i controller 
class ResponseFactory {

  // Risposta di successo — wrappa i dati in { success: true, data }
  static success(res: Response, data: unknown, status = 200): Response {
    return res.status(status).json({ success: true, data });
  }

  // Risposta di errore — restituisce { success: false, error: messaggio }
  static error(res: Response, message: string, status = 500): Response {
    return res.status(status).json({ success: false, error: message });
  }
}

export default ResponseFactory;