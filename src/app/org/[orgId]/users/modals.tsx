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
import { OrganizationStruct } from '@/objects';

export function CreateUserModal({
  org,
  show,
  setShow,
  onAccept,
  onReject
}: {
  org: OrganizationStruct,
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
      orgId: org.id, username, firstName, lastName, password,
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

export function EditUserModal({
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

export function DeleteUserModal({
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

  function handleSubmit() {
    if (!user)
      return;
    axios.delete('/api/v1/user', { data: { id: user.id } }).then((res) => {
      setShow(false);
      if (onAccept)
        onAccept();
    }).then((error) => {
      alert('failed to delete user');
      if (onReject)
        onReject();
    });
  }

  if (!user)
    return null;
  return (
    <ConfirmationModal show={show} setShow={setShow} onAccept={handleSubmit}>
      Are you sure you want to delete <b>{user.firstName} {user.lastName}</b> (<b>{user.username}</b>). This action will also delete all history associated with this user.
    </ConfirmationModal>
  );
}
