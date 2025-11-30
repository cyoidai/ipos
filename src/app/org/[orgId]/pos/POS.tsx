'use client';

import { Mosaic, MosaicNode, MosaicWindow } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import './mosaic.css';
import { Order, OrderItem } from '@/order';
import { Organization } from '@/org';
import Form from 'react-bootstrap/Form';
import ItemList from './ItemList';
import OrderItemList from './OrderItemList';
import OrderTotal from './OrderTotal';
import Payment from './Payment';
import React, { useState } from 'react';

type ViewId = 'inventory' | 'items' | 'total' | 'new' | 'payment';

const TITLE_MAP: Record<ViewId, string> = {
  inventory: 'Inventory',
  items: 'Order items',
  total: 'Total',
  payment: 'Payment',
  new: 'New'
};

export default function POS({
  org
}: {
  org: Organization
}) {

  const [order, setOrder] = useState<Order>(new Order());
  const [orderItems, setOrderItems] = useState<Map<string, OrderItem>>(new Map<string, OrderItem>());
  const [mosaicState, setMosaicState] = useState<MosaicNode<ViewId> | null>({
    direction: 'row',
    first: {
      direction: 'row',
      first: 'inventory',
      second: 'payment'
    },
    second: {
      direction: 'column',
      first: 'items',
      second: 'total'
    },
    splitPercentage: 66
  });

  return (
    <React.Fragment>
      <Mosaic<ViewId>
        renderTile={(id, path) => {
          if (id === 'inventory')
            return (
              <MosaicWindow<string> path={path} createNode={() => 'new'} title={TITLE_MAP[id]}>
                <section>
                  <ItemList org={org} orderItems={orderItems} setOrderItems={setOrderItems} />
                </section>
              </MosaicWindow>
            );
          if (id === 'total')
            return (
              <MosaicWindow<string> path={path} createNode={() => 'new'} title={TITLE_MAP[id]}>
                <section>
                  <OrderTotal order={order} setOrder={setOrder} itemsMap={orderItems} />
                </section>
              </MosaicWindow>
            );
          if (id === 'items')
            return (
              <MosaicWindow<string> path={path} createNode={() => 'new'} title={TITLE_MAP[id]}>
                <section>
                  <OrderItemList items={orderItems} setItems={setOrderItems} />
                </section>
              </MosaicWindow>
            );
          if (id === 'payment')
            return (
              <MosaicWindow<string> path={path} createNode={() => 'new'} title={TITLE_MAP[id]}>
                <section>
                  <Payment order={order} setOrder={setOrder} orderItems={orderItems} setOrderItems={setOrderItems} />
                </section>
              </MosaicWindow>
            );
          return (
            <MosaicWindow<ViewId> path={path} createNode={() => 'new'} title={TITLE_MAP[id]}>
              <Form.Select>
                {
                  Object.keys(TITLE_MAP).map((key, i) => {
                    return (
                      <option key={i} value={key}>{TITLE_MAP[key]}</option>
                    );
                  })
                }
              </Form.Select>
            </MosaicWindow>
          );
        }}
        value={mosaicState}
        onChange={setMosaicState}
      />
    </React.Fragment>
  );
}
