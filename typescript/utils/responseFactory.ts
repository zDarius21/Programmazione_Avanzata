import { Response } from 'express';

class ResponseFactory {
  static success(res: Response, data: unknown, status = 200): Response {
    return res.status(status).json({ success: true, data });
  }

  static error(res: Response, message: string, status = 500): Response {
    return res.status(status).json({ success: false, error: message });
  }
}

export default ResponseFactory;
