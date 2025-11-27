'use server';

import { Organization } from '@/org';
import { fetchOrg } from '@/database';
import { notFound } from 'next/navigation';
import RoleManager from './RoleManager';

async function Main({
  org
}: {
  org: Organization
}) {
  return (
    <main>
      <h1>Roles</h1>
      <RoleManager org={org} />
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
