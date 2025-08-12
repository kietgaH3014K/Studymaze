import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Đổi nếu cần

export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/register/`, userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await axios.post(`${API_URL}/login/`, credentials);
  return res.data;
};
