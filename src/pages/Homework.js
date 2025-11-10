import React from "react";
import { FaArrowLeft, FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Homework = () => {
  const navigate = useNavigate();

  const homeworks = [
    { subject: "ریاضی", task: "صفحه ۴۵ تا ۵۰ حل شود", due: "۱۴۰۵/۰۸/۰۱" },
    { subject: "زیست", task: "فصل ۲ مرور شود", due: "۱۴۰۵/۰۸/۰۲" },
    { subject: "زبان", task: "کلمات جدید یاد گرفته شود", due: "۱۴۰۵/۰۸/۰۳" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 flex items-center text-pink-700 font-semibold hover:underline"
      >
        <FaArrowLeft className="ml-2" /> بازگشت
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-pink-700 flex items-center gap-2">
          <FaBook /> تکالیف
        </h2>

        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead className="bg-pink-200">
            <tr>
              <th className="p-2 border border-gray-300">درس</th>
              <th className="p-2 border border-gray-300">تکلیف</th>
              <th className="p-2 border border-gray-300">موعد تحویل</th>
            </tr>
          </thead>
          <tbody>
            {homeworks.map((h, i) => (
              <tr key={i} className="hover:bg-pink-100 transition">
                <td className="p-2 border border-gray-300">{h.subject}</td>
                <td className="p-2 border border-gray-300">{h.task}</td>
                <td className="p-2 border border-gray-300">{h.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Homework;