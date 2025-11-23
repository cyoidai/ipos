import React, { useState, useEffect } from 'react';
import ConfirmationModal from '@/components/ConfirmationModal';
import { OrganizationStruct } from '@/objects';
import { Role, RoleStruct } from '@/role';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export function CreateRoleModal({
  show,
  setShow,
  org
}: {
  show: boolean,
  setShow: (open: boolean) => void,
  org: OrganizationStruct
}) {

  const [role, setRole] = useState<RoleStruct>({ ...new RoleStruct(), orgId: org.id });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    Role.createRole(role).then((res) => {
      handleClose();
      setRole({ ...new RoleStruct(), orgId: org.id });
    }).catch((error) => {
      alert('something went wrong');
    });
  }

  function handleClose() {
    setShow(false);
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create role</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Role name</Form.Label>
            <Form.Control type="text" value={role.name} onChange={(e) => setRole({ ...role, name: e.target.value })} />
          </Form.Group>
          <Form.Group className='mb-3' controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control as='textarea' rows={3} type="text" value={role.description} onChange={(e) => setRole({ ...role, description: e.target.value })} />
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

export function DeleteRoleModal({
  show,
  setShow,
  role
}: {
  show: boolean,
  setShow: (open: boolean) => void,
  role?: RoleStruct
}) {

  function handleClose() {
    setShow(false);
  }

  function handleAccept() {
    if (!role)
      return;
    Role.deleteRole(role).then((res) => {
      handleClose();
    }).catch((error) => {
      alert('failed to delete role');
    });
  }

  if (!role)
    return null;
  return (
    <ConfirmationModal show={show} setShow={setShow} onAccept={handleAccept}>
      Are you sure you want to delete <b>{role.name}</b>. This will cause any
      users with this role to lose their role.
    </ConfirmationModal>
  );
}


export function EditRoleModal({
  show,
  setShow,
  role
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  role?: RoleStruct
}) {

  const [editRole, setEditRole] = useState(new RoleStruct());

  useEffect(() => {
    if (role)
      setEditRole(role);
  }, [role]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    Role.editRole(editRole!).then((res) => {
      handleClose();
    }).catch((error) => {
      alert('failed to edit role');
    });
  }

  function handleClose() {
    setShow(false);
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit role</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Role name</Form.Label>
            <Form.Control
              type="text" value={editRole.name}
              onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea' rows={3} type="text" value={editRole.description}
              onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
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
