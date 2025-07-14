// src/lib/auth.ts
import axios from "axios";

export const autoLogin = async () => {
  const token = localStorage.getItem("token");
  if (token) return; // đã login rồi

  try {
    const res = await axios.post("http://localhost:3200/auth/login", {
      name: "admin",          // 🔁 thay bằng user hợp lệ của bạn
      password: "123456",     // 🔁 thay bằng pass hợp lệ
    });
    localStorage.setItem("token", res.data.access_token);
    console.log("✅ Tự động login thành công");
  } catch (err) {
    console.error("❌ Login tự động thất bại:", err?.response?.data?.message || err.message);
  }
};
