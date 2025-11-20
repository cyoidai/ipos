'use client';

import Button from 'react-bootstrap/Button';

export default function Clock() {
  return (
    <div>
      <p>You are currently clocked-in</p>
      <div>
        <Button size='lg' variant='success'>Clock-in</Button>
        <Button size='lg' variant='danger'>Clock-out</Button>
      </div>
    </div>
  );
}
