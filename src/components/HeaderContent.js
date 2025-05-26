import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import logo_web from '../picture/logo-1.webp';
import '../styles/HeaderContent.css';

function ContentHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
  };

  const handleSearchChange = (event)=>{
    setSearchTerm(event.target.value);
  }
  
  const handleSearchSubmit=(event)=>{
    if(event.key=== 'Enter'){
      if(searchTerm.trim()!== ''){
        const trimmedSearchTerm= searchTerm.trim();
        navigate(`/admin/search-movies?movieName=${encodeURIComponent(trimmedSearchTerm)}`);
      }
      setSearchTerm('');
    }
  }
  
  return (
    <nav>
      {/* Logo */}
      <div className="logo">
        <Link to="/content/movies/all">
          <img src={logo_web} alt="Logo" className="logo-img" />
        </Link>
      </div>

      {/* Menu chính */}
      <div className="header">
        <ul>
          <li>
            <Link
              to="/content/movies/all"
              className={`nav-link ${location.pathname === '/content/movies/all' ? 'active' : 'inactive'}`}
            >
              Tất cả phim
            </Link>
          </li>
          <li>
            <Link
              to="/content/movies/approved"
              className={`nav-link ${location.pathname === '/content/movies/approved' ? 'active' : 'inactive'}`}
            >
              Đã duyệt
            </Link>
          </li>
          <li>
            <Link
              to="/content/movies/pending"
              className={`nav-link ${location.pathname === '/content/movies/pending' ? 'active' : 'inactive'}`}
            >
              Chờ duyệt
            </Link>
          </li>
        </ul>
      </div>

      {/* Ô tìm kiếm */}
      <div className="search">
        <div className="search-container">
          <input
          placeholder='Tìm kiếm'
          type='text'
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleSearchSubmit}
          />
        </div>
      </div>

      {/* Thông tin người dùng */}
      <div className="user-infor">
        <ul>
          <li>Ban Nội dung</li>
          <li>
            <button
              onClick={handleLogout}
              className="button-logout"
            >
              Đăng Xuất
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default ContentHeader;