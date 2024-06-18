import { json } from '@sveltejs/kit';
import { createClient } from '@libsql/client/web';
import { drizzle } from 'drizzle-orm/libsql';
import { usersTable } from '../../../db/schema.js';
import { getDB } from '../../../db/index.js';

export interface Env {}

export async function GET({ platform }) {
	if (!platform) return json('empty');
	const db = getDB(platform.env.TURSO_DATABASE_URL, platform.env.TURSO_AUTH_TOKEN);

	const res = await db.select().from(usersTable);

	return json(res);
}
