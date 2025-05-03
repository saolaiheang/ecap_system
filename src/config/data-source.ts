
import { DataSource } from "typeorm";
import path from "path";
import * as dotenv from "dotenv";

const entitiesPath = path.join(__dirname, "../entities/**/*.{ts,js}"); // Corrected "entity" to "entities"
const migrationPath = path.join(__dirname, "../config/migrations/*.{ts,js}");
console.log("Entities Path:", entitiesPath);
console.log("Migrations Path:", migrationPath);

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } =
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
  //
  //logging logs sql command on the treminal
  logging: true,
  // entities: [`${__dirname}**/entity/*.{ts,js}`],
  entities: [entitiesPath],
  // migrations: [`${__dirname}/**/migrations/*.{ts, js}`],
  migrations: [migrationPath],
  //   entities: [User],
  // migrations: [__dirname + "/migration/*.ts"],
  subscribers: [],
});
