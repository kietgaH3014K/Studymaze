import React from 'react';
import './Account.css';

const AccountPage = () => {
  return (
    <div className="account-page">
      <main className="login-wrapper">
        <div className="login-box">
          {/* Hình minh họa từ public/images */}
          <img src="/images/nen.png" alt="Login Illustration" className="login-image" />
          
          <div className="login-form">
            <h2>TÀI KHOẢN</h2>
            <form>
              <label htmlFor="username">Tên người dùng</label>
              <input type="text" id="username" placeholder="name" />

              <label htmlFor="password">Mật khẩu</label>
              <input type="password" id="password" placeholder="******" />

              <button type="submit">Đăng kí/ Đăng nhập</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
