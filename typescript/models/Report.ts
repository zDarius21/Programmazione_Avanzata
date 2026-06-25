import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../singleton/database';

// Attributi completi di un report
interface ReportAttributes {
  id: number;
  documentId: number;
  userId: number;
  filePath: string;
}

// In fase di creazione l'id è auto-generato dal database
interface ReportCreationAttributes extends Optional<ReportAttributes, 'id'> {}

class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
  declare id: number;
  declare documentId: number;
  declare userId: number;
  declare filePath: string;
}

/**
 * Inizializza il modello Report con i suoi attributi e le opzioni di configurazione.
 * @param sequelize L'istanza di Sequelize da utilizzare per la connessione al database.
 */
Report.init(
  {
    id:         { type: DataTypes.INTEGER,      autoIncrement: true, primaryKey: true },
    documentId: { type: DataTypes.INTEGER,      allowNull: false },
    userId:     { type: DataTypes.INTEGER,      allowNull: false },
    filePath:   { type: DataTypes.STRING(500),  allowNull: false },
  },
  {
    sequelize: Database.getInstance(),
    tableName: 'reports',
    timestamps: true,
  }
);

export default Report;