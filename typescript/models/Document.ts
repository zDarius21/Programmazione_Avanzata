import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../config/database';

// Stati possibili di un documento: in attesa di analisi o già analizzato
type DocumentStatus = 'pending' | 'analyzed';

// Attributi completi di un documento
interface DocumentAttributes {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: DocumentStatus;
}

// In fase di creazione: id è auto-generato, status ha default 'pending'
interface DocumentCreationAttributes extends Optional<DocumentAttributes, 'id' | 'status'> {}

class Document extends Model<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  declare id: number;
  declare userId: number;
  declare title: string;
  declare description: string;
  declare status: DocumentStatus;
}

Document.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'analyzed'), allowNull: false, defaultValue: 'pending' },
  },
  {
    sequelize: Database.getInstance(),
    tableName: 'documents',
    timestamps: true,
  }
);

export default Document;