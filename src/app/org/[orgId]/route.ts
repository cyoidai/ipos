import { redirect } from 'next/navigation';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orgId: string }>}
) {
  const { orgId } = await params;
  redirect(`${orgId}/index`);
}
