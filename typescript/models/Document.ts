import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../singleton/database';

// Stati possibili di un documento: in attesa di analisi o già analizzato
type DocumentStatus = 'pending' | 'analyzed';

// Attributi completi di un documento
interface DocumentAttributes {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: DocumentStatus;
  filePath: string | null;
  reportPath: string | null;
}

// In fase di creazione: id è auto-generato, status ha default 'pending', i path sono opzionali

interface DocumentCreationAttributes extends Optional<DocumentAttributes, 'id' | 'status' | 'filePath' | 'reportPath'> {}

class Document extends Model<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  declare id: number;
  declare userId: number;
  declare title: string;
  declare description: string;
  declare status: DocumentStatus;
  declare filePath: string | null;
  declare reportPath: string | null;
}

/**
 * Inizializza il modello Document con i suoi attributi e le opzioni di configurazione.
 * @param sequelize L'istanza di Sequelize da utilizzare per la connessione al database.
 */
Document.init(
  {
    id:          { type: DataTypes.INTEGER,                           autoIncrement: true, primaryKey: true },
    userId:      { type: DataTypes.INTEGER,                           allowNull: false },
    title:       { type: DataTypes.STRING,                            allowNull: false },
    description: { type: DataTypes.TEXT,                              allowNull: false },
    status:      { type: DataTypes.ENUM('pending', 'analyzed'),       allowNull: false, defaultValue: 'pending' },
    filePath:    { type: DataTypes.STRING(500),                       allowNull: true },
    reportPath:  { type: DataTypes.STRING(500),                       allowNull: true },
  },
  {
    sequelize: Database.getInstance(),
    tableName: 'documents',
    timestamps: true,
  }
);

export default Document;
