import Image from "next/image";
import Link from 'next/link';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <header>
        <nav className="navbar bg-primary">
          <div className="container-fluid">
            <Link className="navbar-brand h1 mb-0 text-white" href="/">
              {/* <Image
                className="d-inline-block align-text-top"
                src="next.svg"
                width={24}
                height={24}
                alt="iPOS logo"
              /> */}
              iPOS
            </Link>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
