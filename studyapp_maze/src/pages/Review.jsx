// src/pages/Review.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Review.css';

export default function Review() {
  const [formData, setFormData] = useState({
    class_level: '',
    subject: '',
    study_time: '',
    goal: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!formData.class_level || !formData.subject || !formData.study_time || !formData.goal) {
      setMsg('⚠️ Vui lòng điền đầy đủ thông tin.');
      return;
    }
    try {
      setLoading(true);

      // Nếu bạn KHÔNG exempt CSRF, bật 2 dòng dưới và thêm CSRF vào headers
      // axios.defaults.withCredentials = true;
      // const csrftoken = document.cookie.split('csrftoken=')?.[1]?.split(';')?.[0];

      const res = await axios.post(
        'http://127.0.0.1:8000/api/generate-learning-path/',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            // 'X-CSRFToken': csrftoken, // chỉ cần khi không @csrf_exempt
          },
        }
      );

      console.log('✅ Tạo lộ trình:', res.data);
      setMsg('✅ Gửi đánh giá & tạo lộ trình thành công!');
      // Reset
      setFormData({ class_level: '', subject: '', study_time: '', goal: '' });
    } catch (error) {
      console.error('❌ Lỗi khi gửi:', error);
      const serverMsg =
        error?.response?.data?.error ||
        error?.response?.data?.details ||
        'Gửi thất bại. Vui lòng thử lại.';
      setMsg(`❌ ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-container">
      <h2>ĐÁNH GIÁ TRÌNH ĐỘ HỌC TẬP</h2>

      <form onSubmit={handleSubmit} className="review-form">
        <label>Bạn đang ở lớp mấy?</label>
        <select
          name="class_level"
          value={formData.class_level}
          onChange={handleChange}
        >
          <option value="">--Chọn lớp--</option>
          <option value="10">Lớp 10</option>
          <option value="11">Lớp 11</option>
          <option value="12">Lớp 12</option>
        </select>

        <label>Bạn muốn cải thiện môn nào?</label>
        <input
          type="text"
          name="subject"
          placeholder="Ví dụ: Tin học, Toán…"
          value={formData.subject}
          onChange={handleChange}
        />

        <label>Thời gian học mỗi ngày</label>
        <select
          name="study_time"
          value={formData.study_time}
          onChange={handleChange}
        >
          <option value="">--Chọn thời gian--</option>
          <option value="1 giờ">1 giờ</option>
          <option value="2 giờ">2 giờ</option>
          <option value="3 giờ">3 giờ</option>
        </select>

        <label>Mô tả mục tiêu học tập</label>
        <textarea
          name="goal"
          placeholder="Ví dụ: Thi đậu ĐH, nâng cao kỹ năng…"
          value={formData.goal}
          onChange={handleChange}
          rows={4}
        />

        <button type="submit" disabled={loading}>
          {loading ? '⏳ Đang tạo lộ trình…' : '🚀 Gửi đánh giá & Tạo lộ trình'}
        </button>
      </form>

      {msg && <p className="status-msg">{msg}</p>}
    </div>
  );
}
