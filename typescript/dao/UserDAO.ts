import User from '../models/User';
import { IDao } from './IDao';

const SAFE_ATTRIBUTES = ['id', 'email', 'role', 'createdAt', 'updatedAt'];

type UserCreateData = { email: string; password: string; role: 'user' | 'admin' };

// DAO per le operazioni di accesso ai dati degli utenti
class UserDAO implements IDao<User, UserCreateData> {
  findAll() {
    return User.findAll({ attributes: SAFE_ATTRIBUTES });
  }

  findById(id: string | number) {
    return User.findByPk(id, { attributes: SAFE_ATTRIBUTES });
  }

  findByIdFull(id: string | number) {
    return User.findByPk(id);
  }

  findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  create(data: UserCreateData) {
    return User.create(data);
  }
}

export default new UserDAO();
