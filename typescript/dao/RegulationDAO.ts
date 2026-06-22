import Regulation from '../models/Regulation';
import { IDao } from './IDao';

type RegulationCreateData = { name: string; description: string; version: string };

// DAO per le operazioni di accesso ai dati delle normative
class RegulationDAO implements IDao<Regulation, RegulationCreateData> {
  findAll() {
    return Regulation.findAll();
  }

  findById(id: string | number) {
    return Regulation.findByPk(id);
  }

  findByName(name: string) {
    return Regulation.findOne({ where: { name } });
  }

  create(data: RegulationCreateData) {
    return Regulation.create(data);
  }
}

export default new RegulationDAO();
