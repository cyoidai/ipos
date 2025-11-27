'use client';

import useFetch from '@/useFetch';
import Table from 'react-bootstrap/table';
import { Item } from '@/item';
import { Organization } from '@/org';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { CreateItemModal, EditItemModal, DeleteItemModal } from './modals';

export default function InventoryTable({
  org
}: {
  org: Organization
}) {

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

    const { data, isLoading, error } = useFetch<Item[]>('/api/v1/item', { orgId: org.id });

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
      <CreateItemModal show={showCreateModal} setShow={setShowCreateModal} org={org} />
      <EditItemModal show={showEditModal} setShow={setShowEditModal} item={editModalData} />
      <DeleteItemModal show={showDeleteModal} setShow={setShowDeleteModal} item={deleteModalData} />
    </div>
  );
}
