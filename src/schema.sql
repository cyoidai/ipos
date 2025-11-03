CREATE TABLE org(
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE role(
    id serial PRIMARY KEY,
    org_id int4 NOT NULL,
    name text NOT NULL,
    permission int4 NOT NULL,

    FOREIGN KEY (org_id) REFERENCES org(id) ON DELETE CASCADE,
    UNIQUE (org_id, name)
);

CREATE TABLE "user"(
    id serial PRIMARY KEY,
    -- no NOT NULL here for the case of the root user who is tied to no
    -- organization. however, all other users must be tied to an organization.
    org_id     int4,
    username   text     NOT NULL,
    first_name text     NOT NULL,
    last_name  text     NOT NULL,
    password   bit(512) NOT NULL,
    role_id    int4,

    FOREIGN KEY (org_id) REFERENCES org(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    UNIQUE (org_id, username)
);

CREATE INDEX user_search ON "user"(org_id, username);

CREATE TABLE item(
    id serial PRIMARY KEY,
    org_id int4 NOT NULL,
    name text NOT NULL,
    description text NOT NULL DEFAULT '',
    qty int4 CHECK (qty >= 0)
        NOT NULL
        DEFAULT 0,
    price numeric(10, 2) CHECK (price >= 0)
        NOT NULL
        DEFAULT 0,

    FOREIGN KEY (org_id) REFERENCES org(id) ON DELETE CASCADE,
    UNIQUE (org_id, name)
);

CREATE INDEX inventory_search ON item(org_id, name);

CREATE TABLE "order"(
    id serial8 PRIMARY KEY,
    org_id int4 NOT NULL,
    authorized_by int4,
    time int8 NOT NULL,

    FOREIGN KEY (org_id) REFERENCES org(id) ON DELETE CASCADE,
    FOREIGN KEY (authorized_by) REFERENCES "user"(id) ON DELETE SET NULL
);

CREATE TABLE order_item(
    order_id  int8 NOT NULL,
    item_id   int4 NOT NULL,
    item_name text NOT NULL,
    qty       int  NOT NULL,

    PRIMARY KEY (order_id, item_id),
    FOREIGN KEY (order_id) REFERENCES "order"(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE SET NULL
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
