'use client';

import { useState, useEffect } from 'react';
import useFetch from '@/useFetch';
import { use } from 'react';
import { notFound } from 'next/navigation';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { User } from '@/types';
import ConfirmationModal from '@/components/ConfirmationModal';

function CreateUserModal({
  orgId,
  show,
  setShow,
  onAccept,
  onReject
}: {
  orgId: number,
  show: boolean,
  setShow: (show: boolean) => void,
  onAccept?: () => void,
  onReject?: () => void
}) {

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(-1);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    axios.post('/api/v1/user', {
      orgId, username, firstName, lastName, password,
      roleId: roleId === -1 ? null : roleId
    }).then((res) => {
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

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create user</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <Form.Group className='mb-3' controlId='firstName'>
            <Form.Label>First name</Form.Label>
            <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Form.Group>
          <Form.Group className='mb-3' controlId='lastName'>
            <Form.Label>Last name</Form.Label>
            <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="text" autoComplete='off' autoCorrect='off' value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Select value={roleId} onChange={(e) => setRoleId(parseInt(e.target.value, 10))}>
              <option value={-1}>No role</option>
              {/* TODO: roles */}
            </Form.Select>
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

function EditUserModal({
  show,
  setShow,
  user,
  onAccept,
  onReject
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  user?: User,
  onAccept?: () => void,
  onReject?: () => void
}) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [roleId, setRoleId] = useState(-1);

  useEffect(() => {
    setUsername(user?.username ?? '');
    setFirstName(user?.firstName ?? '');
    setLastName(user?.lastName ?? '');
    setRoleId(user?.roleId ?? -1);
  }, [user]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user)
      return;
    axios.put('/api/v1/user', {
      id: user.id,
      username, firstName, lastName,
      roleId: roleId === -1 ? null : roleId
    }).then((res) => {
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

  if (!user)
    return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create user</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <Form.Group className='mb-3' controlId='firstName'>
            <Form.Label>First name</Form.Label>
            <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Form.Group>
          <Form.Group className='mb-3' controlId='lastName'>
            <Form.Label>Last name</Form.Label>
            <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Select value={roleId} onChange={(e) => setRoleId(parseInt(e.target.value, 10))}>
              <option value={-1}>No role</option>
              {/* TODO: roles */}
            </Form.Select>
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

function DeleteUserModal({
  show,
  setShow,
  user,
  onAccept,
  onReject
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  user?: User,
  onAccept?: () => void,
  onReject?: () => void
}) {

  const [body, setBody] = useState('');

  useEffect(() => {
    setBody(user ? `Are you sure you want to delete ${user.firstName} ${user.lastName} (${user.username}). This action will also delete all history associated with this user. Are you sure?` : '');
  }, [user]);

  function handleSubmit() {
    if (!user)
      return;
    axios.delete('/api/v1/user', { data: { id: user.id } }).then((res) => {
      setShow(false);
      if (onAccept)
        onAccept();
    }).then((error) => {
      if (onReject)
        onReject();
    });
  }

  if (!user)
    return null;
  return (
    <ConfirmationModal show={show} setShow={setShow} body={body} onAccept={handleSubmit} />
  );
}

function UsersTable({
  orgId
}: {
  orgId: number
}) {
  const cols = 4;

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState<User | undefined>(undefined);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState<User | undefined>(undefined);

  function TableBody() {
    const { data, isLoading, error } = useFetch<User[]>('/api/v1/user', { orgId });

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
      <CreateUserModal orgId={orgId} show={showCreateModal} setShow={setShowCreateModal} />
      <EditUserModal show={showEditModal} setShow={setShowEditModal} user={editModalData} />
      <DeleteUserModal show={showDeleteModal} setShow={setShowDeleteModal} user={deleteModalData} />
    </div>
  );
}



export default function Page({
  params
}: {
  params: Promise<{ orgId: string }>
}) {
  const orgId: number = parseInt(use(params).orgId, 10);

  return (
    <main>
      <h1>Users</h1>
      <UsersTable orgId={orgId} />
    </main>
  );
}
