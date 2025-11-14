'use client';

import { useState } from 'react';
import useFetch from '@/useFetch';
import axios from 'axios';
import { redirect } from 'next/navigation';

function OrganizationSelect({ value, onChange }) {
  const { data, isLoading, error } = useFetch('/api/v1/org');

  if (isLoading) {
    return (
      <select
        className="form-select"
        id="organization"
        name="organization"
        value={value}
        onChange={onChange}
      >
        <option value={0}>Loading...</option>
      </select>
    );
  }
  if (error) {
    return (
      <select
        className="form-select"
        id="organization"
        name="organization"
        value={value}
        onChange={onChange}
      >
        <option value={0}>Internal server error</option>
      </select>
    );
  }
  return (
    <select
      className="form-select"
      id="organization"
      name="organization"
      value={value}
      onChange={onChange}
    >
      {
        data.map((org, i) => {
          return (
            <option key={i} value={org.id}>{org.name}</option>
          );
        })
      }
    </select>
  );
}

export default function Page() {

  const [org, setOrg] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    axios.post('/api/v1/auth', {
      username,
      password
    }).then((res) => {
      redirect('/org/' + org);
    }).catch((error) => {
      alert('login failed');
    });
  }

  return (
    <main className="m-4">
      <div className="card mx-auto" style={{ maxWidth: '512px' }}>
        <div className="card-body">
          <h3 className="card-title text-center">iPOS</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="organization">Organization</label>
              <OrganizationSelect value={org} onChange={(e) => setOrg(e.target.value)} />
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
              <button className="btn btn-primary" type="submit">Login</button>
            </div>
          </form>
          <p>Having trouble signing in? Please contact the organization you are trying to sign into.</p>
        </div>
      </div>
    </main>
  );
}
