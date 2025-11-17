import express, { type Request, type Response } from 'express';
import { query, body, validationResult } from 'express-validator';
import client from './database.js';
import { hashPassword } from './utils.js';
import { timingSafeEqual } from 'node:crypto';
import { constants } from 'node:http2';

const app = express();
app.use(express.json());
const port = 3001;
const rootOrgId: number = (await client.query('SELECT id FROM org WHERE name = \'root\';')).rows[0].id;

app.post('/api/v1/auth', [
  body('orgId').isInt(),
  body('username').isString().trim().notEmpty(),
  body('password').isString().notEmpty()
], async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: result.array() });
  try {
    const resp = await client.query('SELECT password FROM "user" WHERE org_id = $1 AND username = $2;'
      , [req.body.orgId, req.body.username]);
    if (resp.rows.length === 0)
      return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({ msg: 'Invalid credentials' });
    const hashedPassword = resp.rows[0].password;
    if (timingSafeEqual(hashedPassword, hashPassword(req.body.password)))
      return res.status(constants.HTTP_STATUS_OK).json({ msg: 'OK' });
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({ msg: 'Invalid credentials' });
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.get('/api/v1/org', [
  query('id').optional().toInt()
], async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: result.array() });
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
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.post('/api/v1/org', [
  body('name').isString().trim().notEmpty(),
  body('description').isString().trim()
], async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: result.array() });
  try {
    await client.query('INSERT INTO org(name, description) VALUES($1, $2)', [req.body.name, req.body.description]);
    res.json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.put('/api/v1/org', [
  body('id').isInt(),
  body('name').isString().trim().notEmpty(),
  body('description').isString().trim()
], async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: result.array() });
  if (req.body.id === rootOrgId)
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'Cannot edit the root organization' });
  try {
    await client.query('UPDATE org SET name = $1, description = $2 WHERE id = $3', [req.body.name, req.body.description, req.body.id]);
    res.json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.delete('/api/v1/org', [
  body('id').isInt()
], async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: result.array() });
  try {
    if (req.body.id === rootOrgId)
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'Cannot delete the root organization' });
    await client.query('DELETE FROM org WHERE id = $1', [req.body.id]);
    res.json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.get('/api/v1/user', [
  query('orgId').isInt()
], async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: result.array() });
  try {
    const resp = (await client.query(`
      SELECT "user".id, first_name AS "firstName", last_name AS "lastName", username
        , role_id AS "roleId", role.name AS "roleName"
        , CASE
            WHEN role.permission IS NULL THEN 0
            ELSE role.permission
          END AS "permission"
      FROM "user"
      LEFT JOIN role ON "user".role_id = role.id
      WHERE "user".org_id = $1;`, [req.query.orgId]));
    res.json(resp.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.post('/api/v1/user', [
  body('orgId').isInt(),
  body('username').isString().trim().notEmpty(),
  body('password').isString().notEmpty(),
  body('firstName').isString().trim(),
  body('lastName').isString().trim(),
  body('roleId').optional({ nullable: true }).isInt()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: response.array() });
  try {
    await client.query(`
      INSERT INTO "user"(org_id, username, first_name, last_name, password, role_id)
      VALUES($1, $2, $3, $4, $5, $6);`,
      [req.body.orgId, req.body.username, req.body.firstName, req.body.lastName, hashPassword(req.body.password), req.body.roleId]
    );
    console.log('User created: ' + req.body.username);
    res.status(constants.HTTP_STATUS_OK).json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    return res.json({ msg: error });
  }
});

app.put('/api/v1/user', [
  body('id').isInt(),
  body('username').isString().trim().notEmpty(),
  body('firstName').isString().trim(),
  body('lastName').isString().trim(),
  body('roleId').optional({ nullable: true }).isInt()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: response.array() });
  try {
    await client.query(`
      UPDATE "user"
      SET username = $1, first_name = $2, last_name = $3, role_id = $4
      WHERE id = $5;`,
      [req.body.username, req.body.firstName, req.body.lastName, req.body.roleId, req.body.id]
    );
    console.log('User updated: ' + req.body.id);
    res.status(constants.HTTP_STATUS_OK).json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.delete('/api/v1/user', [
  body('id').isInt()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: response.array() });
  try {
    await client.query('DELETE FROM "user" WHERE id = $1', [req.body.id]);
    console.log('User deleted: ' + req.body.id);
    res.status(constants.HTTP_STATUS_OK).json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
