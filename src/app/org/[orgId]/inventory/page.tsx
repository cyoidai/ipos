'use client';

import Table from 'react-bootstrap/table';

function InventoryTable() {
  return (
    <Table>
      <thead>
        <th>SKU</th>
        <th>Name</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Reorder threshold</th>
        <th></th>
      </thead>
    </Table>
  );
}

export default function Page() {
  return (
    <main>
      <h1>Inventory</h1>
      <InventoryTable />
    </main>
  );
}
