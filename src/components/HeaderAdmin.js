import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react'; 
import '../styles/HeaderAdmin.css';
import logo_web from "../picture/logo-1.webp";

function HeaderAdmin() {
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
    const [searchTerm, setSearchTerm]= useState('');
    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userChanged")); // Gửi sự kiện để cập nhật Header
        navigate("/login"); // Chuyển hướng đến trang đăng nhập
    };
        // Hàm xử lý thay đổi trong ô tìm kiếm
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Hàm xử lý gửi yêu cầu tìm kiếm (ví dụ: khi nhấn Enter)
    const handleSearchSubmit = (event) => {
        if (event.key === 'Enter') {
            if (searchTerm.trim() !== '') {
                navigate(`/admin/search?userName=${encodeURIComponent(searchTerm.trim())}`);
                setSearchTerm('');
            } 
        }
    };

    return (
        <nav>
            <div className="logo">
                <Link to="/">
                    <img src={logo_web} alt="Logo" className="logo-img" />
                </Link>
            </div>
            <div className="header">
                <ul>
                    <li><Link to="/manageuser">QUẢN LÝ TÀI KHOẢN</Link></li>
                    <li><Link to="/managemovie">QUẢN LÝ PHIM</Link></li>  
                </ul>
            </div>
            <div className="search">
                <ul>
                    <li>
                        <input 
                        placeholder="Tìm kiếm" 
                        type="text" 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchSubmit}
                        />
                    </li>
                </ul>
            </div>
            <div className="user-infor">
                <ul>
                    <li>Admin</li>
                    <button onClick={handleLogout} className="button-logout" >
                            Đăng Xuất
                        </button>
                </ul>
            </div>         
        </nav>
    );
}

export default HeaderAdmin;