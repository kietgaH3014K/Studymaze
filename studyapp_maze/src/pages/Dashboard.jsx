import React from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const cards = [
    { image: "/image/chatAI.png", title: "Chat với AI" },
    { image: "/image/danhgia.jpg", title: "Phiếu đánh giá học tập" },
    { image: "/image/lichhoc.jpg", title: "lịch học" },
  ];

  return (
    <section className="dashboard-hero">
      <div className="after-image">
        <h2>Dashboard - Tổng quan</h2>
        <p>Chào mừng bạn đến với ứng dụng StudyApp!</p>
      </div>

      <div className="card-container">
        {cards.map((card, index) => (
          <div className="card-frame" key={index}>
            <img src={card.image} alt={card.title} />
            <p className="card-title">{card.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

