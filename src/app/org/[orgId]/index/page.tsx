
export default async function Page({
  params
}: {
  params: Promise<{ orgId: string }>
}) {
  const { orgId } = await params;
  return (
    <main>
      <h1>Organization: {orgId}</h1>
    </main>
  );
}
