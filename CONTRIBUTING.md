# Contributing

## Setting up the development environment

iPOS requires a PostgreSQL server to be running. You can create one easily through Docker by using the following command, or create one yourself a number of other ways.

```bash
docker run -d --name postgres \
    --restart unless-stopped \
    --shm-size 128mb \
    -p 5432:5432 \
    -v postgres_data:/var/lib/postgresql/data \
    -e POSTGRES_USER=ipos \
    -e POSTGRES_PASSWORD=changeme \
    -e POSTGRES_DB=ipos \
    postgres:latest
```

Useful web-based database management tool for postgres.

```bash
docker run -d --name adminer -p 8080:8080 adminer
```

Copy `.env.example` to `.env` into the same root directory and fill in the variables provided accordingly. `API_SERVER_URL` can be kept as is for most cases.

To start the development server

```bash
npm run dev
```

To start the api server

```bash
cd server
npm run start
```
