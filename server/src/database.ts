import 'dotenv/config';
import { Client } from 'pg';
import { hashPassword } from './utils.js';

const client = new Client({
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  database: process.env.POSTGRES_DATABASE ?? 'ipos',
});

client.on('error', (error: Error) => {
  console.error(error.stack);
});

await client.connect();

try {
  const initialized: boolean = (await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND   table_name = 'org'
    );
  `)).rows[0].exists;

  if (!initialized) {
    client.query('BEGIN;');
    client.query(`
CREATE TABLE org(
    id        serial PRIMARY KEY,
    name        text NOT NULL UNIQUE,
    description text NOT NULL DEFAULT ''
);

CREATE TABLE role(
    id       serial PRIMARY KEY,
    org_id     int4 NOT NULL,
    name       text NOT NULL,
    permission int4 NOT NULL,

    FOREIGN KEY (org_id) REFERENCES org(id) ON DELETE CASCADE,
    UNIQUE (org_id, name)
);

CREATE TABLE "user"(
    id       serial PRIMARY KEY,
    org_id     int4 NOT NULL,
    username   text NOT NULL,
    first_name text NOT NULL DEFAULT '',
    last_name  text NOT NULL DEFAULT '',
    password  bytea NOT NULL,
    role_id    int4 DEFAULT NULL,

    FOREIGN KEY (org_id) REFERENCES org(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    UNIQUE (org_id, username)
);

CREATE INDEX user_search ON "user"(org_id, username);

CREATE TABLE item(
    id             serial8 PRIMARY KEY,
    org_id            int4 NOT NULL,
    sku               text NOT NULL,
    name              text NOT NULL,
    description       text NOT NULL DEFAULT '',
    icon_path         text NOT NULL DEFAULT '',
    qty               int4 NOT NULL DEFAULT 0 CHECK (qty >= 0),
    reorder_threshold int4 NOT NULL DEFAULT 0, -- 0 indicates disabled
    price   numeric(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),

    FOREIGN KEY (org_id) REFERENCES org(id) ON DELETE CASCADE,
    UNIQUE (org_id, sku)
);

CREATE INDEX inventory_search ON item(org_id, sku);

CREATE TABLE "order"(
    id         serial8 PRIMARY KEY,
    org_id        int4 NOT NULL,
    authorized_by int4 NOT NULL,
    time          int8 NOT NULL,

    FOREIGN KEY (org_id) REFERENCES org(id) ON DELETE CASCADE,
    FOREIGN KEY (authorized_by) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE order_item(
    order_id  int8 NOT NULL,
    item_id   int4 NOT NULL,
    item_name text NOT NULL,
    qty       int  NOT NULL,

    PRIMARY KEY (order_id, item_id),
    FOREIGN KEY (order_id) REFERENCES "order"(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE RESTRICT
);

CREATE TABLE shift_history(
    id       serial8 PRIMARY KEY,
    user_id  int4    NOT NULL,
    clock_in boolean NOT NULL,
    time     int8    NOT NULL,

    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE audit_log(
    id     serial8 PRIMARY KEY,
    org_id int4    NOT NULL,
    time   int8    NOT NULL,
    msg    text    NOT NULL,

    FOREIGN KEY (org_id) REFERENCES org(id) ON DELETE CASCADE
);

CREATE TABLE schedule(
    id      serial8 PRIMARY KEY,
    org_id     int4 NOT NULL,
    start_time int8 NOT NULL,
    end_time   int8 NOT NULL,

    FOREIGN KEY (org_id) REFERENCES org(id) ON DELETE CASCADE
);

CREATE TABLE schedule_user(
    schedule_id int8 NOT NULL,
    user_id     int4 NOT NULL,

    PRIMARY KEY (schedule_id, user_id),
    FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);
    `);
    await client.query(`
      INSERT INTO org(name, description)
      VALUES('root', 'reserved for root login');`);

    await client.query(`
      INSERT INTO "user"(org_id, username, password)
      VALUES($1, 'root', $2);`, [
        (await client.query('SELECT id FROM org WHERE name = \'root\'')).rows[0].id,
        hashPassword('changeme')
      ]);
    await client.query('COMMIT;');
  }
} catch (error) {
  client.query('ROLLBACK;');
  console.log('Failed to initialize database', error);
}


// try {
//   const res = await client.query('SELECT COUNT(*) FROM org;');
//   if (res.rows[0][0] == 0) {
//     client.query(`
//     INSERT INTO org(name, description)
//     VALUES("default", "Reserved for the root user");
//   `);
//   }
// } catch (error) {
//   console.log('Failed to initialize database', error);
// } finally {
//   await client.end()
// }

export default client;
