import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../singleton/database';

// Attributi completi di un utente
interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: 'user' | 'admin';
  tokens: number;
}

// In fase di creazione id e tokens sono opzionali poichè creati automaticamente
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'tokens'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare email: string;
  declare password: string;
  declare role: 'user' | 'admin';
  declare tokens: number;
}

// Definizione della tabella e dei tipi delle colonne
User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
    tokens: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 100 },
  },
  {
    sequelize: Database.getInstance(),
    tableName: 'users',
    timestamps: true,
  }
);

export default User;