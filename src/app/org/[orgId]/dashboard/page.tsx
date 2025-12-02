'use server';

import { fetchOrg } from '@/database';
import { notFound } from "next/navigation";
import { Organization } from '@/org';
import Dashboard from './Dashboard';

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
    return (<Dashboard org={org} />);
  return notFound();
}
