import Document from '../models/Document';
import { IDao } from './IDao';

type DocumentCreateData = { userId: number; title: string; description: string };

// DAO per le operazioni di accesso ai dati dei documenti
class DocumentDAO implements IDao<Document, DocumentCreateData> {
  findAll() {
    return Document.findAll();
  }

  findById(id: string | number) {
    return Document.findByPk(id);
  }

  findAllByUser(userId: number) {
    return Document.findAll({ where: { userId } });
  }

  findByIdAndUser(id: string | number, userId: number) {
    return Document.findOne({ where: { id, userId } });
  }

  findAllAnalyzedByUser(userId: number) {
    return Document.findAll({ where: { userId, status: 'analyzed' } });
  }

  findAnalyzedByIdAndUser(id: string | number, userId: number) {
    return Document.findOne({ where: { id, userId, status: 'analyzed' } });
  }

  create(data: DocumentCreateData) {
    return Document.create(data);
  }
}

export default new DocumentDAO();
