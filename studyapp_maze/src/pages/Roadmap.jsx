import React, { useEffect, useState } from "react";
import "./Roadmap.css";

export default function Roadmap() {
  const [progressList, setProgressList] = useState([]);
  const [subject, setSubject] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/progress/")
      .then((res) => res.json())
      .then((data) => {
        setProgressList(data);
        if (data.length > 0) setSubject(data[0].subject || "");
      })
      .catch((err) => console.error("Lỗi tải lộ trình:", err));
  }, []);

  const handleToggleStatus = (item) => {
    const newStatus = item.status === "pending" ? "done" : "pending";

    fetch("http://localhost:8000/api/progress/update/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, status: newStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        setProgressList((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, status: newStatus } : p
          )
        );
      })
      .catch((err) => console.error("Lỗi cập nhật trạng thái:", err));
  };

  const total = progressList.length;
  const done = progressList.filter((p) => p.status === "done").length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <section className="roadmap-hero">
      
      <div className="after-image">
        <h2>Lộ trình học tập của bạn</h2>
        {total === 0 ? (
          <p>Không thể tải tiến độ của bạn!</p>
        ) : (
          <div className="learning-plan-container">
            <h2 className="text-2xl font-bold mb-4">📚 Môn học: {subject}</h2>
            <p2 className="text-right text-gray-500 mb-2">
              Tiến độ hoàn thành: {percent}%
            </p2>

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>

            {progressList
              .sort((a, b) => a.day_number - b.day_number)
              .map((item) => {
                const parts = item.task_title.split("| Link tài liệu:");
                const description = parts[0].trim();
                const link = parts[1]?.trim();

                return (
                  <div key={item.id} className="plan-item">
                    <h3 className="text-lg font-semibold mb-1">🗓️ Ngày {item.day_number}</h3>
                    <p className="text-gray-800 mb-1">{description}</p>
                    {link && (
                      <p className="text-sm text-blue-600 mb-2">
                        📎{" "}
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          {link}
                        </a>
                      </p>
                    )}
                    <button
                      className={`status-button ${
                        item.status === "done" ? "done" : "pending"
                      }`}
                      onClick={() => handleToggleStatus(item)}
                    >
                      {item.status === "done" ? "✅ Đã hoàn thành" : "🕓 Chưa hoàn thành"}
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </section>
  );
}
