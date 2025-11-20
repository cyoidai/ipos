'use client';

import Table from 'react-bootstrap/Table';

export default function ShiftHistoryTable() {
  return (
    <Table size='sm' hover>
      <thead>
        <tr>
          <th>Clock-in time</th>
          <th>Clock-out time</th>
          <th>Shift duration</th>
        </tr>
      </thead>
    </Table>
  );
}
