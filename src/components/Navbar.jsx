import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const Navbar = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleNavbar = () => {
    setExpanded(!expanded);
  };

  const navbarStyles = {
    background: 'linear-gradient(to left, #333, #000)',
    height: expanded ? '201px' : '60px',
    transition: 'width 0.3s ease',
    width: '100%',
  };

  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-light" style={navbarStyles}>
      <div className="container-fluid" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <a className="navbar-brand text-white" href="/">Super AI</a>
      </div>
    </nav>
  );
}

export default Navbar;
