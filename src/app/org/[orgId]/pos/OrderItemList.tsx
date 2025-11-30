import { incrementItem, decrementItem, deleteItem, setItemQty } from './utils';
import { OrderItem } from '@/order';
import Button from 'react-bootstrap/Button';
import Decimal from 'decimal.js';
import Form from 'react-bootstrap/Form';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

export default function OrderItemList({
  items,
  setItems
}: {
  items: Map<string, OrderItem>,
  setItems: (map: Map<string, OrderItem>) => void
}) {

  const [itemsArray, setItemsArray] = useState<OrderItem[]>([]);
  useEffect(() => {
    setItemsArray(items.values().toArray());
  }, [items]);


  return (
    <Table size='sm' hover>
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {
          itemsArray.length === 0
            ? <tr>
              <td className='text-center' colSpan={3}>Items will appear here</td>
            </tr>
            : itemsArray.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td className='d-flex gap-1'>
                      <Button size='sm' variant='danger' onClick={() => setItems(decrementItem(items, item))}>&minus;</Button>
                      <Form.Control
                        style={{ width: '3rem' }} size='sm' type='number' value={item.orderQty} onChange={(e) => {
                          let n = parseInt(e.target.value, 10);
                          if (isNaN(n))
                            n = 1;
                          setItems(setItemQty(items, item, n));
                        }}
                        />
                      <Button size='sm' variant='success' onClick={() => setItems(incrementItem(items, item))}>+</Button>
                      <Button size='sm' variant='secondary' onClick={() => setItems(deleteItem(items, item))}>X</Button>
                    </td>
                    <td className='text-end'>${new Decimal(item.price).times(item.orderQty).toString()}</td>
                  </tr>
                );
              })
        }
      </tbody>
    </Table>
  );
}
