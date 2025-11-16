import express, { type Request, type Response } from 'express';
import { query, body, validationResult } from 'express-validator';
import client from './database.js';
import { hashPassword } from './utils.js';
import { timingSafeEqual } from 'node:crypto';

const app = express();
app.use(express.json());
const port = 3001;
const rootOrgId: number = (await client.query('SELECT id FROM org WHERE name = \'root\';')).rows[0].id;

app.post('/api/v1/auth', [
  body('orgId').isInt(),
  body('username').isString().notEmpty(),
  body('password').isString().notEmpty()
], async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });
  try {
    const resp = await client.query('SELECT password FROM "user" WHERE org_id = $1 AND username = $2;'
      , [req.body.orgId, req.body.username]);
    if (resp.rows.length === 0)
      return res.status(401).json({ msg: 'Invalid credentials' });
    const hashedPassword = resp.rows[0].password;
    if (timingSafeEqual(hashedPassword, hashPassword(req.body.password))) {
      return res.status(200).json({ msg: 'OK' });
    }
    return res.status(401).json({ msg: 'Invalid credentials' });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/v1/org', [
  param('id').optional().isInt()
], async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    res.json({ errors: result.array() });
  try {
    const rows = (await client.query('SELECT id, name, description FROM org;')).rows;
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/v1/org', async (req: Request, res: Response) => {
  try {
    const body: {
      name?: string,
      description?: string
    } = req.body;
    await client.query('INSERT INTO org(name, description) VALUES($1, $2)', [body.name, body.description]);
    res.json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.delete('/api/v1/org', async (req: Request, res: Response) => {
  try {
    const body: {
      id?: number
    } = req.body;
    await client.query('DELETE FROM org WHERE id = $1', [body.id]);
    res.json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    return res.json({ msg: error });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
