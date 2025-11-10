import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "http://localhost:5000";

const AdminPanel = () => {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState("students");
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    checkAuthorization();
  }, []);

  useEffect(() => {
    if (authorized) {
      fetchData();
    }
  }, [activeTable, authorized]);

  const checkAuthorization = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role === "admin") {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setAuthorized(false);
    }
    setLoading(false);
  };

  const api = axios.create({ baseURL: baseUrl });
  api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem("token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  });

  const fetchData = async () => {
    try {
      // در حالت واقعی این endpoint ها باید در بکند پیاده‌سازی شوند
      let response;
      switch (activeTable) {
        case "students":
          response = await api.get("/api/admin/students");
          break;
        case "teachers":
          response = await api.get("/api/admin/teachers");
          break;
        case "parents":
          response = await api.get("/api/admin/parents");
          break;
        case "subjects":
          response = await api.get("/api/admin/subjects");
          break;
        case "grades":
          response = await api.get("/api/admin/grades");
          break;
        default:
          response = { data: [] };
      }
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // برای نمایش دمو، داده‌های نمونه استفاده می‌کنیم
      setData(getSampleData());
    }
  };

  const getSampleData = () => {
    // داده‌های نمونه برای نمایش رابط کاربری
    switch (activeTable) {
      case "students":
        return [
          { id: 1, student_code: "98001", first_name: "علی", last_name: "محمدی", grade: "دهم", major: "کامپیوتر" },
          { id: 2, student_code: "98002", first_name: "فاطمه", last_name: "احمدی", grade: "یازدهم", major: "الکترونیک" }
        ];
      case "teachers":
        return [
          { id: 1, national_code: "1234567890", full_name: "دکتر رضایی", phone: "09123456789", email: "rezaei@school.com" }
        ];
      case "parents":
        return [
          { id: 1, student_id: 1, relation: "father", first_name: "محمد", last_name: "محمدی", phone_number: "09121111111" }
        ];
      case "subjects":
        return [
          { id: 1, name: "ریاضی", grade_level: "دهم", major: "کامپیوتر" }
        ];
      case "grades":
        return [
          { id: 1, student_id: 1, subject_id: 1, score: 18.5, term: "اول" }
        ];
      default:
        return [];
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setFormData(item);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        // آپدیت آیتم موجود
        await api.put(`/api/admin/${activeTable}/${editingItem}`, formData);
      } else {
        // ایجاد آیتم جدید
        await api.post(`/api/admin/${activeTable}`, formData);
      }
      setEditingItem(null);
      setFormData({});
      fetchData();
      alert("عملیات با موفقیت انجام شد");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("خطا در انجام عملیات");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("آیا از حذف این آیتم مطمئن هستید؟")) {
      try {
        await api.delete(`/api/admin/${activeTable}/${id}`);
        fetchData();
        alert("آیتم با موفقیت حذف شد");
      } catch (error) {
        console.error("Error deleting data:", error);
        alert("خطا در حذف آیتم");
      }
    }
  };

  const handleAddNew = () => {
    setEditingItem("new");
    setFormData(getDefaultFormData());
  };

  const getDefaultFormData = () => {
    switch (activeTable) {
      case "students":
        return { student_code: "", first_name: "", last_name: "", grade: "", major: "" };
      case "teachers":
        return { national_code: "", full_name: "", phone: "", email: "", password_hash: "" };
      case "parents":
        return { student_id: "", relation: "father", first_name: "", last_name: "", phone_number: "" };
      case "subjects":
        return { name: "", grade_level: "", major: "" };
      case "grades":
        return { student_id: "", subject_id: "", score: "", term: "اول" };
      default:
        return {};
    }
  };

  const getTableHeaders = () => {
    switch (activeTable) {
      case "students":
        return ["کد دانش‌آموزی", "نام", "نام خانوادگی", "پایه", "رشته", "عملیات"];
      case "teachers":
        return ["کد ملی", "نام کامل", "تلفن", "ایمیل", "عملیات"];
      case "parents":
        return ["کد دانش‌آموز", "نسبت", "نام", "نام خانوادگی", "تلفن", "عملیات"];
      case "subjects":
        return ["نام درس", "پایه", "رشته", "عملیات"];
      case "grades":
        return ["دانش‌آموز", "درس", "نمره", "ترم", "عملیات"];
      default:
        return [];
    }
  };

  const renderTableRow = (item) => {
    switch (activeTable) {
      case "students":
        return (
          <tr key={item.id}>
            <td>{item.student_code}</td>
            <td>{item.first_name}</td>
            <td>{item.last_name}</td>
            <td>{item.grade}</td>
            <td>{item.major}</td>
            <td>
              <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
                ویرایش
              </button>
              <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                حذف
              </button>
            </td>
          </tr>
        );
      case "teachers":
        return (
          <tr key={item.id}>
            <td>{item.national_code}</td>
            <td>{item.full_name}</td>
            <td>{item.phone}</td>
            <td>{item.email}</td>
            <td>
              <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
                ویرایش
              </button>
              <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                حذف
              </button>
            </td>
          </tr>
        );
      // موارد دیگر برای جداول دیگر...
      default:
        return null;
    }
  };

  const renderForm = () => {
    if (!editingItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h3 className="text-lg font-bold mb-4">
            {editingItem === "new" ? "افزودن جدید" : "ویرایش"}
          </h3>
          
          {activeTable === "students" && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="کد دانش‌آموزی"
                className="border p-2 w-full"
                value={formData.student_code || ""}
                onChange={(e) => setFormData({...formData, student_code: e.target.value})}
              />
              <input
                type="text"
                placeholder="نام"
                className="border p-2 w-full"
                value={formData.first_name || ""}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              />
              <input
                type="text"
                placeholder="نام خانوادگی"
                className="border p-2 w-full"
                value={formData.last_name || ""}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
              <input
                type="text"
                placeholder="پایه"
                className="border p-2 w-full"
                value={formData.grade || ""}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
              />
              <input
                type="text"
                placeholder="رشته"
                className="border p-2 w-full"
                value={formData.major || ""}
                onChange={(e) => setFormData({...formData, major: e.target.value})}
              />
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded flex-1">
              ذخیره
            </button>
            <button onClick={() => setEditingItem(null)} className="bg-gray-500 text-white px-4 py-2 rounded flex-1">
              انصراف
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">در حال بررسی دسترسی...</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow w-96 text-center">
          <h3 className="text-lg font-semibold mb-3">دسترسی غیرمجاز</h3>
          <p className="text-sm text-gray-600">شما دسترسی لازم برای مشاهده این صفحه را ندارید.</p>
          <button 
            onClick={() => window.location.href = "/"}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">پنل مدیریت هنرستان</h1>
            <button 
              onClick={() => window.location.href = "/"}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              بازگشت
            </button>
          </div>

          {/* تب‌های جداول */}
          <div className="flex gap-2 mb-6 border-b">
            {["students", "teachers", "parents", "subjects", "grades"].map((table) => (
              <button
                key={table}
                onClick={() => setActiveTable(table)}
                className={`px-4 py-2 rounded-t-lg ${
                  activeTable === table 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {getTableName(table)}
              </button>
            ))}
          </div>

          {/* نوار جستجو و اقدامات */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="جستجو..."
              className="border p-2 rounded w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleAddNew}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              + افزودن جدید
            </button>
          </div>

          {/* جدول داده‌ها */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {getTableHeaders().map((header, index) => (
                    <th key={index} className="border p-3 text-right font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(item => renderTableRow(item))}
              </tbody>
            </table>
          </div>

          {data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              هیچ داده‌ای یافت نشد
            </div>
          )}
        </div>
      </div>

      {renderForm()}
    </div>
  );
};

// تابع helper برای نمایش نام فارسی جداول
function getTableName(table) {
  const names = {
    students: "دانش‌آموزان",
    teachers: "معلمان",
    parents: "والدین",
    subjects: "دروس",
    grades: "نمرات"
  };
  return names[table] || table;
}

export default AdminPanel;