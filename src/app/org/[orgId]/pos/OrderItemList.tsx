import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import { OrderItem } from '@/order';
import { Item } from '@/item';
import useFetch from '@/useFetch';
import Decimal from 'decimal.js';
import React, { useState, useEffect } from 'react';

export default function OrderItemList({
  items
}: {
  items: OrderItem[]
}) {
  return (
    <Table size='sm' hover>
      <tbody>
        {
          items.length === 0
            ? <tr>
              <td className='text-center' colSpan={2}>Items will appear here</td>
            </tr>
            : items.map((item, i) => {
                if (item.orderQty > 1)
                  return (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td className='text-end'>({item.orderQty}) ${item.price}</td>
                    </tr>
                  );
                return (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td className='text-end'>${item.price}</td>
                  </tr>
                );
              })
        }
      </tbody>
    </Table>
  );
}
