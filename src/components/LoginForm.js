"use client"
import React, { useState } from 'react';
import '../styles/Login.css';
import { Link } from "react-router-dom";

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can add form validation or API call for login
        console.log('Email:', email);
        console.log('Password:', password);
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
                <a href="#" className="forgot">Quên mật khẩu?</a>
                <button type="submit" className="btn">Đăng Nhập</button>
            </form>

            <p>Chưa có tài khoản? <Link to="/register" className="register-link">Đăng kí</Link></p>
        </div>
    );
}

export default LoginForm;

