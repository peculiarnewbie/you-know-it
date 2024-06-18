import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/web';
import { env } from '$env/dynamic/private';

export const client = createClient({
	url: env.TURSO_DATABASE_URL ?? '',
	authToken: env.TURSO_AUTH_TOKEN
});

export const db = drizzle(client);
