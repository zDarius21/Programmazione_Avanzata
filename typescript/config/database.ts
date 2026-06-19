import { Sequelize } from 'sequelize';

class Database {
  private static instance: Sequelize;

  static getInstance(): Sequelize {
    if (!Database.instance) {
      Database.instance = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || 'compliance_db',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        logging: false,
      });
    }
    return Database.instance;
  }
}

export default Database;
