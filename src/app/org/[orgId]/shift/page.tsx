'use server';

import { Organization } from '@/org';
import { fetchOrg } from '@/database';
import { notFound } from 'next/navigation';
import ShiftHistoryTable from './ShiftHistoryTable';
import Clock from './Clock';

async function Main({
  org
}: {
  org: Organization
}) {
  return (
    <main>
      <h1 className='d-none'>Shift management</h1>
      <h2>Manage shift</h2>
      <Clock />
      <h2>Shift history</h2>
      <ShiftHistoryTable />
    </main>
  );
}

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
    return (<Main org={org} />);
  return notFound();
}
