'use client';
import { useState } from 'react';
import axios from 'axios';

export default function CreateOrganizationModal({
  id,
  onAccept,
  onReject
}: {
  id: string,
  onAccept?: () => void,
  onReject?: () => void
}) {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  function accept(event: React.FormEvent) {
    'use client';
    event.preventDefault();
    axios.post('/api/v1/org', {
      name, description
    }).then((res) => {
      bootstrap.Modal.getInstance(document.getElementById(id)).hide();
      if (onAccept)
        onAccept();
    }).catch((error) => {
      if (onReject)
        onReject();
    });
  }

  return (
    <div className="modal" id={id} tabIndex={-1} aria-labelledby={id + 'Label'} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id={id + 'Label'}>Create organization</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={(e) => accept(e)}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label" htmlFor="name">Organization name</label>
                <input className="form-control" type="text" name="name" id="name" onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="description">Description</label>
                <textarea className="form-control" name="description" id="description" onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" className="btn btn-primary">Ok</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
