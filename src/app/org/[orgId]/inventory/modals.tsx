'use client';

import { Organization } from '@/org';
import { Item } from '@/item';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { InputGroup } from 'react-bootstrap';
import ConfirmationModal from '@/components/ConfirmationModal';

export function CreateItemModal({
  show,
  setShow,
  org,
  onAccept,
  onReject
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  org: Organization,
  onAccept?: () => void,
  onReject?: () => void
}) {

  const [item, setItem] = useState<Item>(new Item());

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    axios.post('/api/v1/item', {
      ...item,
      orgId: org.id
    }).then((res) => {
      setShow(false);
      setItem(new Item());
      if (onAccept)
        onAccept();
    }).then((error) => {
      if (onReject)
        onReject();
    });
  }
  function handleClose() {
    setShow(false);
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create item</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Item name</Form.Label>
            <Form.Control type="text" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} />
          </Form.Group>
          <Form.Group className='mb-3' controlId='sku'>
            <Form.Label>SKU</Form.Label>
            <Form.Control type="text" value={item.sku} onChange={(e) => setItem({ ...item, sku: e.target.value })} />
          </Form.Group>
          <Form.Group className='mb-3' controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control as='textarea' rows={3} value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} />
          </Form.Group>
          <Form.Group className='mb-3' controlId='qty'>
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" min={0} value={item.qty}
              onChange={(e) => {
                const n = parseInt(e.target.value);
                setItem({ ...item, qty: Number.isNaN(n) ? 0 : n });
              }}/>
          </Form.Group>
          <Form.Group className='mb-3' controlId='price'>
            <Form.Label>Price</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control type="number" min={0} step={.01} value={item.price}
                onChange={(e) => {
                  const n = parseFloat(e.target.value);
                  setItem({ ...item, price: Number.isNaN(n) ? 0 : n });
                }}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className='mb-3' controlId='reorderThreshold'>
            <Form.Label>Reorder threshold (0 to disable)</Form.Label>
            <Form.Control type="number" min={0} value={item.reorderThreshold}
              onChange={(e) => {
                const n = parseInt(e.target.value);
                setItem({ ...item, reorderThreshold: Number.isNaN(n) ? 0 : n });
              }} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" type="submit">Ok</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export function EditItemModal({
  show,
  setShow,
  item,
  onAccept,
  onReject
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  item?: Item,
  onAccept?: () => void,
  onReject?: () => void
}) {

  const [editingItem, setEditingItem] = useState<Item>(new Item());

  useEffect(() => {
    if (item) {
      setEditingItem(item);
    }
  }, [item]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    axios.put('/api/v1/item', editingItem).then((res) => {
      setShow(false);
      if (onAccept)
        onAccept();
    }).then((error) => {
      if (onReject)
        onReject();
    });
  }

  function handleClose() {
    setShow(false);
  }

  if (!item)
    return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit item</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Item name</Form.Label>
            <Form.Control type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
          </Form.Group>
          <Form.Group className='mb-3' controlId='sku'>
            <Form.Label>SKU</Form.Label>
            <Form.Control type="text" value={editingItem.sku} onChange={(e) => setEditingItem({ ...editingItem, sku: e.target.value })} />
          </Form.Group>
          <Form.Group className='mb-3' controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control as='textarea' rows={3} value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} />
          </Form.Group>
          <Form.Group className='mb-3' controlId='qty'>
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" min={0} value={editingItem.qty}
              onChange={(e) => {
                const n = parseInt(e.target.value);
                setEditingItem({ ...editingItem, qty: Number.isNaN(n) ? 0 : n });
              }} />
          </Form.Group>
          <Form.Group className='mb-3' controlId='price'>
            <Form.Label>Price</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control type="number" min={0} step={.01} value={editingItem.price}
                onChange={(e) => {
                  const n = parseFloat(e.target.value);
                  setEditingItem({ ...editingItem, price: Number.isNaN(n) ? 0 : n });
                }}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className='mb-3' controlId='reorderThreshold'>
            <Form.Label>Reorder threshold (0 to disable)</Form.Label>
            <Form.Control type="number" min={0} value={editingItem.reorderThreshold}
              onChange={(e) => {
                const n = parseInt(e.target.value);
                setEditingItem({ ...editingItem, reorderThreshold: Number.isNaN(n) ? 0 : n });
              }} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" type="submit">Ok</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export function DeleteItemModal({
  show,
  setShow,
  item,
  onAccept,
  onReject
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  item?: Item,
  onAccept?: () => void,
  onReject?: () => void
}) {

  function handleSubmit() {
    if (!item)
      return;
    axios.delete('/api/v1/item', { data: { id: item.id } }).then((res) => {
      setShow(false);
      if (onAccept)
        onAccept();
    }).then((error) => {
      alert('failed to delete item');
      if (onReject)
        onReject();
    });
  }

  if (!item)
    return null;
  return (
    <ConfirmationModal show={show} setShow={setShow} onAccept={handleSubmit}>
      Are you sure you want to delete <b>{item.name}</b>. This action cannot be
      undone and will also delete all history associated with this item.
    </ConfirmationModal>
  );
}
