'use client';

import Table from 'react-bootstrap/Table';

export default function Page() {
  return (
    <main>
      <h1 className='d-none'>Schedules and shifts</h1>
      <h2>Schedules</h2>
      <h2>Shifts</h2>
      <button className="btn btn-success">Clock in</button>
      <button className="btn btn-danger">Clock out</button>
      <h2>Clock in/out history</h2>
      <Table size='sm'>
        <thead>
          <th>Clock-in time</th>
          <th>Clock-out time</th>
          <th>Shift duration</th>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </main>
  );
}
