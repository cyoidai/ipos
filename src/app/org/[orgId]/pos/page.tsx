import POS from './POS';
import { Organization } from '@/org';
import { fetchOrg } from '@/database';
import { notFound } from 'next/navigation';

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
      <main style={{
        width: '100%',
        height: '100%'
      }}>
        <POS org={org} />
      </main>
    );
  return notFound();
}
