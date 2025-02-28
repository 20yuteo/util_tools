import type { Config } from "drizzle-kit";

export default {
	schema: "./schema/*",
	out: "./supabase/migrations",
	dialect: "postgresql",
	dbCredentials: {
		host: "localhost",
		port: 5432,
		database: "postgres",
		user: "postgres",
		password: "postgres",
		ssl: false,
	}
} satisfies Config;
