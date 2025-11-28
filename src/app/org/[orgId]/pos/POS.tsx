'use client';

import { Mosaic, MosaicNode, MosaicWindow } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import './mosaic.css';
import { Item } from '@/item';
import { OrderItem } from '@/order';
import { Organization } from '@/org';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ItemList from './ItemList';
import OrderItemList from './OrderItemList';
import OrderTotal from './OrderTotal';
import Payment from './Payment';
import React, { useState, useEffect } from 'react';
import useFetch from '@/useFetch';

type ViewId = 'inventory' | 'items' | 'total' | 'new' | 'payment';

const ELEMENT_MAP: { [viewId: ViewId]: JSX.Element } = {
  inventory: <div>test</div>,
  items: <div>Top Right Window</div>,
  total: <div>Bottom Right Window</div>,
  payment: <div></div>,
  new: null
};

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

  const [orderItemsMap, setOrderItemsMap] = useState<{ [sku: string]: OrderItem; }>({});
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [treeState, setTreeState] = useState<MosaicNode<ViewId> | null>({
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

  useEffect(() => { setOrderItems(Object.values(orderItemsMap)); }, [orderItemsMap]);

  return (
    <React.Fragment>
      <Mosaic<ViewId>
        renderTile={(id, path) => {
          if (id === 'inventory')
            return (
              <MosaicWindow<string> path={path} createNode={() => 'new'} title={TITLE_MAP[id]}>
                <section>
                  <ItemList org={org} selectedItemsMap={orderItemsMap} setSelectedItemsMap={setOrderItemsMap} />
                </section>
              </MosaicWindow>
            );
          if (id === 'total')
            return (
              <MosaicWindow<string> path={path} createNode={() => 'new'} title={TITLE_MAP[id]}>
                <section>
                  <OrderTotal itemsMap={orderItemsMap} />
                </section>
              </MosaicWindow>
            );
          if (id === 'items')
            return (
              <MosaicWindow<string> path={path} createNode={() => 'new'} title={TITLE_MAP[id]}>
                <section>
                  <OrderItemList items={orderItems} />
                </section>
              </MosaicWindow>
            );
          if (id === 'payment')
            return (
              <MosaicWindow<string> path={path} createNode={() => 'new'} title={TITLE_MAP[id]}>
                <section>
                  <Payment />
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
        value={treeState}
        onChange={setTreeState}
      />
    </React.Fragment>
  );
}
