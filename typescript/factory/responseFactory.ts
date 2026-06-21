import { Response } from 'express';
import { getError, ErrorEnum } from './error';
import { getSuccess, SuccessEnum } from './success';

// Pattern Factory per generare le risposte HTTP standard
class ResponseFactory {

  // Invia una risposta di errore 
  static sendError(res: Response, type: ErrorEnum): Response {
    const { status, message } = getError(type).getErrorObj();
    return res.status(status).json({ success: false, error: message });
  }

  // Invia una risposta di successo 
  static sendSuccess(res: Response, type: SuccessEnum, data: unknown): Response {
    const { status } = getSuccess(type).getSuccessObj();
    return res.status(status).json({ success: true, data });
  }
}

export { ErrorEnum, SuccessEnum };
export default ResponseFactory;
