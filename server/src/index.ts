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
  query('id').optional().toInt()
], async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });
  try {
    if (req.query.id) {
      const resp = (await client.query('SELECT id, name, description FROM org WHERE id = $1;', [req.query.id]));
      res.json(resp.rows);
    } else {
      const resp = (await client.query('SELECT id, name, description FROM org;'));
      res.json(resp.rows);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/v1/org', [
  body('name').isString(),
  body('description').isString()
], async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });
  try {
    await client.query('INSERT INTO org(name, description) VALUES($1, $2)', [req.body.name, req.body.description]);
    res.json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.put('/api/v1/org', [
  body('id').isInt(),
  body('name').isString().notEmpty(),
  body('description').isString()
], async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });
  if (req.body.id === rootOrgId)
    return res.status(400).json({ msg: 'Cannot edit the root organization' });
  try {
    await client.query('UPDATE org SET name = $1, description = $2 WHERE id = $3', [req.body.name, req.body.description, req.body.id]);
    res.json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.delete('/api/v1/org', [
  body('id').isInt()
], async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });
  try {
    if (req.body.id === rootOrgId)
      return res.status(400).json({ msg: 'Cannot delete the root organization' });
    await client.query('DELETE FROM org WHERE id = $1', [req.body.id]);
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
  console.log(`Server listening on port ${port}`);
});
