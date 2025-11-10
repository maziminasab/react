import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FaUserGraduate, FaLock, FaUserTie } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  const baseUrl = "http://localhost:5000";

  const handleLogin = async () => {
    setError("");
    try {
      const res = await axios.post(`${baseUrl}/login`, { code, password, role });

      if (res.data.user && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);

        if (res.data.user.role === "admin") navigate("/AdminPanel");
        else if (res.data.user.role === "teacher") navigate("/TeacherDashboard");
        else if (res.data.user.role === "parent") navigate("/parent-panel");
        else navigate("/dashboard");

        return;
      }
      setError("ورود ناموفق");
    } catch (err) {
      console.error(err);
      setError("کد یا رمز اشتباه است");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">ورود به سامانه</h2>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <FaUserTie className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="نام کاربری یا کد"
              className="border rounded-lg w-full p-2 pr-10"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="relative">
            <FaLock className="absolute right-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="رمز عبور"
              className="border rounded-lg w-full p-2 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <select
            className="border rounded-lg w-full p-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">دانش‌آموز</option>
            <option value="teacher">معلم</option>
            <option value="parent">والدین</option>
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            ورود
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
