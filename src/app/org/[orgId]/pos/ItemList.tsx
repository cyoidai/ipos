import { incrementItem, decrementItem, deleteItem, setItemQty } from './utils';
import { Item } from '@/item';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { OrderItem } from '@/order';
import { Organization } from '@/org';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import Table from 'react-bootstrap/table';
import useFetch from '@/useFetch';


export default function ItemList({
  org,
  orderItems,
  setOrderItems
}: {
  org: Organization
  orderItems: Map<string, OrderItem>,
  setOrderItems: (map: Map<string, OrderItem>) => void
}) {

  const [query, setQuery] = useState<string>('');
  const { data, isLoading, error } = useFetch<Item[]>('/api/v1/item', { orgId: org.id, query });
  enum DisplayMode {
    Table,
    List
  }
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.Table);

  if (isLoading)
    return (
      <React.Fragment>
        <div className='d-flex'>
          <Form.Control type='text' placeholder='Search by name or SKU' value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button variant='secondary' onClick={() => setQuery('')}>X</Button>
        </div>
        <ListGroup variant='flush'>
          <ListGroupItem>
            <span className='text-center'>Loading...</span>
          </ListGroupItem>
        </ListGroup>
      </React.Fragment>
    );

  if (error)
    return (
      <React.Fragment>
        <div className='d-flex'>
          <Form.Control type='text' placeholder='Search by name or SKU' value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button variant='secondary' onClick={() => setQuery('')}>X</Button>
        </div>
        <ListGroup variant='flush'>
          <ListGroupItem>
            <span className='text-center'>An error occurred when loading items</span>
          </ListGroupItem>
        </ListGroup>
      </React.Fragment>
    );

  if (!data || data.length == 0)
    return (
      <React.Fragment>
        <div className='d-flex'>
          <Form.Control type='text' placeholder='Search by name or SKU' value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button variant='secondary' onClick={() => setQuery('')}>X</Button>
        </div>
        <ListGroup variant='flush'>
          <ListGroupItem>
            <span className='text-center'>No items to show</span>
          </ListGroupItem>
        </ListGroup>
      </React.Fragment>
    );

  return (
    <React.Fragment>
      <div className='d-flex gap-1'>
        <Form.Control
          type='text' placeholder='Search by name or SKU' size='sm' value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant='secondary' size='sm' onClick={() => setQuery('')}>X</Button>
        <ButtonGroup size='sm'>
          <Button variant='secondary' onClick={() => setDisplayMode(DisplayMode.List)}><i className="bi bi-list"></i></Button>
          <Button variant='secondary' onClick={() => setDisplayMode(DisplayMode.Table)}><i className="bi bi-table"></i></Button>
        </ButtonGroup>
      </div>
      {
        displayMode == DisplayMode.List
          ?
            <ListGroup variant='flush'>
              {
                data.map((item, i) => {
                  return (
                    <ListGroupItem key={i} disabled={(item.qty <= 0) ? true : false}>
                      <div className='d-flex gap-2' style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <div>
                          <h2 className='h5'>{item.name}</h2>
                          <p>{item.description}</p>
                        </div>
                        <div>
                          <div className='d-flex gap-3 mb-1' style={{
                            justifyContent: 'flex-end',
                            alignItems: 'center'
                          }}>
                            <span><i className="bi bi-stack" aria-label='SKU' /> {item.qty}</span>
                            <span><i className="bi bi-tag-fill" /> {item.sku}</span>
                            <span className='h5 m-0'>${item.price}</span>
                          </div>
                          <div className='d-flex gap-1'>
                            <Button variant='danger' onClick={() => setOrderItems(decrementItem(orderItems, item))}>
                              &nbsp;&minus;&nbsp;
                            </Button>
                            <Form.Control
                              type='number' style={{ width: '4em' }} min={0} step={1}
                              value={orderItems.get(item.sku)?.orderQty ?? 0}
                              onChange={(e) => {
                                let n = parseInt(e.target.value, 10);
                                if (isNaN(n))
                                  n = 1;
                                setOrderItems(setItemQty(orderItems, item, n));
                              }}
                            />
                            <Button variant='success' onClick={() => {
                              setOrderItems(incrementItem(orderItems, item));
                            }}>&nbsp;+&nbsp;</Button>
                            <Button variant='secondary' onClick={() => {
                              deleteItem(orderItems, item);
                            }}>X</Button>
                          </div>
                        </div>
                      </div>
                    </ListGroupItem>
                  );
                })
              }
            </ListGroup>
          :
            <Table size='sm' hover>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{item.sku}</td>
                        <td>{item.name}</td>
                        <td>{item.qty}</td>
                        <td>{item.price}</td>
                        <td className='d-flex gap-1'>
                          <Button variant='danger' size='sm' onClick={() => setOrderItems(decrementItem(orderItems, item))}>
                            &nbsp;&minus;&nbsp;
                          </Button>
                          <Form.Control
                            type='number' size='sm' style={{ width: '3rem' }} min={0} step={1}
                            value={orderItems.get(item.sku)?.orderQty ?? 0}
                            onChange={(e) => {
                              let n = parseInt(e.target.value, 10);
                              if (isNaN(n))
                                n = 1;
                              setOrderItems(setItemQty(orderItems, item, n));
                            }}
                          />
                          <Button variant='success' size='sm' onClick={() => {
                            setOrderItems(incrementItem(orderItems, item));
                          }}>&nbsp;+&nbsp;</Button>
                          <Button variant='secondary' size='sm' onClick={() => {
                            setOrderItems(deleteItem(orderItems, item));
                          }}>X</Button>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </Table>
      }
    </React.Fragment>
  );
}
