import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../singleton/database';

// Attributi completi di un utente
interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

// In fase di creazione l'id è opzionale perché lo genera incrementalmente il database
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare email: string;
  declare password: string;
  declare role: 'user' | 'admin';
}

// Definizione della tabella e dei tipi delle colonne
User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
  },
  {
    sequelize: Database.getInstance(),
    tableName: 'users',
    timestamps: true,
  }
);

export default User;