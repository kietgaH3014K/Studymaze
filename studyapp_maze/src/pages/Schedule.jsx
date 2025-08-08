import React, { useEffect, useMemo, useState } from 'react';
import './Schedule.css';

export default function Schedule() {
  const [scheduleData, setScheduleData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/progress/')
      .then((res) => {
        if (!res.ok) throw new Error('Lỗi khi kết nối tới server');
        return res.json();
      })
      .then((data) => setScheduleData(data))
      .catch((err) => {
        console.error('Lỗi:', err);
        setError('Không thể tải dữ liệu lịch học.');
      });
  }, []);

  const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

  // Nhóm dữ liệu: subject -> week -> [tasks...]
  const grouped = useMemo(() => {
    const g = {};
    for (const item of scheduleData) {
      const subject = item.subject || 'Chưa xác định';
      if (!g[subject]) g[subject] = {};
      if (!g[subject][item.week]) g[subject][item.week] = [];
      g[subject][item.week].push(item);
    }

    // sắp xếp mỗi week theo day_number
    for (const subject of Object.keys(g)) {
      for (const w of Object.keys(g[subject])) {
        g[subject][w].sort((a, b) => a.day_number - b.day_number);
      }
    }
    return g;
  }, [scheduleData]);

  const SubjectSection = ({ subject, weeks }) => {
    // Tìm tuần lớn nhất của môn này
    const maxWeek = Math.max(...Object.keys(weeks).map((n) => Number(n)), 0);

    const renderWeek = (weekNumber) => {
      const weekTasks = weeks[weekNumber] || [];
      return (
        <div className="week-block" key={`${subject}-week-${weekNumber}`}>
          <h3 className="week-title">📚 Tuần {weekNumber}</h3>
          <div className="day-grid">
            {daysOfWeek.map((dayName, idx) => {
              const task = weekTasks.find((t) => ((t.day_number - 1) % 7) === idx);

              // Tách mô tả và link (nếu có) theo định dạng GPT trả về
              let desc = '';
              let link = '';
              if (task && typeof task.task_title === 'string') {
                if (task.task_title.includes(' | Link tài liệu:')) {
                  const [d, l] = task.task_title.split(' | Link tài liệu:');
                  desc = d.trim();
                  link = (l || '').trim();
                } else {
                  desc = task.task_title;
                }
              }

              const isDone = task?.status === 'done';
              const statusClass = isDone ? 'done' : 'pending';
              const statusText = isDone ? '✅ Hoàn thành' : '🕒 Chưa hoàn thành';

              return (
                <div className={`day-card ${statusClass}`} key={`${subject}-${weekNumber}-${idx}`}>
                  <h4>{dayName}</h4>
                  {task ? (
                    <>
                      <p><strong>{task.subject}</strong></p>
                      <p>{desc}</p>
                      {link && (
                        <p>
                          📘 Tài liệu:{' '}
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={link}
                          >
                            {/* rút gọn hiển thị link nếu quá dài */}
                            {link.length > 60 ? `${link.slice(0, 60)}…` : link}
                          </a>
                        </p>
                      )}
                      <span className={`status-tag ${statusClass}`}>{statusText}</span>
                    </>
                  ) : (
                    <p className="no-task">Không có nội dung</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <section className="subject-section" key={`subject-${subject}`}>
        <h2 className="schedule-title">📘 Môn học: {subject}</h2>
        {[...Array(maxWeek)].map((_, i) => renderWeek(i + 1))}
      </section>
    );
  };

  const subjects = Object.keys(grouped).sort();

  return (
    <section className="schedule-wrapper">
      <div className="schedule-container">
        <h2 className="schedule-title">📅 Lịch học tập theo tuần</h2>
        <p style={{ textAlign: 'center', marginBottom: 24 }}>
          Mỗi môn học hiển thị theo tuần và ngày. Trạng thái đồng bộ tự động.
        </p>

        {error ? (
          <p className="error">{error}</p>
        ) : subjects.length === 0 ? (
          <p className="no-task" style={{ textAlign: 'center' }}>
            Chưa có lộ trình. Hãy tạo lộ trình trước.
          </p>
        ) : (
          subjects.map((subj) => (
            <SubjectSection key={subj} subject={subj} weeks={grouped[subj]} />
          ))
        )}
      </div>
    </section>
  );
}
