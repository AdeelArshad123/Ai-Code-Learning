import React from 'react';
import { Link } from 'react-scroll';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="landing" smooth={true} duration={500}>
            Home
          </Link>
        </li>
        <li>
          <Link to="authentication" smooth={true} duration={500}>
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
