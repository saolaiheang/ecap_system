// lib/db.ts
import { AppDataSource } from '../config/data-source';

export const initDb = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('DB connected');
  }
};
