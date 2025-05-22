
import { DataSource } from "typeorm";
import path from "path";
import * as dotenv from "dotenv";
import * as Entities from '@/entities';
// const baseDir = process.cwd();
// const entitiesPath = path.resolve(baseDir, "src/entities/*.{ts,js}");
const entitiesPath = path.join(__dirname, "../entities/*.{ts,js}"); 
const migrationPath = path.join(__dirname, "../config/migrations/*.{ts,js}");
console.log("Entities Path:", entitiesPath);
console.log("Migrations Path:", migrationPath);

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } =
  process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT || "5432"),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ssl: false,
  synchronize:false,
  logging: true,
  entities: Object.values(Entities),
  migrations: [migrationPath],

  subscribers: [],
});

