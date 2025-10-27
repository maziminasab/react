import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePic" && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const saveProfile = () => {
    setUser(formData);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          ویرایش اطلاعات
        </h2>

        <div className="flex flex-col items-center mb-6">
          <img
            src={formData.profilePic}
            alt="profile"
            className="w-28 h-28 rounded-full border-4 border-green-500 object-cover"
          />
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleChange}
            className="mt-3 text-sm"
          />
        </div>

        <div className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="نام"
            value={formData.firstName || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="lastName"
            placeholder="نام خانوادگی"
            value={formData.lastName || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="grade"
            placeholder="پایه"
            value={formData.grade || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="major"
            placeholder="رشته"
            value={formData.major || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="nationalId"
            placeholder="کد ملی"
            value={formData.nationalId || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="phone"
            placeholder="شماره موبایل"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="birthDate"
            placeholder="تاریخ تولد"
            value={formData.birthDate || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <button
          onClick={saveProfile}
          className="w-full bg-green-600 text-white py-3 rounded-lg mt-6 hover:bg-green-700 transition"
        >
          ذخیره اطلاعات
        </button>
      </div>
    </div>
  );
};

export default EditProfile;

