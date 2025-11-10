import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const BACKEND = "http://localhost:5000";

const EditProfile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    national_code: "",
    birth_date: "",
    phone_number: "",
    major: "",
    grade: "",
    address: "",
    postal_code: "",
    profile_picture: "",
    father: {
      first_name: "",
      phone_number: "",
      job: "",
      education_level: ""
    },
    mother: {
      first_name: "",
      phone_number: "",
      job: "",
      education_level: ""
    }
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.student_code) {
      axios
        .get(`${BACKEND}/student/${user.student_code}/full`)
        .then((res) => {
          const data = res.data;
          console.log("📥 داده‌های دریافتی از سرور:", data);
          
          setForm({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            national_code: data.national_code || "",
            birth_date: data.birth_date || "",
            phone_number: data.phone_number || "",
            major: data.major || "",
            grade: data.grade || "",
            address: data.address || "",
            postal_code: data.postal_code || "",
            profile_picture: data.profile_picture || "",
            father: {
              first_name: data.fatherName || "",
              phone_number: data.fatherPhone || "",
              job: data.fatherJob || "",
              education_level: data.fatherEducation || ""
            },
            mother: {
              first_name: data.motherName || "",
              phone_number: data.motherPhone || "",
              job: data.motherJob || "",
              education_level: data.motherEducation || ""
            }
          });
        })
        .catch((err) => {
          console.error("❌ خطا در دریافت اطلاعات:", err);
          alert("خطا در دریافت اطلاعات از سرور");
        });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('father.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        father: {
          ...prev.father,
          [field]: value
        }
      }));
    } else if (name.startsWith('mother.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        mother: {
          ...prev.mother,
          [field]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // بررسی حجم فایل (حداکثر 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("حجم فایل باید کمتر از 2MB باشد");
      return;
    }

    // بررسی نوع فایل
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert("فرمت فایل باید jpg یا png باشد");
      return;
    }

    const data = new FormData();
    data.append("profile", file);

    try {
      setUploading(true);
      const res = await axios.post(`${BACKEND}/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = res.data.url.startsWith("http")
        ? res.data.url
        : `${BACKEND}${res.data.url}`;

      setForm((prev) => ({ ...prev, profile_picture: fileUrl }));
      alert("تصویر با موفقیت آپلود شد");
    } catch (err) {
      console.error("Upload error:", err);
      alert("خطا در آپلود تصویر");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!user?.student_code) {
      alert("کد دانش‌آموز مشخص نیست");
      return;
    }

    // اعتبارسنجی فیلدهای ضروری
    if (!form.first_name || !form.last_name || !form.national_code) {
      alert("لطفا فیلدهای ضروری (نام، نام خانوادگی، کد ملی) را پر کنید");
      return;
    }

    // ساخت payload مطابق با انتظارات سرور
    const payload = {
      ...form,
      father: {
        first_name: form.father.first_name,
        last_name: form.last_name, // استفاده از نام خانوادگی دانش‌آموز برای پدر
        birth_date: "",
        national_code: "",
        id_card_serial: "",
        education_level: form.father.education_level,
        job: form.father.job,
        phone_number: form.father.phone_number
      },
      mother: {
        first_name: form.mother.first_name,
        last_name: form.last_name, // استفاده از نام خانوادگی دانش‌آموز برای مادر
        birth_date: "",
        national_code: "",
        id_card_serial: "",
        education_level: form.mother.education_level,
        job: form.mother.job,
        phone_number: form.mother.phone_number
      }
    };

    console.log("📤 داده‌های ارسالی به سرور:", payload);

    axios
      .put(`${BACKEND}/student/${user.student_code}/full`, payload)
      .then((res) => {
        alert(res.data.message || "اطلاعات با موفقیت ذخیره شد");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("❌ خطا در ذخیره اطلاعات:", err);
        if (err.response) {
          alert(`خطا در ذخیره اطلاعات: ${err.response.data.message || "خطای سرور"}`);
        } else {
          alert("خطا در ارتباط با سرور");
        }
      });
  };

  const handleCancel = () => {
    if (window.confirm("آیا از لغو تغییرات اطمینان دارید؟ تغییرات ذخیره نشده از بین خواهند رفت.")) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex justify-center py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] max-w-4xl">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          ویرایش اطلاعات دانش‌آموز
        </h2>

        {/* بخش عکس پروفایل */}
        <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="relative">
            <img
              src={form.profile_picture || "https://picsum.photos/120"}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-300"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">در حال آپلود...</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              آپلود عکس پروفایل
            </label>
            <input 
              type="file" 
              accept="image/jpeg,image/jpg,image/png" 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              disabled={uploading}
            />
            <p className="text-xs text-gray-500 mt-1">
              فرمت‌های مجاز: JPG, PNG • حداکثر حجم: 2MB
            </p>
          </div>
        </div>

        {/* فرم اطلاعات */}
        <div className="space-y-6">
          {/* اطلاعات شخصی */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-600 mb-4 border-b pb-2">
              اطلاعات شخصی
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                <input 
                  name="first_name" 
                  value={form.first_name} 
                  onChange={handleChange} 
                  placeholder="نام" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                <input 
                  name="last_name" 
                  value={form.last_name} 
                  onChange={handleChange} 
                  placeholder="نام خانوادگی" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">کد ملی</label>
                <input 
                  name="national_code" 
                  value={form.national_code} 
                  onChange={handleChange} 
                  placeholder="کد ملی" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ تولد</label>
                <input 
                  name="birth_date" 
                  value={form.birth_date} 
                  onChange={handleChange} 
                  placeholder="تاریخ تولد" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">شماره موبایل</label>
                <input 
                  name="phone_number" 
                  value={form.phone_number} 
                  onChange={handleChange} 
                  placeholder="شماره موبایل" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رشته</label>
                <input 
                  name="major" 
                  value={form.major} 
                  onChange={handleChange} 
                  placeholder="رشته" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">پایه</label>
                <input 
                  name="grade" 
                  value={form.grade} 
                  onChange={handleChange} 
                  placeholder="پایه" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* اطلاعات پدر */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b pb-2">
              اطلاعات پدر
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام پدر</label>
                <input 
                  name="father.first_name" 
                  value={form.father.first_name} 
                  onChange={handleChange} 
                  placeholder="نام پدر" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">شماره موبایل پدر</label>
                <input 
                  name="father.phone_number" 
                  value={form.father.phone_number} 
                  onChange={handleChange} 
                  placeholder="شماره موبایل پدر" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">شغل پدر</label>
                <input 
                  name="father.job" 
                  value={form.father.job} 
                  onChange={handleChange} 
                  placeholder="شغل پدر" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تحصیلات پدر</label>
                <input 
                  name="father.education_level" 
                  value={form.father.education_level} 
                  onChange={handleChange} 
                  placeholder="تحصیلات پدر" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* اطلاعات مادر */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-pink-600 mb-4 border-b pb-2">
              اطلاعات مادر
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام مادر</label>
                <input 
                  name="mother.first_name" 
                  value={form.mother.first_name} 
                  onChange={handleChange} 
                  placeholder="نام مادر" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">شماره موبایل مادر</label>
                <input 
                  name="mother.phone_number" 
                  value={form.mother.phone_number} 
                  onChange={handleChange} 
                  placeholder="شماره موبایل مادر" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">شغل مادر</label>
                <input 
                  name="mother.job" 
                  value={form.mother.job} 
                  onChange={handleChange} 
                  placeholder="شغل مادر" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تحصیلات مادر</label>
                <input 
                  name="mother.education_level" 
                  value={form.mother.education_level} 
                  onChange={handleChange} 
                  placeholder="تحصیلات مادر" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* اطلاعات تماس */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-600 mb-4 border-b pb-2">
              اطلاعات تماس
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">آدرس منزل</label>
                <input 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange} 
                  placeholder="آدرس منزل" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">کد پستی</label>
                <input 
                  name="postal_code" 
                  value={form.postal_code} 
                  onChange={handleChange} 
                  placeholder="کد پستی" 
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* دکمه‌های action */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button 
            onClick={handleCancel} 
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-200 font-medium"
          >
            بازگشت
          </button>
          <button 
            onClick={handleSave} 
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-200 font-medium flex items-center gap-2"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                در حال آپلود...
              </>
            ) : (
              "ذخیره تغییرات"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;