import express, { type Request, type Response } from 'express';
import { param, body, validationResult } from 'express-validator';
import client from './database.js';

const app = express();
app.use(express.json());
const port = 3001;

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
