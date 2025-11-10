import React from "react";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Schedule = () => {
  const navigate = useNavigate();

  const schedule = [
    { day: "شنبه", lessons: ["ریاضی", "زیست", "شیمی"] },
    { day: "یکشنبه", lessons: ["فیزیک", "فارسی", "ورزش"] },
    { day: "دوشنبه", lessons: ["زبان انگلیسی", "زمین‌شناسی", "دینی"] },
    { day: "سه‌شنبه", lessons: ["ریاضی", "شیمی", "تجربی"] },
    { day: "چهارشنبه", lessons: ["زیست", "زبان", "ادبیات"] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 flex items-center text-blue-700 font-semibold hover:underline"
      >
        <FaArrowLeft className="ml-2" /> بازگشت
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-700 flex items-center gap-2">
          <FaCalendarAlt /> برنامه هفتگی
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {schedule.map((item, index) => (
            <div
              key={index}
              className="bg-purple-100 rounded-xl p-4 shadow-md hover:bg-purple-200 transition"
            >
              <h3 className="font-bold text-purple-700 text-lg">{item.day}</h3>
              <ul className="mt-2 text-gray-700 list-disc list-inside">
                {item.lessons.map((lesson, i) => (
                  <li key={i}>{lesson}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;