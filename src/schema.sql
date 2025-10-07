CREATE TABLE org(
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE role(
    id serial PRIMARY KEY,
    org_id int4 REFERENCES org(id)
        ON DELETE CASCADE
        NOT NULL,
    name text NOT NULL,
    permission int4 NOT NULL,

    UNIQUE (org_id, name)
);

CREATE TABLE "user"(
    id serial PRIMARY KEY,
    -- no NOT NULL here for the case of the root user who is tied to no
    -- organization. however, all other users must be tied to an organization.
    org_id int4 REFERENCES org(id)
        ON DELETE CASCADE,
    username text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    password bit(512) NOT NULL,
    role_id int REFERENCES role(id)
        ON DELETE SET NULL,

    UNIQUE (org_id, username)
);

CREATE INDEX user_search ON "user"(org_id, username);

CREATE TABLE inventory(
    id serial PRIMARY KEY,
    org_id int4 REFERENCES org(id)
        ON DELETE CASCADE
        NOT NULL,
    name text NOT NULL,
    qty int4 CHECK (qty >= 0)
        NOT NULL
        DEFAULT 0,
    price numeric(10, 2) CHECK (price >= 0)
        NOT NULL
        DEFAULT 0,

    UNIQUE (org_id, name)
);

CREATE INDEX inventory_search ON inventory(org_id, name);

CREATE TABLE "order"(
    id serial8 PRIMARY KEY,
    org_id int4 REFERENCES org(id)
        ON DELETE CASCADE
        NOT NULL,
    authorized_by int4 REFERENCES "user"(id) ON DELETE SET NULL,
    authorized_by_first_name text NOT NULL,
    authorized_by_last_name text NOT NULL,
    int8 time NOT NULL
);

CREATE TABLE order_item(
    id serial8 PRIMARY KEY,
    order_id int8 REFERENCES "order"(id)
        ON DELETE CASCADE
        NOT NULL,
    item_id int4 REFERENCES inventory(id)
        ON DELETE SET NULL
        NOT NULL,
    item_name text NOT NULL,
    qty int NOT NULL
);

CREATE TABLE shift_history(
    id serial8 PRIMARY KEY,
    org_id int4 REFERENCES org(id)
        ON DELETE CASCADE
        NOT NULL,
    user_id int4 REFERENCES "user"(id)
        ON DELETE SET NULL
        NOT NULL,
    punch_in boolean NOT NULL,
    time int8 NOT NULL
);

CREATE TABLE audit_log(
    id serial8 PRIMARY KEY,
    org_id int4 REFERENCES org(id)
        ON DELETE CASCADE,
    msg text NOT NULL,
    time int8 NOT NULL
);
