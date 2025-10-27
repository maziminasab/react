import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaSchool, FaHome, FaMale, FaFemale } from "react-icons/fa";

const Dashboard = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-200">

      {/* Header */}
      <div className="bg-blue-700 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-lg font-bold">پنل کاربری دانش‌آموز</h1>
        <button
          onClick={logout}
          className="bg-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-700"
        >
          خروج
        </button>
      </div>

      <div className="container mx-auto p-6 max-w-4xl">

        {/* Profile Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 text-center transform hover:scale-105 transition">
          <img
            src={user.profilePic}
            alt="profile"
            className="w-36 h-36 rounded-full border-4 border-purple-500 mx-auto shadow-lg"
          />
          <h2 className="text-2xl font-bold mt-3 text-gray-800">
            {user.firstName} {user.lastName}
          </h2>

          <p classname="text-gray-600 mt-1 flex items-center gap-2 justify-center">
            <FaSchool /> پایه: {user.grade || "-"} | رشته: {user.major || "-"}
          </p>

          <button
            onClick={() => navigate("/edit-profile")}
            className="bg-purple-600 text-white py-2 px-6 rounded-xl mt-4 hover:bg-purple-700 transition"
          >
            ویرایش پروفایل ✏️
          </button>
        </div>

        {/* Info Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="bg-blue-500 text-white shadow-lg rounded-xl p-5">
            <h3 className="flex gap-2 items-center text-lg font-bold">
              <FaUser /> مشخصات فردی
            </h3>
            <p>کد ملی: {user.nationalId || "-"}</p>
            <p>تاریخ تولد: {user.birthDate || "-"}</p>
            <p><FaPhone className="inline ml-1" /> موبایل: {user.phone || "-"}</p>
          </div>

          <div className="bg-green-500 text-white shadow-lg rounded-xl p-5">
            <h3 className="flex gap-2 items-center text-lg font-bold">
              <FaMale /> اطلاعات پدر
            </h3>
            <p>نام: {user.fatherName || "-"}</p>
            <p>تحصیلات: {user.fatherEducation || "-"}</p>
            <p>شغل: {user.fatherJob || "-"}</p>
            <p><FaPhone className="inline ml-1" /> موبایل: {user.fatherPhone || "-"}</p>
          </div>

          <div className="bg-pink-500 text-white shadow-lg rounded-xl p-5">
            <h3 className="flex gap-2 items-center text-lg font-bold">
              <FaFemale /> اطلاعات مادر
            </h3>
            <p>نام: {user.motherName || "-"}</p>
            <p>تحصیلات: {user.motherEducation || "-"}</p>
            <p>شغل: {user.motherJob || "-"}</p>
            <p><FaPhone className="inline ml-1" /> موبایل: {user.motherPhone || "-"}</p>
          </div>

          <div className="bg-purple-500 text-white shadow-lg rounded-xl p-5">
            <h3 className="flex gap-2 items-center text-lg font-bold">
              <FaHome /> آدرس
            </h3>
            <p>{user.address || "-"}</p>
            <p>کدپستی: {user.postalCode || "-"}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;