import User from './User';
import Document from './Document';
import Report from './Report';

// Definizione centralizzata delle associazioni tra i model.
// Va importato una sola volta all'avvio, prima di Database.sync(), così che
// sync() generi le tabelle con le foreign key e i vincoli ON DELETE CASCADE.
// Tenere le associazioni qui (e non nei singoli file dei model) evita i
// problemi di import circolari tra User, Document e Report.

// Un utente possiede molti documenti.
// Eliminando l'utente vengono eliminati a cascata i suoi documenti.
User.hasMany(Document, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
Document.belongsTo(User, { foreignKey: 'userId' });

// Un documento può avere più report.
// Eliminando il documento vengono eliminati a cascata i suoi report.
Document.hasMany(Report, { foreignKey: 'documentId', onDelete: 'CASCADE', hooks: true });
Report.belongsTo(Document, { foreignKey: 'documentId' });

// Un utente possiede molti report.
// Eliminando l'utente vengono eliminati a cascata i suoi report.
User.hasMany(Report, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
Report.belongsTo(User, { foreignKey: 'userId' });

export { User, Document, Report };
