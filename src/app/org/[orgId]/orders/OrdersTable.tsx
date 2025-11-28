'use client';

import { Table } from 'react-bootstrap';
import { Organization } from '@/org';
import useFetch from '@/useFetch';
import Button from 'react-bootstrap/Button';
import { Order } from '@/order';

export default function OrdersTable({
  org
}: {
    org: Organization
}) {

  const cols = 5;
  function TableBody() {
    const { data, isLoading, error } = useFetch<Order[]>('/api/v1/order', { orgId: org.id });

    if (isLoading)
      return (
        <tbody>
          <tr><td className='text-center' colSpan={cols}>Loading...</td></tr>
        </tbody>
      );

    if (error)
      return (
        <tbody>
          <tr><td className='text-center' colSpan={cols}>An error occurred when loading items</td></tr>
        </tbody>
      );

    if (!data || data.length == 0)
      return (
        <tbody>
          <tr><td className='text-center' colSpan={cols}>No items to show</td></tr>
        </tbody>
      );

    return (
      <tbody>
        <td className="d-flex gap-1">
          <Button size='sm' variant='primary'>Details</Button>
        </td>
      </tbody>
    );
  }
  return (
    <Table size='sm' hover>
      <thead>
        <tr>
          <th>Time</th>
          <th>Transaction ID</th>
          <th>Authorized by</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <TableBody />
    </Table>
  );
}
