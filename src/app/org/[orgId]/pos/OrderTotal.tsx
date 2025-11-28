import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import { OrderItem } from '@/order';
import { Item } from '@/item';
import useFetch from '@/useFetch';
import Decimal from 'decimal.js';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';

export default function OrderTotal({
  itemsMap
}: {
  itemsMap: { [sku: string]: OrderItem }
}) {

  const [items, setItems] = useState<OrderItem[]>([]);
  const [subtotal, setSubtotal] = useState<Decimal>(new Decimal(0));
  const [tax, setTax] = useState<Decimal>(new Decimal(0));
  const [taxRate, setTaxRate] = useState<number>(.04);
  const [total, setTotal] = useState<Decimal>(new Decimal(0));
  const [change, setChange] = useState<Decimal>(new Decimal(0));

  useEffect(() => {
    const _items = Object.values(itemsMap);
    let _subtotal = new Decimal(0);
    for (const item of items)
      if (item.orderQty > 0)
        _subtotal = _subtotal.plus(new Decimal(item.price).times(item.orderQty));
    // const _tax = _subtotal * taxRate;
    // const _total = _subtotal + tax;
    setItems(_items);
    setSubtotal(_subtotal);
    // setTax(_tax);
    // setTotal(_total);
  }, [itemsMap]);

  return (
    <React.Fragment>
      <Table hover>
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td className='text-end'>${subtotal.toString()}</td>
          </tr>
          <tr>
            <td>Tax rate</td>
            <td className='text-end'>{taxRate * 100}%</td>
          </tr>
          <tr>
            <td>Tax</td>
            <td className='text-end'>${tax.toString()}</td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td className='text-end'><b>${total.toString()}</b></td>
          </tr>
          <tr>
            <td>Change</td>
            <td className='text-end'>${change.toString()}</td>
          </tr>
        </tbody>
      </Table>
    </React.Fragment>
  );
}
