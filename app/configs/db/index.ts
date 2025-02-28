import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connection = postgres(import.meta.env.VITE_DATABASE_URL ?? "", {
	host: "localhost",
	port: 5432,
	database: import.meta.env.VITE_POSTGRES_DB,
	user: import.meta.env.VITE_POSTGRES_USER,
	password: import.meta.env.VITE_POSTGRES_PASSWORD,
});

export const dbClient =
	import.meta.env.ENV === "development"
		? drizzle(connection)
		: drizzle(import.meta.env.VITE_DATABASE_URL ?? "", {});
