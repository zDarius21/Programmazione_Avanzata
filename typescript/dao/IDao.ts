// Interfaccia generica per il pattern DAO.
// T = tipo del modello, C = tipo dei dati di creazione
export interface IDao<T, C> {
  findAll(): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  create(data: C): Promise<T>;
}
