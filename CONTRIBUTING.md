# Contributing

## Setting up the development environment

Clone the repository.

```bash
git clone https://github.com/cyoidai/ipos.git
```

iPOS requires a PostgreSQL server to be running. You can create one easily through Docker by using the following command, or create one yourself a number of other ways.

```bash
docker run -d --name postgres \
    --restart unless-stopped \
    -p 5432:5432 \
    -v postgres_data:/var/lib/postgresql \
    -e POSTGRES_USER=ipos \
    -e POSTGRES_PASSWORD=password \
    -e POSTGRES_DB=ipos \
    postgres:18
```

Useful web-based database management tool for postgres.

```bash
docker run -d --name adminer --restart unless-stopped -p 8080:8080 adminer
```

Copy `.env.example` to `.env` into the same directory and fill in the variables provided accordingly to how you configured your postgres installation. `API_SERVER_URL` can be kept as is for most cases.

To start the Next.js development server:

```bash
npm install
npm run dev
```

To start the express.js api server:

```bash
cd server
npm install
npm run start
```
