import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chat.css";

const API_KEY = "SrlxY18iY2rKmZnQ3dtkHZIzVW9tN4dH"; // 🔒 Đổi key khi cần
const ENDPOINT = "https://api.deepinfra.com/v1/openai/chat/completions";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post(
        ENDPOINT,
        {
          model: "meta-llama/Meta-Llama-3-8B-Instruct",
          messages: newMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      const updatedMessages = [...newMessages, { role: "assistant", content: reply }];
      setMessages(updatedMessages);
      
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "❌ Lỗi gửi yêu cầu đến AI." },
      ]);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput("");
  };

  const handleSave = () => {
    const content = messages
      .map((msg) => `${msg.role === "user" ? "Bạn" : "AI"}: ${msg.content}`)
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "lich_su_chat.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">💬 Chat với AI</h2>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.role === "user" ? "user-message" : "ai-message"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Nhập câu hỏi..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="chat-input"
        />
        <button className="chat-button" onClick={handleSend}>📤</button>
        <button className="chat-button danger" onClick={handleClear}>🗑</button>
        <button className="chat-button danger" onClick={handleSave}>💾</button>
      </div>
    </div>
  );
}
