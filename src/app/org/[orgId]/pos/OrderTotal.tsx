import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import { Order, OrderItem } from '@/order';
import { Item } from '@/item';
import useFetch from '@/useFetch';
import Decimal from 'decimal.js';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';

export default function OrderTotal({
  itemsMap,
  order,
  setOrder
}: {
  itemsMap: Map<string, OrderItem>,
  order: Order,
  setOrder: (order: Order) => void
}) {

  const [taxRate, setTaxRate] = useState<number>(.04);

  useEffect(() => {
    let subtotal = new Decimal(0);
    itemsMap.forEach((item) => {
      subtotal = subtotal.plus(new Decimal(item.price).times(item.orderQty));
    });
    const tax = subtotal.times(taxRate).toDecimalPlaces(2);
    const total = subtotal.plus(tax);
    setOrder({ ...order, subtotal: subtotal.toNumber(), tax: tax.toNumber(), total: total.toNumber() });
  }, [itemsMap, taxRate]);

  // useEffect(() => {
  //   let subtotal = new Decimal(0);
  //   itemsMap.forEach((item) => {
  //     subtotal = subtotal.plus(new Decimal(item.price).times(item.orderQty));
  //   });
  //   const tax = subtotal.times(taxRate);
  //   const total = subtotal.plus(tax);
  //   setOrder({ ...order, subtotal: subtotal.toNumber(), tax: tax.toNumber(), total: total.toNumber() });
  // }, [itemsMap]);

  return (
    <React.Fragment>
      <Table hover>
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td className='text-end'>${order.subtotal}</td>
          </tr>
          <tr>
            <td>Tax rate</td>
            <td className='text-end'>{taxRate * 100}%</td>
          </tr>
          <tr>
            <td>Tax</td>
            <td className='text-end'>${order.tax}</td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td className='text-end'><b>${order.total}</b></td>
          </tr>
          {/* <tr>
            <td>Change</td>
            <td className='text-end'>${change.toString()}</td>
          </tr> */}
        </tbody>
      </Table>
    </React.Fragment>
  );
}
