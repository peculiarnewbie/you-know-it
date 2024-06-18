import { json } from '@sveltejs/kit';
import { createClient } from '@libsql/client/web';
import { drizzle } from 'drizzle-orm/libsql';
import { usersTable } from '../../../db/schema.js';

export interface Env {}

export async function GET({ platform }) {
	if (!platform) return json('empty');
	const client = createClient({
		url: platform.env.TURSO_DATABASE_URL,
		authToken: platform.env.TURSO_AUTH_TOKEN
	});

	const db = drizzle(client);

	const res = await db.select().from(usersTable);

	return json(res);
}
