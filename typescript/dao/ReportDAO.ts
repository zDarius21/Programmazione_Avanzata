import Report from '../models/Report';
import { IDao } from './IDao';

type ReportCreateData = { documentId: number; userId: number; filePath: string };

// DAO per le operazioni di accesso ai dati dei report
class ReportDAO implements IDao<Report, ReportCreateData> {
  findAll() {
    return Report.findAll();
  }

  findById(id: string | number) {
    return Report.findByPk(id);
  }

  findByIdAndUser(id: string | number, userId: number) {
    return Report.findOne({ where: { id, userId } });
  }

  create(data: ReportCreateData) {
    return Report.create(data);
  }
}

export default new ReportDAO();
