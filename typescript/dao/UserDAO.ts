import User from '../models/User';
import { IDao } from './IDao';
import { AppError, ErrorEnum } from '../factory/error';

const SAFE_ATTRIBUTES = ['id', 'email', 'role', 'tokens', 'createdAt', 'updatedAt'];

type UserCreateData = { email: string; password: string; role: 'user' | 'admin' };

// DAO per le operazioni di accesso ai dati degli utenti
class UserDAO implements IDao<User, UserCreateData> {

  
  /** Restituisce tutti gli utenti senza il campo password.
   * @returns Restituisce tutti gli utenti senza il campo password.
   * */
  async findAll() {
    try {
      return await User.findAll({ attributes: SAFE_ATTRIBUTES });
    } catch {
      throw new AppError(ErrorEnum.DatabaseError);
    }
  }

  /** Restituisce l'utente con l'id fornito senza il campo password, o null se non esiste. 
   * @param id - L'id dell'utente da cercare.
   * @returns Restituisce l'utente con l'id fornito senza il campo password, o null se non esiste.
   * */

  async findById(id: string | number) {
    try {
      return await User.findByPk(id, { attributes: SAFE_ATTRIBUTES });
    } catch {
      throw new AppError(ErrorEnum.DatabaseError);
    }
  }

  /** Restituisce l'utente con l'id fornito incluso il campo password, o null se non esiste.
   * @param id - L'id dell'utente da cercare.
   * @returns Restituisce l'utente con l'id fornito incluso il campo password, o null se non esiste.
   * */
   
  async findByIdFull(id: string | number) {
    try {
      return await User.findByPk(id);
    } catch {
      throw new AppError(ErrorEnum.DatabaseError);
    }
  }

  /** Restituisce l'utente con l'email fornita incluso il campo password, o null se non esiste.
   * @param email - L'email dell'utente da cercare.
   * @returns Restituisce l'utente con l'email fornita incluso il campo password, o null se non esiste.
   * */
  async findByEmail(email: string) {
    try {
      return await User.findOne({ where: { email } });
    } catch {
      throw new AppError(ErrorEnum.DatabaseError);
    }
  }

  /** Crea e salva un nuovo utente nel database con i dati forniti.
   * @param data - I dati dell'utente da creare.
   * @returns Restituisce l'utente creato.
   * */
  async create(data: UserCreateData) {
    try {
      return await User.create(data);
    } catch {
      throw new AppError(ErrorEnum.DatabaseError);
    }
  }

  async deductTokens(userId: number, amount: number = 10): Promise<void> {
    await User.decrement('tokens', { by: amount, where: { id: userId } });
  }

  async refillTokens(amount: number = 10, cap: number = 100): Promise<void> {
    await User.sequelize!.query(
      `UPDATE users SET tokens = LEAST(tokens + :amount, :cap)`,
      { replacements: { amount, cap } }
    );
  }
}

export default new UserDAO();