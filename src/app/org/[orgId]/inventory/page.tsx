'use client';

import useFetch from '@/useFetch';
import Table from 'react-bootstrap/table';
import { Item } from '@/structs';
import Button from 'react-bootstrap/Button';
import { use } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { InputGroup } from 'react-bootstrap';
import ConfirmationModal from '@/components/ConfirmationModal';

function CreateItemModal({
  show,
  setShow,
  orgId,
  onAccept,
  onReject
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  orgId: number,
  onAccept?: () => void,
  onReject?: () => void
}) {

  const [item, setItem] = useState<Item>(new Item());

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    axios.post('/api/v1/item', {
      ...item,
      orgId: orgId
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
          <Form.Group className='mb-3' controlId='name'>
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

function EditItemModal({
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
          <Form.Group className='mb-3' controlId='name'>
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
                setEditingItem({ ...item, reorderThreshold: Number.isNaN(n) ? 0 : n });
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

function DeleteItemModal({
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

  const [body, setBody] = useState('');

  useEffect(() => {
    setBody(item ? `Are you sure you want to delete "${item.name}". This action will also delete all history associated with this item. Are you sure?` : '');
  }, [item]);

  function handleSubmit() {
    if (!item)
      return;
    axios.delete('/api/v1/item', { data: { id: item.id } }).then((res) => {
      setShow(false);
      if (onAccept)
        onAccept();
    }).then((error) => {
      if (onReject)
        onReject();
    });
  }

  if (!item)
    return null;
  return (
    <ConfirmationModal show={show} setShow={setShow} body={body} onAccept={handleSubmit} />
  );
}

function InventoryTable({ orgId }: { orgId: number }) {

  const cols = 7;

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState<Item | undefined>(undefined);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState<Item | undefined>(undefined);

  function editItem(item: Item) {
    setEditModalData(item);
    setShowEditModal(true);
  }

  function deleteItem(item: Item) {
    setDeleteModalData(item);
    setShowDeleteModal(true);
  }

  function TableBody() {

    const { data, isLoading, error } = useFetch<Item[]>('/api/v1/item', { orgId });

    if (isLoading) {
      return (
        <tbody>
          <tr>
            <td className='text-center' colSpan={cols}>Loading...</td>
          </tr>
        </tbody>
      );
    }

    if (error) {
      return (
        <tbody>
          <tr>
            <td className='text-center' colSpan={cols}>An error occurred when loading items</td>
          </tr>
        </tbody>
      );
    }

    if (!data || data.length == 0) {
      return (
        <tbody>
          <tr>
            <td className='text-center' colSpan={cols}>No items to show</td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {
          data.map((item, i) => {
            return (
              <tr key={i}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price}</td>
                <td>{item.reorderThreshold}</td>
                <td>{item.description}</td>
                <td className='d-flex gap-1'>
                  {/* <Button variant='primary' size='sm'>Details</Button> */}
                  <Button variant='primary' size='sm' onClick={() => editItem(item)}>Edit</Button>
                  <Button variant='danger' size='sm' onClick={() => deleteItem(item)}>Delete</Button>
                </td>
              </tr>
            );
          })
        }
      </tbody>
    );
  }
  return (
    <div>
      <Form>
        <Form.Group className='mb-3' controlId='query'>
          <Form.Label>Search</Form.Label>
          <Form.Control type='text' placeholder='Search by name or SKU' />
        </Form.Group>
      </Form>
      <Table size='sm' hover>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Reorder threshold</th>
            <th>Description</th>
            <th className='d-flex gap-1'>
              <Button variant='success' size='sm' onClick={() => setShowCreateModal(true)}>Create</Button>
            </th>
          </tr>
        </thead>
        <TableBody />
      </Table>
      <CreateItemModal show={showCreateModal} setShow={setShowCreateModal} orgId={orgId} />
      <EditItemModal show={showEditModal} setShow={setShowEditModal} item={editModalData} />
      <DeleteItemModal show={showDeleteModal} setShow={setShowDeleteModal} item={deleteModalData} />
    </div>
  );
}

export default function Page({
  params
}: {
  params: Promise<{ orgId: string }>
}) {
  const orgId: number = parseInt(use(params).orgId);

  return (
    <main>
      <h1>Inventory</h1>
      <InventoryTable orgId={orgId} />
    </main>
  );
}
