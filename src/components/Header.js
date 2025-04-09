"use client";
import React from "react";
import '../styles/Header.css';
import { Link } from "react-router-dom";
import logo_web from '../picture/logo-1.webp';

function Header() {
  return (
    <nav>
      <div className="Logo">
        <Link to="/">
          <img src={logo_web} alt="Logo" className="logo-img" />
        </Link>
      </div>
      <div className="Header">
        <ul>
          <li>
            <Link to="/">TRANG CHỦ</Link>
          </li>
          <li className="dropdown">
            <Link to="/dang-anime" className="dropdown-toggle">
              DẠNG ANIME
            </Link>
            <ul className="dropdown-menu">
              <li>
                <Link to="/dang-anime/phim-1">Phim 1</Link>
              </li>
              <li>
                <Link to="/dang-anime/phim-2">Phim 2</Link>
              </li>
              <li>
                <Link to="/dang-anime/phim-3">Phim 3</Link>
              </li>
            </ul>
          </li>
          <li className="dropdown">
            <Link to="/the-loai" className="dropdown-toggle">
              THỂ LOẠI
            </Link>
            <ul className="dropdown-menu">
              <li>
                <Link to="/the-loai/hanh-dong">Hành Động</Link>
              </li>
              <li>
                <Link to="/the-loai/tinh-cam">Tình Cảm</Link>
              </li>
              <li>
                <Link to="/the-loai/vien-tuong">Viễn Tưởng</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="Search">
        <ul>
          <li>
            <input placeholder="Tìm kiếm" type="text" />
          </li>
          <li>
            <Link to="/login" className="Login">
              Đăng Nhập
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;