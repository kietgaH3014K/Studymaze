import React, { useState } from 'react';
import axios from 'axios';
import './Review.css';

function Review() {
  const [formData, setFormData] = useState({
    grade: '',
    subjects: '',
    study_time: '',
    goal: ''
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/admin/api/progresslog/', formData);
      alert("Gửi đánh giá thành công!");
      setFormData({ grade: '', subjects: '', study_time: '', goal: '' });
    } catch (error) {
      console.error("Lỗi khi gửi:", error);
      alert("Gửi thất bại");
    }
  };

  return (
    <div className="review-container">
      <h2>ĐÁNH GIÁ TRÌNH ĐỘ HỌC TẬP</h2>

      <label>Bạn đang ở lớp mấy?</label>
      <select name="grade" value={formData.grade} onChange={handleChange}>
        <option value="">--Chọn lớp--</option>
        <option>Lớp 10</option>
        <option>Lớp 11</option>
        <option>Lớp 12</option>
      </select>

      <label>Bạn muốn cải thiện môn nào?</label>
      <input
        type="text"
        name="subjects"
        placeholder="Ví dụ: Toán, Vật lý,..."
        value={formData.subjects}
        onChange={handleChange}
      />

      <label>Thời gian học mỗi ngày</label>
      <select name="study_time" value={formData.study_time} onChange={handleChange}>
        <option value="">--Chọn thời gian--</option>
        <option>1 giờ</option>
        <option>2 giờ</option>
        <option>3 giờ</option>
      </select>

      <label>Mô tả mục tiêu học tập</label>
      <textarea
        name="goal"
        placeholder="Ví dụ: Thi đậu đại học, nâng cao kỹ năng..."
        value={formData.goal}
        onChange={handleChange}
      ></textarea>

      <button onClick={handleSubmit}>Gửi đánh giá & Tạo lộ trình</button>
    </div>
  );
}

export default Review;
