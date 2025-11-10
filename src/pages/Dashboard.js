import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaBookOpen, FaClipboardList, FaClock, FaTasks } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    if (user?.student_code) {
      axios
        .get(`http://localhost:5000/student/${user.student_code}/full`)
        .then((res) => setStudent(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  if (!student) return <div className="text-center mt-20 text-gray-600">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          پنل کاربری دانش‌آموز
        </h2>

        <div className="flex flex-col items-center mb-6">
          <img
            src={
              imageError || !student.profile_picture
                ? "http://localhost:5000/uploads/profile.jpg"
                : `${student.profile_picture}`
            }
            onError={() => setImageError(true)}
            alt="profile"
            className="w-28 h-28 rounded-full border-4 border-purple-400 shadow-md"
          />
          <h3 className="text-xl font-semibold mt-3">
            {student.first_name} {student.last_name}
          </h3>
          <p className="text-gray-600">
            پایه: {student.grade} | رشته: {student.major}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/edit-profile")}
            className="flex flex-col items-center bg-purple-500 text-white p-4 rounded-xl hover:bg-purple-600 transition"
          >
            <FaEdit size={24} />
            <span className="mt-2 text-sm">ویرایش پروفایل</span>
          </button>

          <button
            onClick={() => navigate("/schedule")}
            className="flex flex-col items-center bg-blue-500 text-white p-4 rounded-xl hover:bg-blue-600 transition"
          >
            <FaClock size={24} />
            <span className="mt-2 text-sm">برنامه هفتگی</span>
          </button>

          <button
            onClick={() => navigate("/grades")}
            className="flex flex-col items-center bg-green-500 text-white p-4 rounded-xl hover:bg-green-600 transition"
          >
            <FaClipboardList size={24} />
            <span className="mt-2 text-sm">نمرات</span>
          </button>

          <button
            onClick={() => navigate("/homework")}
            className="flex flex-col items-center bg-orange-500 text-white p-4 rounded-xl hover:bg-orange-600 transition"
          >
            <FaTasks size={24} />
            <span className="mt-2 text-sm">تکالیف</span>
          </button>

          <button
            onClick={() => navigate("/Attendance")}
            className="flex flex-col items-center bg-orange-500 text-white p-4 rounded-xl hover:bg-orange-600 transition"
          >
            <FaBookOpen size={24} />
            <span className="mt-2 text-sm">حضور غیاب</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

