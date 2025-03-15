import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const settings =
  process.env.NODE_ENV === "development"
    ? {
        host: "localhost",
        port: 5432,
        database: process.env.VITE_POSTGRES_DB ?? "", // ?? "" で空文字列をデフォルト値に
        user: process.env.VITE_POSTGRES_USER ?? "",
        password: process.env.VITE_POSTGRES_PASSWORD ?? "",
      }
    : {
        host: process.env.VITE_SUPABASE_HOST ?? "",
        port: 5432,
        database: process.env.VITE_SUPABASE_DATABASE ?? "",
        user: process.env.VITE_SUPABASE_USER ?? "",
        password: process.env.VITE_SUPABASE_PASSWORD ?? "",
      };

const connection = postgres(process.env.VITE_DATABASE_URL ?? "", {
  ...settings,
});

export const dbClient = drizzle(connection);
