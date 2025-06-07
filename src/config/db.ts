import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

// Try connection string first, fall back to individual parameters
const connectionString = process.env.DB_CONNECTION_STRING;
const sql = connectionString
  ? postgres(connectionString, {
      transform: postgres.camel,
      max: 10,
      idle_timeout: 60,
    })
  : postgres({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      transform: postgres.camel,
      max: 10,
      idle_timeout: 60,
    });

export default sql;
