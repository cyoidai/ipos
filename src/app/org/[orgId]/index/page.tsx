'use server';

;import { fetchOrg } from '@/database';
import { notFound } from "next/navigation";
import { OrganizationStruct } from '@/objects';

async function Main({
  org
}: {
  org: OrganizationStruct
}) {
  return (
    <main>
      <h1>Welcome to {org.name}</h1>
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
