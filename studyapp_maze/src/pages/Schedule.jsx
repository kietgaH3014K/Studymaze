import React, { useEffect, useState } from 'react';
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
      .then((data) => {
        setScheduleData(data);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        setError('Không thể tải dữ liệu lịch học.');
      });
  }, []);

  const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

  const renderWeek = (weekNumber) => {
    const weekTasks = scheduleData.filter((item) => item.week === weekNumber);
    return (
      <div className="week-block" key={`week-${weekNumber}`}>
        <h3 className="week-title">📚 Tuần {weekNumber}</h3>
        <div className="day-grid">
          {daysOfWeek.map((dayName, idx) => {
            const task = weekTasks.find((t) => ((t.day_number - 1) % 7) === idx);
            return (
              <div className={`day-card ${task?.status === 'done' ? 'done' : ''}`} key={`${weekNumber}-${idx}`}>
                <h4>{dayName}</h4>
                {task ? (
                  <>
                    <p><strong>{task.subject}</strong></p>
                    <p>{task.task_title.split('|')[0]}</p>
                    {task.task_title.includes('Link tài liệu') && (
                      <p>
                        📘 Tài liệu:{" "}
                        <a
                          href={task.task_title.split('Link tài liệu:')[1].trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {task.task_title.split('Link tài liệu:')[1].trim()}
                        </a>
                      </p>
                    )}
                    <span className={`status-tag ${task.status}`}>
                      {task.status === 'done' ? '✅ Hoàn thành' : '🕒 Chưa hoàn thành'}
                    </span>
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

  const maxWeek = Math.max(...scheduleData.map((item) => item.week), 0);

  return (
    <section className="schedule-wrapper">
      

      <div className="schedule-container">
        <h2 className="schedule-title">📅 Lịch học tập theo tuần</h2>
        <p style={{ textAlign: 'center', marginBottom: '30px' }}>
          Quản lý học, đồng bộ với Google Calendar
        </p>

        {error ? (
          <p className="error">{error}</p>
        ) : (
          [...Array(maxWeek)].map((_, i) => renderWeek(i + 1))
        )}
      </div>
    </section>
  );
}
