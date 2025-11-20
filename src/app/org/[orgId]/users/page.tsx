'use server';

import { notFound } from 'next/navigation';
import { OrganizationStruct } from '@/objects';
import UsersTable from './UsersTable';
import { fetchOrg } from '@/database';

export async function Main({
  org
}: {
  org: OrganizationStruct
}) {
  return (
    <main>
      <h1>Users</h1>
      <UsersTable org={org} />
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
  const org: OrganizationStruct | null = await fetchOrg(orgId);
  if (org)
    return (<Main org={org} />);
  return notFound();
}
