"use client";
import React, { useState } from 'react';
import '../styles/Login.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/login', {
                email,
                password
            });
            console.log(res.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="container">
            <h2>Đăng Nhập</h2>
            <form className="form" onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Mật khẩu</label>
                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                {/* Thay button bằng span */}
                <span className="link-style" onClick={() => alert('Chức năng khôi phục mật khẩu đang phát triển!')}>
                    Quên mật khẩu?
                </span>
                <button type="submit" className="btn">Đăng Nhập</button>
            </form>
            <p>Chưa có tài khoản? <Link to="/register" className="register-link">Đăng kí</Link></p>
        </div>
    );
}

export default LoginForm;