'use client';

import { Order, OrderItem } from '@/order';
import { Organization } from '@/org';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import useFetch from '@/useFetch';

function OrderDetails({
  show,
  setShow,
  order
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  order?: Order
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (order) {
      setError(false);
      setIsLoading(true);
      axios.get('/api/v1/order/item', {
        params: {
          orderId: order.id
        }
      }).then((res) => {
        setItems(res.data);
        setIsLoading(false);
      }).catch((error) => {
        setIsLoading(false);
        setError(true);
      });
    }
  }, [order]);

  function handleClose() {
    setShow(false);
  }

  if (isLoading)
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Loading...
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>Ok</Button>
        </Modal.Footer>
      </Modal>
    );

  if (error || !order)
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Something went wrong
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>Ok</Button>
        </Modal.Footer>
      </Modal>
    );

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Order details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3 className='h5'>Transaction details</h3>
        <Table borderless size='sm'>
          <tbody>
            <tr>
              <th>Subtotal</th>
              <td>${order.subtotal}</td>
            </tr>
            <tr>
              <th>Tax</th>
              <td>${order.tax}</td>
            </tr>
            <tr>
              <th>Total</th>
              <td>${order.total}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{new Date(order.time * 1000).toLocaleString()}</td>
            </tr>
          </tbody>
        </Table>
        <h3 className='h5'>Item breakdown</h3>
        <Table size='sm' striped hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {
              items.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>${item.price}</td>
                    <td>{item.qty}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>Ok</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function OrdersTable({
  org
}: {
    org: Organization
}) {

  const cols = 6;
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined);

  function openDetails(order: Order) {
    setSelectedOrder(order);
    setShowDetails(true);
  }

  function TableBody() {
    const { data, isLoading, error } = useFetch<Order[]>('/api/v1/order', { orgId: org.id });

    if (isLoading)
      return (
        <tbody>
          <tr><td className='text-center' colSpan={cols}>Loading...</td></tr>
        </tbody>
      );

    if (error)
      return (
        <tbody>
          <tr><td className='text-center' colSpan={cols}>An error occurred when loading items</td></tr>
        </tbody>
      );

    if (!data || data.length == 0)
      return (
        <tbody>
          <tr><td className='text-center' colSpan={cols}>No items to show</td></tr>
        </tbody>
      );

    return (
      <tbody>
        {
          data.map((order, i) => {
            return (
              <tr key={i}>
                <td>{new Date(order.time * 1000).toLocaleString()}</td>
                <td>{order.id}</td>
                <td>{order.authorizedBy.firstName} {order.authorizedBy.lastName}</td>
                <td>{order.itemCount}</td>
                <td>${order.total}</td>
                <td className="d-flex gap-1">
                  <Button size='sm' variant='primary' onClick={() => openDetails(order)}>Details</Button>
                </td>
              </tr>
            );
          })
        }
      </tbody>
    );
  }
  return (
    <React.Fragment>
      <Table size='sm' hover>
        <thead>
          <tr>
            <th>Time</th>
            <th>Transaction ID</th>
            <th>Authorized by</th>
            <th>Items</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <TableBody />
      </Table>
      <OrderDetails order={selectedOrder} show={showDetails} setShow={setShowDetails} />
    </React.Fragment>
  );
}
