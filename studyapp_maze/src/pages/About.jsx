import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>Giới thiệu trang web</h1>
      <p>
        Study App là nền tảng học tập trực tuyến hiện đại, được thiết kế nhằm hỗ trợ học sinh,
        sinh viên và người đi làm nâng cao kiến thức, rèn luyện kỹ năng và chinh phục mục tiêu
        học tập một cách hiệu quả. Với giao diện thân thiện, dễ sử dụng cùng kho tài liệu phong phú,
        Study App mang đến trải nghiệm học tập linh hoạt, cá nhân hóa và phù hợp với mọi trình độ.
      </p>

      <p><strong>Tính năng nổi bật:</strong></p>
      <ul>
        <li>📚 Kho bài học đa dạng: Bao gồm nhiều môn học từ cơ bản đến nâng cao, phù hợp với mọi cấp bậc.</li>
        <li>🧠 Hệ thống luyện tập thông minh: Câu hỏi trắc nghiệm, bài tập tương tác và chấm điểm tự động giúp bạn nắm vững kiến thức.</li>
        <li>⏰ Lộ trình học tập cá nhân hóa: Gợi ý bài học và kế hoạch ôn luyện phù hợp với năng lực và mục tiêu của từng người.</li>
        <li>🏆 Theo dõi tiến độ & đánh giá năng lực: Biểu đồ và báo cáo chi tiết giúp bạn dễ dàng theo dõi sự tiến bộ của mình.</li>
      </ul>

      <p>
        Sứ mệnh của chúng tôi là mang đến một công cụ học tập tin cậy, hiện đại, giúp việc học trở nên dễ dàng,
        hiệu quả và đầy cảm hứng. Dù bạn đang chuẩn bị cho kỳ thi quan trọng, nâng cao kỹ năng chuyên môn,
        hay đơn giản là muốn học hỏi thêm điều mới, Study App luôn đồng hành cùng bạn trên hành trình tri thức.
      </p>
    </div>
  );
}

export default About;
