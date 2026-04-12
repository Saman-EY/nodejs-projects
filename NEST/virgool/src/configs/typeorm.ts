import { config } from "dotenv";
import { DataSource } from "typeorm";

config();
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;
console.log({
  type: "postgres",
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
});

let dataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  synchronize: false, // for migration
  entities: ["dist/**/**/**/*.entity{.ts,.js}", "dist/**/**/*.entity{.ts,.js}"],
  migrations: ["dist/migrations/*{.ts,.js}"],
  migrationsTableName: "virgool_migration_db",
});

export default dataSource;
