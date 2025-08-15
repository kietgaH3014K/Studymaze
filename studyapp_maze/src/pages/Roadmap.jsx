import React, { useEffect, useState, useMemo } from "react";
import "./Roadmap.css";

export default function Roadmap() {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/progress/")
      .then((res) => res.json())
      .then((data) => {
        setProgressList(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải lộ trình:", err);
        setLoading(false);
      });
  }, []);

  const toggleStatus = (item) => {
    const newStatus = item.status === "done" ? "pending" : "done";
    fetch("http://localhost:8000/api/progress/update/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, status: newStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        setProgressList((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: newStatus } : p))
        );
      })
      .catch((err) => console.error("Lỗi cập nhật trạng thái:", err));
  };

  // --- Nhóm dữ liệu theo môn học ---
  const bySubject = useMemo(() => {
    const map = new Map();
    for (const i of progressList) {
      const s = i.subject || "Khác";
      if (!map.has(s)) map.set(s, []);
      map.get(s).push(i);
    }
    return map;
  }, [progressList]);

  const orderedSubjects = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const item of progressList) {
      const s = item.subject || "Khác";
      if (!seen.has(s)) {
        seen.add(s);
        list.push(s);
      }
    }
    return list; // không cắt bớt, hiển thị theo đúng thứ tự tạo
  }, [progressList]);

  const renderSubjectColumn = (subjectName) => {
    const items = (bySubject.get(subjectName) || []).slice().sort((a, b) => {
      // sắp theo tuần/ngày cho dễ theo dõi
      if (a.week !== b.week) return a.week - b.week;
      return a.day_number - b.day_number;
    });

    // Tính % cho riêng từng môn
    const total = items.length;
    const done = items.filter((p) => p.status === "done").length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
      <div className="subject-column" key={subjectName}>
        <h2 className="subject-title">📚 Môn học: {subjectName}</h2>

        <p className="subject-progress-text">Tiến độ hoàn thành: {percent}%</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>

        {items.map((item) => {
          const [desc, rawLink] = item.task_title.split("Link tài liệu:");
          const description = (desc || "").replace(/\|\s*$/g, "").trim();
          const link = rawLink ? rawLink.trim() : "";

          return (
            <div key={item.id} className="plan-item">
              <h3 className="plan-day">🗓️ Ngày {item.day_number}</h3>
              <p className="plan-desc">{description}</p>
              {link && (
                <p className="plan-link">
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
                onClick={() => toggleStatus(item)}
              >
                {item.status === "done" ? "✅ Đã hoàn thành" : "🕓 Chưa hoàn thành"}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="roadmap-hero">
      <div className="after-image">
        <h2> 📈 Lộ trình học tập của bạn</h2>

        {loading ? (
          <p>⏳ Đang tải dữ liệu...</p>
        ) : progressList.length === 0 ? (
          <p>📭 Chưa có lộ trình nào.</p>
        ) : (
          <div className="subjects-grid">
            {orderedSubjects.map((s) => renderSubjectColumn(s))}
          </div>
        )}
      </div>
    </section>
  );
}
