import postgres from "postgres";

const connectionString = process.env.DB_CONNECTION_STRING;
if (!connectionString) {
  throw new Error("DB_CONNECTION_STRING environment variable is not set.");
}
const sql = postgres(connectionString, {
  transform: postgres.camel,
});

export default sql;
