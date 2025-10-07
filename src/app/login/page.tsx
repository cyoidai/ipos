'use client'

import { useState } from 'react';

export default function Page() {

  const [organization, setOrganization] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="m-4">
      <div className="card mx-auto" style={{ maxWidth: '512px' }}>
        <div className="card-body">
          <h3 className="card-title text-center">iPOS</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="organization">Organization</label>
              <select
                className="form-select"
                id="organization"
                name="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              >
                <option value={1}>Organization 1</option>
                <option value={2}>Organization 2</option>
                <option value={3}>Organization 3</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="username">Username</label>
              <input
                className="form-control"
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-grid gap-2 mb-3">
              <button className="btn btn-primary" type="button">Login</button>
            </div>
          </form>
          <p>Having trouble signing in? Please contact the organization you are trying to sign into.</p>
        </div>
      </div>
    </main>
  );
}
