'use client';

import { useState } from 'react';
import useFetch from '@/useFetch';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { User } from '@/user';
import { CreateUserModal, EditUserModal, DeleteUserModal } from './modals';
import { Organization } from '@/org';

export default function UsersTable({
  org
}: {
  org: Organization
}) {
  const cols = 4;

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState<User | undefined>(undefined);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState<User | undefined>(undefined);

  function TableBody() {
    const { data, isLoading, error } = useFetch<User[]>('/api/v1/user', { orgId: org.id });

    if (isLoading)
      return (
        <tbody><tr><td className="text-center" colSpan={cols}>Loading...</td></tr></tbody>
      );
    if (error)
      return (
        <tbody><tr><td className="text-center" colSpan={cols}>Internal server error</td></tr></tbody>
      );
    if (!data || data.length === 0)
      return (
        <tbody><tr><td className="text-center" colSpan={cols}>No users found</td></tr></tbody>
      );
    return (
      <tbody>
        {
          data.map((user, i) => {
            return (
              <tr key={i}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.username}</td>
                <td>{user.roleName ? user.roleName : 'N/A'}</td>
                <td className="d-flex gap-1">
                  <Button variant='primary' size='sm' onClick={() => editUser(user)}>Edit</Button>
                  <Button variant='danger' size='sm' onClick={() => deleteUser(user)}>Delete</Button>
                </td>
              </tr>
            );
          })
        }
      </tbody>
    );
  }

  function editUser(user: User) {
    setEditModalData(user);
    setShowEditModal(true);
  }

  function deleteUser(user: User) {
    setDeleteModalData(user);
    setShowDeleteModal(true);
  }

  return (
    <div>
      <Table size="sm" hover>
        <thead>
          <tr>
            <th>Full name</th>
            <th>Username</th>
            <th>Role</th>
            <th className="d-flex gap-1">
              <Button variant='success' size='sm' onClick={() => setShowCreateModal(true)}>Create</Button>
            </th>
          </tr>
        </thead>
        <TableBody />
      </Table>
      <CreateUserModal org={org} show={showCreateModal} setShow={setShowCreateModal} />
      <EditUserModal show={showEditModal} setShow={setShowEditModal} org={org} user={editModalData} />
      <DeleteUserModal show={showDeleteModal} setShow={setShowDeleteModal} user={deleteModalData} />
    </div>
  );
}
