import { Table } from 'react-bootstrap';
import { Organization } from '@/org';
import useFetch from '@/useFetch';
import OrdersTable from './OrdersTable';
import { notFound } from 'next/navigation';
import { fetchOrg } from '@/database';

export default async function Page({
  params
}: {
  params: Promise<{ orgId: string }>
}) {
  const orgId = parseInt((await params).orgId);
  if (Number.isNaN(orgId))
    return notFound();
  const org: Organization | null = await fetchOrg(orgId);
  if (org)
    return (
      <main>
        <OrdersTable org={org} />
      </main>
    );
  return notFound();
}
