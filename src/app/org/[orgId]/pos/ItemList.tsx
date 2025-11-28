'use client';

import useFetch from '@/useFetch';
import Table from 'react-bootstrap/table';
import { Item } from '@/item';
import { Organization } from '@/org';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { OrderItem } from '@/order';

export default function ItemList({
  org,
  selectedItemsMap,
  setSelectedItemsMap
}: {
  org: Organization,
  selectedItemsMap: { [sku: string]: OrderItem },
  setSelectedItemsMap: (map: { [sku: string]: OrderItem }) => void
}) {

  const [query, setQuery] = useState<string>('');
  const { data, isLoading, error } = useFetch<Item[]>('/api/v1/item', { orgId: org.id, query });
  // const [itemMap, setItemMap] = useState<{ [sku: string]: OrderItemStruct }>({});
  // const [itemMap, setItemMap] = useState(new Map<string, OrderItemStruct>());

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
          type='text' placeholder='Search by name or SKU' value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant='secondary' onClick={() => setQuery('')}>X</Button>
      </div>
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
                      <Button variant='danger' onClick={() => {
                        const orderQty = Math.max(0, (selectedItemsMap[item.sku]?.orderQty ?? 0) - 1);
                        if (orderQty === 0) {
                          const items = { ...selectedItemsMap };
                          delete items[item.sku];
                          setSelectedItemsMap(items);
                        } else
                          setSelectedItemsMap({ ...selectedItemsMap, [item.sku]: { ...new OrderItem(), ...item, orderQty } });
                      }}>&nbsp;&minus;&nbsp;</Button>
                      <Form.Control
                        type='number' style={{ width: '4em' }} min={0} step={1}
                        value={selectedItemsMap[item.sku]?.orderQty ?? 0}
                        onChange={(e) => {
                          const n = parseInt(e.target.value);
                          const orderQty = Number.isNaN(n) ? 0 : Math.max(0, n);
                          setSelectedItemsMap({ ...selectedItemsMap, [item.sku]: { ...new OrderItem(), ...item, orderQty } });
                        }}
                      />
                      <Button variant='success' onClick={() => {
                        const orderQty: number = (selectedItemsMap[item.sku]?.orderQty ?? 0) + 1;
                        setSelectedItemsMap({ ...selectedItemsMap, [item.sku]: { ...new OrderItem(), ...item, orderQty } });
                        console.log(selectedItemsMap);
                      }}>&nbsp;+&nbsp;</Button>
                      <Button variant='secondary' onClick={() => {
                        const items = { ...selectedItemsMap };
                        delete items[item.sku];
                        setSelectedItemsMap(items);
                      }}>CLR</Button>
                    </div>
                  </div>
                </div>
              </ListGroupItem>
            );
          })
        }
      </ListGroup>
    </React.Fragment>
  );
}
