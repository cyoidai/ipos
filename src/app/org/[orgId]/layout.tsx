import Sidebar from './Sidebar';

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}>) {
  return (
    <div className="d-grid" style={{
      gridTemplateColumns: '200px auto'
    }}>
      <Sidebar />
      <div className="w-auto p-4">
        {children}
      </div>
    </div>
  );
}
