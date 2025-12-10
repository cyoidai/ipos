'use client';

import Image from "next/image";
import Sidebar from './Sidebar';
import { useState } from 'react';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from "react-bootstrap/NavDropdown";

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();

  return (
    // <React.Fragment>
    //   <header>
    //     <nav className="navbar bg-primary">
    //       <div className="container-fluid">
    //         <Button>
    //           <i className="bi bi-list"></i>
    //         </Button>
    //         <Link className="navbar-brand h1 mb-0 text-white" href="/">
    //           {/* <Image
    //             className="d-inline-block align-text-top"
    //             src="next.svg"
    //             width={24}
    //             height={24}
    //             alt="iPOS logo"
    //           /> */}
    //           iPOS
    //         </Link>
    //       </div>
    //     </nav>
    //   </header>
    //   {children}
    // </React.Fragment>
    <React.Fragment>
      <header className="shadow-sm">
        <Navbar expand="lg">
          <Container>
            <Navbar.Brand href="/"><b>iPOS</b></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              {
                pathname.match(/^\/org\/\d+/) ?
                <Nav className="me-auto">
                  <Nav.Link href="index">Home</Nav.Link>
                  <Nav.Link href="pos">POS</Nav.Link>
                  <Nav.Link href="inventory">Inventory</Nav.Link>
                  <Nav.Link href="schedule">Schedule</Nav.Link>
                  <Nav.Link href="shift">Shift</Nav.Link>
                  <NavDropdown title="Management" id="basic-nav-dropdown">
                    <NavDropdown.Item href="dashboard">Dashboard</NavDropdown.Item>
                    <NavDropdown.Item href="orders">Order history</NavDropdown.Item>
                    {/* <NavDropdown.Item href="reports">Reports</NavDropdown.Item> */}
                  </NavDropdown>
                  <NavDropdown title="Administration" id="basic-nav-dropdown">
                    <NavDropdown.Item href="roles">Roles</NavDropdown.Item>
                    <NavDropdown.Item href="users">Users</NavDropdown.Item>
                    {/* <NavDropdown.Item href="config">Settings</NavDropdown.Item> */}
                  </NavDropdown>
                </Nav> : null
              }
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'fit-content(150px) 1fr'
      }}>
        <Sidebar hidden={!pathname.match(/\org\/\d+/) || pathname.match(/\/org\/\d+\/pos/) ? true : false} />
        <div className={`w-auto ${pathname.match(/\/org\/\d+\/pos/) ? '' : 'm-4'}`}>
          {children}
        </div>
      </div>
      <footer className='d-flex'></footer>
    </React.Fragment>
  );
}
