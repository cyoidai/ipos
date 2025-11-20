import Link from 'next/link';

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}>) {
  return (
    <div className="d-grid gap-3 my-3 mx-3" style={{
      gridTemplateColumns: '200px auto'
    }}>
      <aside>
        <nav>
          <section className="mb-2">
            <div><span className="h6">Main</span></div>
            <ul className="list-unstyled my-1">
              <li><Link href="index">Home</Link></li>
              <li><Link href="pos">POS</Link></li>
              <li><Link href="shift">Shifts</Link></li>
              <li><Link href="inventory">Inventory</Link></li>
              <li><Link href="schedule">Schedules</Link></li>
            </ul>
          </section>
          <section className="mb-2">
            <div><span className="h6">Administration</span></div>
            <ul className="list-unstyled my-1">
              <li className="nav-item"><Link href="users">Users</Link></li>
              <li className="nav-item"><Link href="roles">Roles</Link></li>
            </ul>
          </section>
        </nav>
      </aside>
      <div className="w-auto">
        {children}
      </div>
    </div>
  );
}
