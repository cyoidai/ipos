import dotenv from 'dotenv';
import { Client } from 'pg';
import { Organization } from './org';

dotenv.config({ path: '@/../.env' });

const client = new Client({
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  database: process.env.POSTGRES_DATABASE ?? 'ipos'
});

client.on('error', (error: Error) => {
  console.error(error.stack);
});

await client.connect();

export async function fetchOrg(id: number): Promise<Organization | null> {
  const res = await client.query('SELECT id, name, description FROM org WHERE id = $1;', [id]);
  if (res.rowCount ?? 0 > 0) {
    return {
      id: res.rows[0].id,
      name: res.rows[0].name,
      description: res.rows[0].description
    };
  }
  return null;
}

export default client;
