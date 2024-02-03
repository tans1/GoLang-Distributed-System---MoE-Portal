import React from 'react'
import '../styles/navbar.css'
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <div className='logo--container'>
      <Link to="/" className="link">
        <img src="Ministry_of_Education_(Ethiopia).png" alt="" />
        <span>Ministry Of Education</span> 
      </Link>
        
      </div>
      <div className='nav-items'>
        <div className='nav-item'>
            <Link to="/result" className="link">  see result </Link>           
        </div>
        <div className='nav-item'>
            <Link to="/upload" className="link">  upload result</Link>
        </div>
        <div className='nav-item'>
            <Link to="/petition" className="link">  petition</Link>
        </div>
        <div className='nav-item'>
            <Link to="/login" className="link"> login </Link>
        </div>
      </div>
    </nav>
  )
}
