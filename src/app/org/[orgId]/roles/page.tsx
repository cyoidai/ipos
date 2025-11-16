import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function RolesTable() {
  return (
    <div>
      <Table size='sm' hover>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <h1>Roles</h1>
      <RolesTable />
    </main>
  );
}
