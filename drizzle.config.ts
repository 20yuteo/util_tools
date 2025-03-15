import type { Config } from "drizzle-kit";
import { settings } from "~/configs/db";

export default {
  schema: "./schema/*",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    ...settings,
    ssl: process.env.DATABASE_SSL === "true",
  },
} satisfies Config;
