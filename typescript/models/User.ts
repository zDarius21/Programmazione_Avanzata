import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../singleton/database';
import { Role } from '../enums/role';

// Attributi completi di un utente
interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: Role;
  tokens: number;
}

// In fase di creazione id e tokens sono opzionali poichè creati automaticamente
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'tokens'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare email: string;
  declare password: string;
  declare role: Role;
  declare tokens: number;
}


/**
 * Inizializza il modello User con i suoi attributi e le opzioni di configurazione.
 * @param sequelize L'istanza di Sequelize da utilizzare per la connessione al database.
 * @returns void
 */
User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM(...Object.values(Role)), allowNull: false, defaultValue: Role.User },
    tokens: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 100 },
  },
  {
    sequelize: Database.getInstance(),
    tableName: 'users',
    timestamps: true,
  }
);

export default User;