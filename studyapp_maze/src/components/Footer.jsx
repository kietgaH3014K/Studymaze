// src/components/Footer.jsx
import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="newsletter">
        <p className="newsletter-title">
         Mọi góp ý của các bạn về chúng tôi xin gửi về biểu mẫu dưới đây
        </p>
        <p className="newsletter-sub">
          Bạn có thể hủy đăng ký bất cứ lúc nào.
        </p>
        <div className="newsletter-form">
          <input type="email" placeholder="Your email" />
          <input type="text" placeholder="Ý kiến của bạn..." />
          <button>Gửi</button>
        </div>
      </div>

      <div className="footer-columns">
        <div className="footer-column">
          <h4>Về chúng tôi</h4>
          <p>Nhà sáng tạo: Ngô Tuấn Kiệt</p>
          <p>Học sinh trường THPT Nguyễn An Ninh</p>
          <p>GVHD: Cô Nguyễn Ngọc Bảo Trân</p>
        </div>
        <div className="footer-column">
          <h4>Liên hệ với chúng tôi</h4>
          <p> Sđt: 0778001899</p>
          <p>Email: ntkiet5102008@gmail.com</p>
          
        </div>
        <div className="footer-column">
          <h4>Phương tiện truyền thông</h4>
          <p>
            <a
              href="https://www.instagram.com/kitvoi.kt/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </p>
          <p>
            <a
              href="https://www.facebook.com/ngo.kiet.458042/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <img src="/image/maze-delvin.png" alt="Logo" />
        <p>Maze Delvin © 2025</p>
      </div>
    </footer>
  );
}
