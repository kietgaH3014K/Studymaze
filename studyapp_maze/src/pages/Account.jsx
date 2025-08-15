// src/pages/Account.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Account.css";

const api = axios.create({
  baseURL: "/api",                // dùng proxy CRA
  withCredentials: true,          // gửi/nhận cookie session
  headers: { "Content-Type": "application/json" },
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

// Tiện ích đọc cookie khi cần set thủ công
const getCookie = (name) => {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
};

export default function AccountPage({ onAuthSuccess }) {
  const [tab, setTab] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [csrf, setCsrf] = useState(null);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });

  // Lấy CSRF token 1 lần
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/csrf/");
        setCsrf(res.data.csrfToken);
      } catch (e) {
        console.error("Cannot fetch CSRF token:", e);
      }
    })();
  }, []);

  const handleChange = (e, target = "login") => {
    const { name, value } = e.target;
    if (target === "login") {
      setLoginForm((s) => ({ ...s, [name]: value }));
    } else {
      setRegisterForm((s) => ({ ...s, [name]: value }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatusMsg("");
    setLoading(true);
    try {
      const token = csrf ?? getCookie("csrftoken");
      const res = await api.post(
        "/login/",
        { username: loginForm.username, password: loginForm.password },
        token ? { headers: { "X-CSRFToken": token } } : {}
      );

      // Lưu username để Header đọc
      localStorage.setItem("username", res.data.username || loginForm.username);

      // Thông báo cho Header/Tab khác cập nhật ngay
      window.dispatchEvent(new Event("auth-changed"));

      setStatusMsg("✅ Đăng nhập thành công!");
      onAuthSuccess && onAuthSuccess(res.data);
      // Điều hướng nếu muốn:
      window.location.assign("/");
    } catch (err) {
      console.error("Login failed:", err);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "❌ Đăng nhập thất bại.";
      setStatusMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatusMsg("");

    if (registerForm.password !== registerForm.password2) {
      setStatusMsg("⚠️ Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);
    try {
      const token = csrf ?? getCookie("csrftoken");
      await api.post(
        "/register/",
        {
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
          password2: registerForm.password2,
          first_name: registerForm.first_name,
          last_name: registerForm.last_name,
        },
        token ? { headers: { "X-CSRFToken": token } } : {}
      );

      setStatusMsg("🎉 Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      // Xoá trắng form
      setRegisterForm({
        username: "",
        email: "",
        password: "",
        password2: "",
        first_name: "",
        last_name: "",
      });
      setTab("login");
    } catch (err) {
      console.error("Register failed:", err);
      const errors = err?.response?.data;
      const msg = errors
        ? Object.entries(errors)
            .map(([field, v]) => `${field}: ${Array.isArray(v) ? v.join(", ") : v}`)
            .join(" | ")
        : "❌ Đăng ký thất bại.";
      setStatusMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <main className="login-wrapper">
        <div className="login-box">
          <img src="/images/nen.png" alt="Login Illustration" className="login-image" />

          <div className="login-form">
            <h2>TÀI KHOẢN</h2>

            {/* Tabs */}
            <div style={{ marginBottom: 16 }}>
              <button
                className={`tab-btn ${tab === "login" ? "active" : ""}`}
                onClick={() => setTab("login")}
                type="button"
              >
                Đăng nhập
              </button>
              <button
                className={`tab-btn ${tab === "register" ? "active" : ""}`}
                onClick={() => setTab("register")}
                type="button"
                style={{ marginLeft: 10 }}
              >
                Đăng ký
              </button>
            </div>

            {tab === "login" ? (
              <form onSubmit={handleLogin}>
                <label htmlFor="login_username">Tên người dùng</label>
                <input
                  id="login_username"
                  name="username"
                  type="text"
                  placeholder="name"
                  value={loginForm.username}
                  onChange={(e) => handleChange(e, "login")}
                  required
                />

                <label htmlFor="login_password">Mật khẩu</label>
                <input
                  id="login_password"
                  name="password"
                  type="password"
                  placeholder="******"
                  value={loginForm.password}
                  onChange={(e) => handleChange(e, "login")}
                  required
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <label htmlFor="reg_username">Tên người dùng</label>
                <input
                  id="reg_username"
                  name="username"
                  type="text"
                  placeholder="name"
                  value={registerForm.username}
                  onChange={(e) => handleChange(e, "register")}
                  required
                />

                <label htmlFor="reg_email">Email (không bắt buộc)</label>
                <input
                  id="reg_email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={registerForm.email}
                  onChange={(e) => handleChange(e, "register")}
                />

                <label htmlFor="reg_password">Mật khẩu</label>
                <input
                  id="reg_password"
                  name="password"
                  type="password"
                  placeholder="Mật khẩu bao gồm 8 kí tự"
                  value={registerForm.password}
                  onChange={(e) => handleChange(e, "register")}
                  required
                />

                <label htmlFor="reg_password2">Nhập lại mật khẩu</label>
                <input
                  id="reg_password2"
                  name="password2"
                  type="password"
                  placeholder="******"
                  value={registerForm.password2}
                  onChange={(e) => handleChange(e, "register")}
                  required
                />

                <label htmlFor="reg_first">Họ</label>
                <input
                  id="reg_first"
                  name="first_name"
                  type="text"
                  placeholder="Nguyễn"
                  value={registerForm.first_name}
                  onChange={(e) => handleChange(e, "register")}
                />

                <label htmlFor="reg_last">Tên</label>
                <input
                  id="reg_last"
                  name="last_name"
                  type="text"
                  placeholder="An"
                  value={registerForm.last_name}
                  onChange={(e) => handleChange(e, "register")}
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
                </button>
              </form>
            )}

            {statusMsg && <p style={{ marginTop: 12, fontWeight: 600 }}>{statusMsg}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
