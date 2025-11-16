CREATE TABLE org(
    id        serial PRIMARY KEY,
    name        text NOT NULL UNIQUE,
    description text NOT NULL DEFAULT ''
);

CREATE INDEX org_search ON org(name);

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
    password  bytea NOT NULL, -- utf-8 sha512 hash
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
    reorder_threshold int4 NOT NULL DEFAULT 0, -- <=0 indicates disabled
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
