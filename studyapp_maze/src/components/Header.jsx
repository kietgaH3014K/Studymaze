// src/components/Header.jsx
import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header-wrapper">
      {/* Navbar cố định */}
      <div className="header">
        <div className="header-container">
          <img src="/image/maze-delvin.png" alt="Logo" className="logo" />
          <nav>
            <a href="/">Dashboard</a>
            <a href="/roadmap">Lộ trình</a>
            <a href="/schedule">Lịch học</a>
            <a href="/review">Đánh giá</a>
            <a href="/about">About</a>
            <a href="/chat">Chat</a>
            <a href="/account">Tài khoản</a>
          </nav>
        </div>
      </div>

      {/* Ảnh nền và chữ nằm dưới navbar */}
      <div className="hero-section">
        <img src="/image/nen.jpg" alt="Background" className="hero-background" />
        <div className="hero-content">
          <h1 style={{ fontSize: '64px', margin: 0 }}>STUDY APP</h1>
          <p style={{ fontSize: '24px', marginTop: '10px' }}>
            Hỗ trợ bạn xây dựng lộ trình học tập cá nhân hóa
          </p>
        </div>
      </div>
    </header>
  );
}
