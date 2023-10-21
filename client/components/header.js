import Link from "next/link";
import { links } from "../configs/nav-links";

const Header = ({ currentUser }) => {
  const filteredLinks = links
    .filter((link) => (currentUser ? link.authenticated : !link.authenticated))
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light px-4">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{filteredLinks}</ul>
      </div>
    </nav>
  );
};

export default Header;
