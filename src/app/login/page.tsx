'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import OrganizationSelect from '@/components/OrganizationSelect';


export default function Page() {
  const router = useRouter();

  const [org, setOrg] = useState(-1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    axios.post('/api/v1/auth', {
      orgId: org,
      username,
      password
    }).then((res) => {
      setPassword('');
      router.push('/org/' + org.toString());
    }).catch((error) => {
      setPassword('');
      alert('login failed');
    });
  }

  return (
    <main className="m-4">
      <Card className="mx-auto" style={{ maxWidth: '512px' }}>
        <Card.Body>
          <h3 className="card-title text-center">iPOS</h3>
          <Form onSubmit={(e) => handleLogin(e)}>
            <Form.Group className="mb-3" controlId='organization'>
              <Form.Label>Organization</Form.Label>
              <OrganizationSelect value={org} onChange={(e) => setOrg(parseInt(e.target.value, 10))} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </Form.Group>
            <div className="d-grid gap-2 mb-3">
              <Button variant='primary' type="submit">Login</Button>
            </div>
          </Form>
          <p>Having trouble signing in? Please contact the organization you are trying to sign into.</p>
        </Card.Body>
      </Card>
    </main>
  );
}
