import React from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const navigate = useNavigate();

  const attendance = [
    { date: "۱۴۰۵/۰۷/۰۱", status: "حاضر" },
    { date: "۱۴۰۵/۰۷/۰۲", status: "غایب" },
    { date: "۱۴۰۵/۰۷/۰۳", status: "حاضر" },
    { date: "۱۴۰۵/۰۷/۰۴", status: "حاضر" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-200 p-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 flex items-center text-orange-700 font-semibold hover:underline"
      >
        <FaArrowLeft className="ml-2" /> بازگشت
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-orange-700 flex items-center gap-2">
          <FaCheckCircle /> حضور و غیاب
        </h2>

        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead className="bg-orange-200">
            <tr>
              <th className="p-2 border border-gray-300">تاریخ</th>
              <th className="p-2 border border-gray-300">وضعیت</th>
            </tr>
          </thead>
          <tbody>
           {attendance.map((a, i) => (
              <tr
                key={i}
                className={`${
                  a.status === "غایب" ? "bg-red-100" : "bg-green-100"
                } hover:opacity-80 transition`}
              >
                <td className="p-2 border border-gray-300">{a.date}</td>
                <td className="p-2 border border-gray-300 font-bold">
                  {a.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;