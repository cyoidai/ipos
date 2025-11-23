'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import useFetch from '@/useFetch';
import Link from 'next/link';
import ConfirmationModal from '@/components/ConfirmationModal';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Organization } from '@/types';

export function CreateOrganizationModal({
  show,
  setShow,
  onAccept,
  onReject
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  onAccept?: () => void,
  onReject?: () => void
}) {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    axios.post('/api/v1/org', {
      name, description
    }).then((res) => {
      setShow(false);
      setName('');
      setDescription('');
      if (onAccept)
        onAccept();
    }).catch((error) => {
      alert('failed to create organization');
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
        <Modal.Title>Confirm action</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Organization name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="primary">Ok</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function EditOrganizationModal({
  show,
  setShow,
  org,
  onAccept,
  onReject
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  org?: Organization,
  onAccept?: () => void,
  onReject?: () => void
}) {

  const [id, setId] = useState(-1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setId(org?.id ?? -1);
    setName(org?.name ?? '');
    setDescription(org?.description ?? '');
  }, [org]);

  if (!org)
    return null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    axios.put('/api/v1/org', {
      id, name, description
    }).then((res) => {
      setShow(false);
      setName('');
      setDescription('');
      if (onAccept)
        onAccept();
    }).catch((error) => {
      alert('failed to edit organization');
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
        <Modal.Title>Edit organization</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Organization name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
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

function DeleteOrganizationModal({
  show,
  setShow,
  org,
  onAccept,
  onReject
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  org?: Organization,
  onAccept?: () => void,
  onReject?: () => void
}) {

  function handleSubmit() {
    if (!org)
      return;
    axios.delete('/api/v1/org', {
      data: { id: org.id }
    }).then((res) => {
      setShow(false);
      if (onAccept)
        onAccept();
    }).catch((error) => {
      alert('failed to delete organization');
      if (onReject)
        onReject();
    });
  }

  if (!org)
    return null;
  return (
    <ConfirmationModal show={show} setShow={setShow} onAccept={handleSubmit}>
      Are you sure you want to delete <b>{org.name}</b> and all of its data?
      This action cannot be undone.
    </ConfirmationModal>
  );
}

function OrganizationTable() {

  const cols = 3;

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState<Organization | undefined>(undefined);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState<Organization | undefined>(undefined);

  function deleteOrg(org: Organization) {
    setDeleteModalData(org);
    setShowDeleteModal(true);
  }

  function editOrg(org: Organization) {
    setEditModalData(org);
    setShowEditModal(true);
  }

  function TableBody() {
    const { data, isLoading, error } = useFetch<Organization[]>('/api/v1/org');

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
        <tbody><tr><td className="text-center" colSpan={cols}>No organizations found</td></tr></tbody>
      );
    return (
      <tbody>
        {
          data.map((org, i) => {
            return (
              <tr key={i}>
                <td><Link href={'/org/' + org.id}>{org.name}</Link></td>
                <td>{org.description}</td>
                <td className="d-flex gap-1">
                  <Button variant='primary' size='sm' onClick={() => editOrg(org)}>Edit</Button>
                  <Button variant='danger' size='sm' onClick={() => deleteOrg(org)}>Delete</Button>
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
      <Table size='sm' hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th className="d-flex gap-1">
              <Button variant='success' size='sm' onClick={() => setShowCreateModal(true)}>Create</Button>
            </th>
          </tr>
        </thead>
        <TableBody />
      </Table>
      <CreateOrganizationModal show={showCreateModal} setShow={setShowCreateModal} />
      <EditOrganizationModal
        show={showEditModal}
        setShow={setShowEditModal}
        org={editModalData}
      />
      <DeleteOrganizationModal
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        org={deleteModalData}
      />
    </div>
  );
}

export default function Page() {

  return (
    <main className="m-4">
      <h1 className="mb-3">Organizations</h1>
      <OrganizationTable />
    </main>
  );
}
