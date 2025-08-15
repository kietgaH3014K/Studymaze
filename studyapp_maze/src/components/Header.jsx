import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const location = useLocation();

  // Đồng bộ username khi tab khác login/logout hoặc khi AccountPage phát sự kiện
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "username") setUsername(e.newValue || "");
    };
    const onAuthChanged = () => setUsername(localStorage.getItem("username") || "");
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-changed", onAuthChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      // Nếu bạn đã có endpoint /api/logout/ thì mở comment dưới:
      // await fetch("/api/logout/", { method: "POST", credentials: "include" });
    } catch (_) {
      // bỏ qua
    } finally {
      localStorage.removeItem("username");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.dispatchEvent(new Event("auth-changed"));
      window.location.href = "/"; // quay về trang chủ
    }
  }, []);

  return (
    <header className="header-wrapper">
      {/* Navbar cố định */}
      <div className="header">
        <div className="header-container">
          {/* Logo bên trái */}
          <img src="/image/maze-delvin.png" alt="Logo" className="logo" />

          {/* Menu chính */}
          <nav className="nav-links">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Dashboard</Link>
            <Link to="/roadmap" className={location.pathname === "/roadmap" ? "active" : ""}>Lộ trình</Link>
            <Link to="/schedule" className={location.pathname === "/schedule" ? "active" : ""}>Lịch học</Link>
            <Link to="/review" className={location.pathname === "/review" ? "active" : ""}>Đánh giá</Link>
            <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
            <Link to="/chat" className={location.pathname === "/chat" ? "active" : ""}>Chat</Link>
          </nav>

          {/* User info bên phải */}
          <div className="user-section">
            {username ? (
              <>
                <span className="username">Xin chào, {username}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <nav className="nav-links">
              <Link to="/account" className={location.pathname === "/account" ? "active" : ""}>
                Tài khoản
              </Link>
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="hero-section">
        <img src="/image/nen.jpg" alt="Background" className="hero-background" />
        <div className="hero-content">
          <h1 style={{ fontSize: "64px", margin: 0 }}>STUDY APP</h1>
          <p style={{ fontSize: "24px", marginTop: "10px" }}>
            Hỗ trợ bạn xây dựng lộ trình học tập cá nhân hóa
          </p>
        </div>
      </div>
    </header>
  );
}
