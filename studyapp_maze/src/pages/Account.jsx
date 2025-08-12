import React, { useState } from "react";
import { registerUser, loginUser } from "../api/auth";
import './Account.css';

const AccountPage = () => {
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [message, setMessage] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true); // Vẫn cho phép chuyển đổi chế độ

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // 1. Thử đăng nhập trước
      const res = await loginUser({
        username: form.username,
        password: form.password,
      });

      if (res.access) {
        localStorage.setItem("access_token", res.access);
        localStorage.setItem("refresh_token", res.refresh);
        setMessage("Đăng nhập thành công ✅");
      } else {
        setMessage("Sai tài khoản hoặc mật khẩu ❌");
      }
    } catch (errorLogin) {
      // 2. Nếu thất bại, thử đăng ký
      try {
        const res = await registerUser(form);
        if (res.message) {
          setMessage("Đăng ký thành công 🎉. Vui lòng đăng nhập.");
          setIsLoginMode(true); // chuyển sang login
        } else {
          setMessage(res.error || "Lỗi đăng ký");
        }
      } catch (errorRegister) {
        setMessage(
          errorRegister.response?.data?.error ||
          "Không thể đăng ký. Tài khoản có thể đã tồn tại ❌"
        );
      }
    }
  };

  return (
    <div className="account-page">
      <main className="login-wrapper">
        <div className="login-box">
          <img src="/images/nen.png" alt="Login Illustration" className="login-image" />

          <div className="login-form">
            <h2>{isLoginMode ? "Đăng nhập" : "Đăng ký"}</h2>
            <form onSubmit={handleSubmit}>
              <label>Tên người dùng</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />

              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />

              {/* Chỉ hiện email khi đang ở chế độ đăng ký (dù không bắt buộc) */}
              {!isLoginMode && (
                <>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </>
              )}

              <button type="submit">Đăng nhập / Đăng ký</button>
            </form>

            <p style={{ marginTop: "1rem", color: "red" }}>{message}</p>

            <button
              className="toggle-button"
              onClick={() => setIsLoginMode(!isLoginMode)}
            >
              {isLoginMode ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
