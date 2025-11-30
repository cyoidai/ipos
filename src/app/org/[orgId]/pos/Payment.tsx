import { Order, OrderItem } from "@/order";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Decimal from "decimal.js";
import Form from "react-bootstrap/Form";
import Table from 'react-bootstrap/Table';

export default function Payment({
  order,
  setOrder,
  orderItems,
  setOrderItems
}: {
  order: Order,
  setOrder: (order: Order) => void,
  orderItems: Map<string, OrderItem>,
  setOrderItems: (items: Map<string, OrderItem>) => void
}) {

  const [checkAmount, setCheckAmount] = useState<Decimal>(new Decimal(0));
  const [cashAmount, setCashAmount] = useState<Decimal>(new Decimal(0));
  const [creditAmount, setCreditAmount] = useState<Decimal>(new Decimal(0));
  const [debitAmount, setDebitAmount] = useState<Decimal>(new Decimal(0));
  const [giftAmount, setGiftAmount] = useState<Decimal>(new Decimal(0));

  const [amountPaid, setAmountPaid] = useState<Decimal>(new Decimal(0));
  const [amountDue, setAmountDue] = useState<Decimal>(new Decimal(0));
  const [change, setChange] = useState<Decimal>(new Decimal(0));

  useEffect(() => {
    const paid = Decimal.sum(checkAmount, cashAmount, creditAmount, debitAmount, giftAmount);
    const due = Decimal.max(0, new Decimal(order.total).sub(paid));
    const change = Decimal.max(0, paid.sub(order.total));
    setAmountPaid(paid);
    setAmountDue(due);
    setChange(change);
  }, [order, checkAmount, cashAmount, creditAmount, debitAmount, giftAmount]);

  function handleConfirmOrder() {

  }

  function handleCancelOrder() {
    setOrder(new Order());
    setOrderItems(new Map<string, OrderItem>());
  }

  return (
    <div className='m-1'>
      <div className='d-grid gap-1 p-1' style={{
        justifyContent: 'space-between',
        gridTemplateRows: 'auto auto',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr'
      }}>
        <Button className='w-100 py-3' onClick={() => setCheckAmount(Decimal.max(0, amountDue))}>Check</Button>
        <Button className='w-100 py-3' onClick={() => setCashAmount(Decimal.max(0, amountDue))}>Cash</Button>
        <Button className='w-100 py-3' onClick={() => setCreditAmount(Decimal.max(0, amountDue))}>Credit card</Button>
        <Button className='w-100 py-3' onClick={() => setDebitAmount(Decimal.max(0, amountDue))}>Debit card</Button>
        <Button className='w-100 py-3' onClick={() => setGiftAmount(Decimal.max(0, amountDue))}>Gift card</Button>
        <Form.Control type="number" min={0} step={.01} value={checkAmount.toNumber()} onChange={(e) => {
          try { setCheckAmount(new Decimal(e.target.value).toDecimalPlaces(2)); }
          catch { setCheckAmount(new Decimal(0)); }
        }} />
        <Form.Control type="number" min={0} step={.01} value={cashAmount.toNumber()} onChange={(e) => {
          try { setCashAmount(new Decimal(e.target.value).toDecimalPlaces(2)); }
          catch { setCashAmount(new Decimal(0)); }
        }} />
        <Form.Control type="number" value={creditAmount.toNumber()} onChange={(e) => {
          try { setCreditAmount(new Decimal(e.target.value).toDecimalPlaces(2)); }
          catch { setCreditAmount(new Decimal(0)); }
        }} />
        <Form.Control type="number" min={0} step={.01} value={debitAmount.toNumber()} onChange={(e) => {
          try { setDebitAmount(new Decimal(e.target.value).toDecimalPlaces(2)); }
          catch { setDebitAmount(new Decimal(0)); }
        }} />
        <Form.Control type="number" min={0} step={.01} value={giftAmount.toNumber()} onChange={(e) => {
          try { setGiftAmount(new Decimal(e.target.value).toDecimalPlaces(2)); }
          catch { setGiftAmount(new Decimal(0)); }
        }} />
      </div>
      <Table size='sm' hover>
        <tbody>
          <tr>
            <td>Total</td>
            <td className='text-end'>${order.total}</td>
          </tr>
          <tr>
            <td>Amount paid</td>
            <td className='text-end'>${amountPaid.toString()}</td>
          </tr>
          <tr>
            <td>Amount still due</td>
            <td className='text-end'>${amountDue.toString()}</td>
          </tr>
          <tr>
            <td>Change</td>
            <td className='text-end'>${change.toString()}</td>
          </tr>
        </tbody>
      </Table>
      <div className="d-grid gap-1">
        <Button
          variant="success" onClick={handleConfirmOrder}
          disabled={amountDue > new Decimal(0) || order.total == 0 ? true : false}
        >
          Confirm order
        </Button>
        <Button variant="danger" onClick={handleCancelOrder}>Cancel order</Button>
      </div>
    </div>
  );
}
