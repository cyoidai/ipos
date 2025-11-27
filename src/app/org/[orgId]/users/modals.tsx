'use client';

import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { User, UserOPS } from '@/user';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Organization } from '@/org';
import RoleSelect from '@/components/RoleSelect';

export function CreateUserModal({
  org,
  show,
  setShow,
  onAccept,
  onReject
}: {
  org: Organization,
  show: boolean,
  setShow: (show: boolean) => void,
  onAccept?: () => void,
  onReject?: () => void
}) {

  const [user, setUser] = useState<User>(new User());
  const [password, setPassword] = useState('');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    UserOPS.createUser(user, password).then((res) => {
      setShow(false);
      setUser(new User());
      setPassword('');
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
            <Form.Control type="text" value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} />
          </Form.Group>
          <Form.Group className='mb-3' controlId='lastName'>
            <Form.Label>Last name</Form.Label>
            <Form.Control type="text" value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="text" autoComplete='off' autoCorrect='off' value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="roleId">
            <Form.Label>Role</Form.Label>
            <RoleSelect
              org={org} value={user.roleId ?? -1}
              onChange={(e) => {
                const n = parseInt(e.target.value);
                if (Number.isNaN(n) || n < 0)
                  setUser({ ...user, roleId: null });
                else
                  setUser({ ...user, roleId: n });
              }}
            />
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
  org,
  user,
  onAccept,
  onReject
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  org: Organization,
    user?: User,
  onAccept?: () => void,
  onReject?: () => void
}) {
  const [editUser, setEditUser] = useState<User>(new User());

  useEffect(() => {
    if (user)
      setEditUser(user);
  }, [user]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user)
      return;
    UserOPS.editUser(editUser).then((res) => {
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
            <Form.Control type="text" value={editUser.firstName} onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })} />
          </Form.Group>
          <Form.Group className='mb-3' controlId='lastName'>
            <Form.Label>Last name</Form.Label>
            <Form.Control type="text" value={editUser.lastName} onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={editUser.username} onChange={(e) => setEditUser({ ...editUser, username: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="roleId">
            <Form.Label>Role</Form.Label>
            <RoleSelect
              org={org} value={editUser.roleId ?? -1}
              onChange={(e) => {
                const n = parseInt(e.target.value);
                if (Number.isNaN(n) || n < 0)
                  setEditUser({ ...editUser, roleId: null });
                else
                  setEditUser({ ...editUser, roleId: n });
              }}
            />
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
    UserOPS.deleteUser(user).then((res) => {
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
