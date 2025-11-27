'use client';

import React, { useState } from 'react';
import useFetch from '@/useFetch';
import { Organization } from '@/org';
import { Role } from '@/role';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { CreateRoleModal, EditRoleModal, DeleteRoleModal } from './modals';


export default function RoleTable({
  org
}: {
  org: Organization
}) {

  const cols = 3;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState<Role | undefined>(undefined);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState<Role | undefined>(undefined);

  function handleCreate() {
    setShowCreateModal(true);
  }

  function handleEdit(role: Role) {
    setEditModalData(role);
    setShowEditModal(true);
  }

  function handleDelete(role: Role) {
    setDeleteModalData(role);
    setShowDeleteModal(true);
  }

  function TableBody() {
    const { data, isLoading, error } = useFetch<Role[]>('/api/v1/role', { orgId: org.id });
    if (isLoading)
      return (
        <tbody>
          <tr><td className='text-center' colSpan={cols}>Loading...</td></tr>
        </tbody>
      );
    if (error)
      return (
        <tbody>
          <tr><td className='text-center' colSpan={cols}>Something went wrong while trying to load roles</td></tr>
        </tbody>
      );

    if (!data || data.length === 0)
      return (
        <tbody>
          <tr><td className='text-center' colSpan={cols}>No roles to display</td></tr>
        </tbody>
      );

    return (
      <tbody>
        {
          data.map((role, i) => {
            return (
              <tr key={i}>
                <td>{role.name}</td>
                <td>{role.description}</td>
                <td className="d-flex gap-1">
                  <Button variant='primary' size='sm' onClick={() => handleEdit(role)}>Edit</Button>
                  <Button variant='danger' size='sm' onClick={() => handleDelete(role)}>Delete</Button>
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
            <th>Name</th>
            <th>Description</th>
            <th className="d-flex gap-1">
              <Button size='sm' variant='success' onClick={handleCreate}>Create</Button>
            </th>
          </tr>
        </thead>
        <TableBody />
      </Table>
      <CreateRoleModal show={showCreateModal} setShow={setShowCreateModal} org={org} />
      <EditRoleModal show={showEditModal} setShow={setShowEditModal} role={editModalData} />
      <DeleteRoleModal show={showDeleteModal} setShow={setShowDeleteModal} role={deleteModalData} />
    </React.Fragment>
  );
}
