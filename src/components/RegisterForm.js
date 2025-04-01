"use client"
import React, { useState } from 'react';
import '../styles/Login.css';
import { Link } from 'react-router-dom';

function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Kiểm tra mật khẩu nhập lại có khớp không
        if (password !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp!');
            return;
        }

        setError('');
        console.log('Họ tên:', name);
        console.log('Email:', email);
        console.log('Mật khẩu:', password);
        // Gửi thông tin đăng ký đến API
    };

    return (
        <div className="container">
            <h2>Đăng Ký</h2>
            <form className="form" onSubmit={handleSubmit}>
                <label>Họ và Tên</label>
                <input 
                    type="text" 
                    placeholder="Nhập họ và tên của bạn" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                />

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

                <label>Xác nhận mật khẩu</label>
                <input 
                    type="password" 
                    placeholder="Nhập lại mật khẩu" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required
                />

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="btn">Đăng Ký</button>
            </form>

            <p>Đã có tài khoản? <Link to={"/login"} className="register-link">Đăng nhập</Link></p>
        </div>
    );
}

export default RegisterForm;
