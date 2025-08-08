import React, { useState } from "react";
import { registerUser, loginUser } from "../api/auth";

const AccountPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLoginMode) {
        const res = await loginUser({
          username: form.username,
          password: form.password,
        });

        if (res.access) {
          localStorage.setItem("access_token", res.access);
          setMessage("Đăng nhập thành công ✅");
        } else {
          setMessage("Sai tài khoản hoặc mật khẩu ❌");
        }
      } else {
        const res = await registerUser(form);
        if (res.message) {
          setMessage("Đăng ký thành công 🎉");
          setIsLoginMode(true); // chuyển sang login
        } else {
          setMessage(res.error || "Lỗi đăng ký");
        }
      }
    } catch (error) {
      setMessage("Lỗi kết nối server");
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

              <button type="submit">{isLoginMode ? "Đăng nhập" : "Đăng ký"}</button>
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
