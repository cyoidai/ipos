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
      const resp = (await client.query('SELECT id, name, description FROM org ORDER BY name ASC;'));
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

app.get('/api/v1/item', [
  query('orgId').isInt(),
  query('query').optional({ nullable: true }).isString().trim()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: response.array() });
  try {
    if (req.query.query) {
      let q: string = '';
      (req.query.query as string)
        .split(/\s+/)
        .forEach((s, i) => {
          if (q.length === 0)
            q = s + ':*';
          else
            q = q + ' & ' + s + ':*';
      });
      const resp = await client.query(`
        SELECT id, org_id AS "orgId", sku, name, description, icon_path AS "iconPath"
          , qty, price, reorder_threshold AS "reorderThreshold"
        FROM item, to_tsquery('english', $2) as q
        WHERE org_id = $1 AND search @@ q
        ORDER BY ts_rank(search, q) DESC;`, [req.query.orgId, q]);
      return res.status(constants.HTTP_STATUS_OK).json(resp.rows);
    } else {
      const resp = await client.query(`
        SELECT id, org_id AS "orgId", sku, name, description, icon_path AS "iconPath"
          , qty, price, reorder_threshold AS "reorderThreshold"
        FROM item
        WHERE org_id = $1
        ORDER BY name ASC;
      `, [req.query.orgId]);
      return res.status(constants.HTTP_STATUS_OK).json(resp.rows);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.post('/api/v1/item', [
  body('orgId').isInt(),
  body('sku').isString().trim().notEmpty(),
  body('name').isString().trim().notEmpty(),
  body('description').isString().trim(),
  body('iconPath').isString(),
  body('qty').isInt(),
  body('price').isFloat(),
  body('reorderThreshold').isInt()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: response.array() });
  try {
    await client.query(`
      INSERT INTO item(org_id, sku, name, description, icon_path, qty, price, reorder_threshold)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8);`,
      [req.body.orgId, req.body.sku, req.body.name, req.body.description
        , req.body.iconPath, req.body.qty, req.body.price, req.body.reorderThreshold]);
    return res.status(constants.HTTP_STATUS_OK).json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.put('/api/v1/item', [
  body('id').isInt(),
  body('sku').isString().trim().notEmpty(),
  body('name').isString().trim().notEmpty(),
  body('description').isString().trim(),
  body('iconPath').isString(),
  body('qty').isInt(),
  body('price').isFloat(),
  body('reorderThreshold').isInt()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: response.array() });
  try {
    await client.query(`
      UPDATE item
      SET sku = $1, name = $2, description = $3, icon_path = $4, qty = $5, price = $6, reorder_threshold = $7
      WHERE id = $8;`,
      [req.body.sku, req.body.name, req.body.description, req.body.iconPath, req.body.qty
        , req.body.price, req.body.reorderThreshold, req.body.id]);
    return res.status(constants.HTTP_STATUS_OK).json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.delete('/api/v1/item', [
  body('id').isInt()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: response.array() });
  try {
    await client.query('DELETE FROM item WHERE id = $1;', [req.body.id]);
    return res.status(constants.HTTP_STATUS_OK).json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.get('/api/v1/role', [
  query('orgId').isInt()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      msg: 'validation error',
      errors: response.array()
    });
  try {
    const resp = await client.query('SELECT id, org_id AS "orgId", name, description, permission FROM role WHERE org_id = $1;', [req.query.orgId]);
    return res.status(constants.HTTP_STATUS_OK).json(resp.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.post('/api/v1/role', [
  body('orgId').isInt(),
  body('name').isString().trim().notEmpty(),
  body('description').isString().trim(),
  body('permission').isInt()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: response.array() });
  try {
    await client.query('INSERT INTO role(org_id, name, description, permission) VALUES($1, $2, $3, $4);'
      , [req.body.orgId, req.body.name, req.body.description, req.body.permission]);
    return res.status(constants.HTTP_STATUS_OK).json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.put('/api/v1/role', [
  body('id').isInt(),
  body('name').isString().trim().notEmpty(),
  body('description').isString().trim(),
  body('permission').isInt()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: response.array() });
  try {
    await client.query('UPDATE role SET name = $1, description = $2, permission = $3 WHERE id = $4;'
      , [req.body.name, req.body.description, req.body.permission, req.body.id]);
    return res.status(constants.HTTP_STATUS_OK).json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.delete('/api/v1/role', [
  body('id').isInt()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: response.array() });
  try {
    await client.query('DELETE FROM role WHERE id = $1;', [req.body.id]);
    return res.status(constants.HTTP_STATUS_OK).json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.get('/api/v1/order', [
  query('orgId').isInt()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: response.array() });
  try {
    const resp = await client.query(`
      SELECT "order".id
        , "order".org_id AS "orgId"
        , "user".id AS userId
        , "user".username AS username
        , "user".first_name AS "firstName"
        , "user".last_name AS "lastName"
        , COUNT(order_item.item_id) AS item_count
        , subtotal, tax, total
        , time
      FROM "order"
      INNER JOIN "user" ON "user".id = "order".authorized_by
      INNER JOIN order_item ON "order".id = order_item.order_id
      WHERE "order".org_id = $1
      GROUP BY "order".id, "user".id
      ORDER BY time DESC;
      `, [req.query.orgId]);
    const data: {
      id: number,
      orgId: number,
      authorizedBy: {
        userId: number,
        username: string,
        firstName: string,
        lastName: string
      },
      itemCount: number,
      subtotal: string,
      tax: string,
      total: string,
      time: string
    }[] = [];
    resp.rows.forEach((order) => {
      data.push({
        id: order.id,
        orgId: order.orgId,
        authorizedBy: {
          userId: order.userId,
          username: order.username,
          firstName: order.firstName,
          lastName: order.lastName
        },
        itemCount: order.item_count,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        time: order.time
      });
    });
    return res.status(constants.HTTP_STATUS_OK).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.post('/api/v1/order', [
  body('orgId').isInt(),
  body('authorizedBy').isInt(),
  body('subtotal').isFloat(),
  body('tax').isFloat(),
  body('total').isFloat(),
  body('items').isArray(),
  body('items.*.id').isInt(),
  body('items.*.price').isFloat(),
  body('items.*.qty').isInt()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: response.array() });
  try {
    await client.query('BEGIN;');
    const orderId = (await client.query(`
      INSERT INTO "order"(org_id, authorized_by, subtotal, tax, total, time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;`
      , [req.body.orgId, req.body.authorizedBy, req.body.subtotal, req.body.tax, req.body.total, Math.round(Date.now() / 1000)]))
      .rows[0].id;
    for (const item of req.body.items) {
      await client.query(`
        INSERT INTO order_item(order_id, item_id, price, qty)
        VALUES ($1, $2, $3, $4);`
        , [orderId, item.id, item.price, item.qty]);
    }
    await client.query('COMMIT;');
    res.status(constants.HTTP_STATUS_OK).json({ msg: 'OK' });
  } catch (error) {
    await client.query('ROLLBACK;');
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.get('/api/v1/order/item', [
  query('orderId').isInt()
], async (req: Request, res: Response) => {
  const response = validationResult(req);
  if (!response.isEmpty())
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ msg: 'validation error', errors: response.array() });
  try {
    const resp = await client.query(`
      SELECT name, order_item.price, order_item.qty
      FROM order_item
      INNER JOIN item ON order_item.item_id = item.id
      WHERE order_id = $1;
      `, [req.query.orderId]);
    return res.status(constants.HTTP_STATUS_OK).json(resp.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
