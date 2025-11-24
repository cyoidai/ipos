'use client';

import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside>
      <nav>
        <ListGroup variant='flush'>
          <ListGroupItem><strong>Operations</strong></ListGroupItem>
          <ListGroupItem action active={pathname.match(/\/index/)     ? true : false} href='index'>Home</ListGroupItem>
          <ListGroupItem action active={pathname.match(/\/pos/)       ? true : false} href='pos'>POS</ListGroupItem>
          <ListGroupItem action active={pathname.match(/\/inventory/) ? true : false} href='inventory'>Inventory</ListGroupItem>
          <ListGroupItem action active={pathname.match(/\/schedule/)  ? true : false} href='schedule'>Schedule</ListGroupItem>
          <ListGroupItem action active={pathname.match(/\/shift/)     ? true : false} href='shift'>Shift</ListGroupItem>
          <ListGroupItem><strong>Management</strong></ListGroupItem>
          <ListGroupItem action active={pathname.match(/\/dashboard/) ? true : false} href='dashboard'>Dashboard</ListGroupItem>
          <ListGroupItem action active={pathname.match(/\/orders/)    ? true : false} href='orders'>Order history</ListGroupItem>
          <ListGroupItem action active={pathname.match(/\/reports/)   ? true : false} href='report'>Reports</ListGroupItem>
          <ListGroupItem><strong>Administration</strong></ListGroupItem>
          <ListGroupItem action active={pathname.match(/\/roles/)     ? true : false} href='roles'>Roles</ListGroupItem>
          <ListGroupItem action active={pathname.match(/\/users/)     ? true : false} href='users'>Users</ListGroupItem>
          <ListGroupItem action active={pathname.match(/\/config/)    ? true : false} href='config'>Settings</ListGroupItem>
        </ListGroup>
      </nav>
    </aside>
  );
}
