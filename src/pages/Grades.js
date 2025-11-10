import React from "react";
import { FaArrowLeft, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Grades = () => {
  const navigate = useNavigate();

  const grades = [
    { subject: "ریاضی", score: 18 },
    { subject: "زیست", score: 17 },
    { subject: "فیزیک", score: 15.5 },
    { subject: "شیمی", score: 16 },
    { subject: "زبان انگلیسی", score: 19 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 flex items-center text-green-700 font-semibold hover:underline"
      >
        <FaArrowLeft className="ml-2" /> بازگشت
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center gap-2">
          <FaClipboardList /> نمرات درسی
        </h2>

        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead className="bg-green-200">
            <tr>
              <th className="p-2 border border-gray-300">درس</th>
              <th className="p-2 border border-gray-300">نمره</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g, i) => (
              <tr key={i} className="hover:bg-green-100 transition">
                <td className="p-2 border border-gray-300">{g.subject}</td>
                <td className="p-2 border border-gray-300 font-bold text-gray-700">
                  {g.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grades;

