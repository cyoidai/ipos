CREATE TABLE org(
    id        serial PRIMARY KEY,
    name        text NOT NULL UNIQUE,
    description text NOT NULL DEFAULT ''
);

CREATE TABLE role(
    id        serial PRIMARY KEY,
    org_id      int4 NOT NULL,
    name        text NOT NULL,
    description text NOT NULL DEFAULT '',
    permission  int4 NOT NULL,

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

CREATE TABLE item(
    id             serial8 PRIMARY KEY,
    org_id            int4 NOT NULL,
    sku               text NOT NULL,
    name              text NOT NULL,
    description       text NOT NULL DEFAULT '',
    icon_path         text NOT NULL DEFAULT '',
    qty               int4 NOT NULL DEFAULT 0, -- qty can go negative, it's merely an estimation of current stock
    price   numeric(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
    reorder_threshold int4 NOT NULL DEFAULT 0, -- <=0 indicates disabled
    search        tsvector GENERATED ALWAYS AS (
           setweight(to_tsvector('english', coalesce(name,        '')), 'A')
        || setweight(to_tsvector('english', coalesce(sku,         '')), 'B')
        || setweight(to_tsvector('english', coalesce(description, '')), 'C')
    ) STORED,

    FOREIGN KEY (org_id) REFERENCES org(id) ON DELETE CASCADE,
    UNIQUE (org_id, sku)
);

CREATE INDEX item_search_gin ON item USING GIN (search);

CREATE TABLE "order"(
    id         serial8 PRIMARY KEY,
    org_id        int4 NOT NULL,
    authorized_by int4 NOT NULL,
    subtotal      numeric(10, 2) NOT NULL,
    tax           numeric(10, 2) NOT NULL,
    total         numeric(10, 2) NOT NULL,
    time          int8 NOT NULL,

    FOREIGN KEY (org_id) REFERENCES org(id) ON DELETE CASCADE,
    FOREIGN KEY (authorized_by) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE INDEX order_search ON "order"(org_id, time);

CREATE TABLE order_item(
    order_id        int8 NOT NULL,
    item_id         int4 NOT NULL,
    price numeric(10, 2) NOT NULL, -- store copy of item's price at the time of the order
    qty              int NOT NULL DEFAULT 1 CHECK (qty != 0), -- allow negative for handling returns

    PRIMARY KEY (order_id, item_id),
    FOREIGN KEY (order_id) REFERENCES "order"(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE
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
