import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const username = localStorage.getItem("username") || "bạn";

  const cards = [
    { image: "/image/chatAI.png", title: "Chat với AI", to: "/chat", cta: "Trò chuyện" },
    { image: "/image/danhgia.png", title: "Phiếu đánh giá mục tiêu học tập", to: "/review", cta: "Bắt đầu" },
    { image: "/image/lichhoc.jpg", title: "Tạo lộ trình học tập", to: "/roadmap", cta: "Tạo lộ trình" },
    { image: "/image/plan.jpg", title: "Lịch học", to: "/schedule", cta: "Xem lịch" },
  ];

  return (
    <section className="dashboard">
      {/* Banner chào */}
      <div className="dash-hero">
        <div className="dash-hero__text">
          <h2>Xin chào, <span className="username">{username}</span> ˙✧˖°🎓 ༘⋆｡ ˚ </h2>
          <p> <strong> "Học, học nữa, học mãi" - Lênin. </strong> Mỗi người nên luôn luôn tìm kiếm và tiếp thu kiến thức mới để tạo nên những cơ hội mới cho tương lai của mình. Chúc bạn có một ngày học tập vô cùng hiệu quả. Hãy bắt đầu với các công cụ của Study App bên dưới đây nhé!</p>
        </div>
      </div>

      {/* Lưới card tính năng */}
      <div className="card-grid">
        {cards.map((card, idx) => (
          <Link to={card.to} className="card" key={idx} aria-label={card.title}>
            <div className="card__image">
              <img src={card.image} alt={card.title} />
            </div>
            <div className="card__body">
              <h3 className="card__title">{card.title}</h3>
              <span className="card__cta">{card.cta}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
