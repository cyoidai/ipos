import React, { useState, useEffect } from 'react';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Organization } from '@/org';
import { Role, RoleOPS } from '@/role';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

export function CreateRoleModal({
  show,
  setShow,
  org
}: {
  show: boolean,
  setShow: (open: boolean) => void,
  org: Organization
}) {

  const [role, setRole] = useState<Role>({ ...new Role(), orgId: org.id });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    RoleOPS.createRole(role).then((res) => {
      handleClose();
      setRole({ ...new Role(), orgId: org.id });
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
          <Form.Label>Permissions</Form.Label>
          <ListGroup>
            {
              RoleOPS.PermissionList.map((r, i) => {
                if (r.value == RoleOPS.Permission.Root)
                  return null;
                return (
                  <ListGroupItem key={i}>
                    <div className='d-flex' style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      columnGap: '1rem'
                    }}>
                      <div>
                        <b>{r.name}</b><br />
                        <small>{r.description ?? ''}</small>
                      </div>
                      <ButtonGroup>
                        <ToggleButton
                          type="radio" variant="outline-danger" id={`${r.name}-disable`} value={1}
                          checked={(role.permission & r.value) ? false : true}
                          onChange={() => setRole({ ...role, permission: role.permission ^ r.value })}
                        >
                          &nbsp;&nbsp;X&nbsp;&nbsp;
                        </ToggleButton>
                        <ToggleButton
                          type="radio" variant="outline-success" id={`${r.name}-enable`} value={0}
                          checked={(role.permission & r.value) ? true : false}
                          onChange={() => setRole({ ...role, permission: role.permission | r.value })}
                        >
                          &nbsp;&nbsp;Y&nbsp;&nbsp;
                        </ToggleButton>
                      </ButtonGroup>
                    </div>
                  </ListGroupItem>
                );
              })
            }
          </ListGroup>
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
  role?: Role
}) {

  function handleClose() {
    setShow(false);
  }

  function handleAccept() {
    if (!role)
      return;
    RoleOPS.deleteRole(role).then((res) => {
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
  role?: Role
}) {

  const [editRole, setEditRole] = useState(new Role());

  useEffect(() => {
    if (role)
      setEditRole(role);
  }, [role]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    RoleOPS.editRole(editRole!).then((res) => {
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
          <Form.Label>Permissions</Form.Label>
          <ListGroup>
            {
              RoleOPS.PermissionList.map((r, i) => {
                if (r.value == RoleOPS.Permission.Root)
                  return null;
                return (
                  <ListGroupItem key={i}>
                    <div className='d-flex' style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      columnGap: '1rem'
                    }}>
                      <div>
                        <b>{r.name}</b><br/>
                        <small>{r.description}</small>
                      </div>
                      <ButtonGroup>
                        <ToggleButton
                          type="radio" variant="outline-danger" id={`${r.name}-disable`} value={1}
                          checked={(editRole.permission & r.value) ? false : true}
                          onChange={() => setEditRole({ ...editRole, permission: editRole.permission ^ r.value })}
                        >
                          &nbsp;&nbsp;X&nbsp;&nbsp;
                        </ToggleButton>
                        <ToggleButton
                          type="radio" variant="outline-success" id={`${r.name}-enable`}  value={0}
                          checked={(editRole.permission & r.value) ? true : false}
                          onChange={() => setEditRole({ ...editRole, permission: editRole.permission | r.value }) }
                        >
                          &nbsp;&nbsp;Y&nbsp;&nbsp;
                        </ToggleButton>
                      </ButtonGroup>
                    </div>
                  </ListGroupItem>
                );
              })
            }
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" type="submit">Ok</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
