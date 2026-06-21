import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../singleton/database';

// Attributi completi di una normativa
interface RegulationAttributes {
  id: number;
  name: string;
  description: string;
  version: string;
}

// In fase di creazione l'id è opzionale perché lo genera incrementalmente il database
interface RegulationCreationAttributes extends Optional<RegulationAttributes, 'id'> {}

class Regulation extends Model<RegulationAttributes, RegulationCreationAttributes> implements RegulationAttributes {
  declare id: number;
  declare name: string;
  declare description: string;
  declare version: string;
}

// Definizione della tabella e dei tipi delle colonne
Regulation.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    version: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize: Database.getInstance(),
    tableName: 'regulations',
    timestamps: true,
  }
);

export default Regulation;