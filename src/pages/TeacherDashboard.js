import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { FaSignOutAlt, FaUser, FaChalkboardTeacher, FaBook, FaUserGraduate } from "react-icons/fa";

/*
  فرض: توکن در localStorage با کلید "token" ذخیره شده
  این فایل نمایش درس‌ها، لیست دانش‌آموزان، مودال ثبت نمره و صفحه پروفایل را مدیریت می‌کند.
*/

const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
});

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const TeacherDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState("");
  const [gradeModal, setGradeModal] = useState({ open: false, student: null, score: "" });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchSubjects();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/teacher/profile", { headers: authHeader() });
      setProfile(res.data.profile || res.data);
    } catch (e) {
      console.error("fetchProfile:", e);
    }
  };

  const fetchSubjects = async () => {
    setLoadingSubjects(true);
    setError("");
    try {
      const res = await api.get("/api/teacher/subjects", { headers: authHeader() });
      setSubjects(res.data.subjects || res.data);
    } catch (e) {
      console.error(e);
      setError("خطا در دریافت درس‌ها");
    } finally {
      setLoadingSubjects(false);
    }
  };

  const openSubject = async (subject) => {
    setSelectedSubject(subject);
    setStudents([]);
    setLoadingStudents(true);
    setError("");
    try {
      const res = await api.get(`/api/subjects/${subject.id}/students`, { headers: authHeader() });
      setStudents(res.data.students || res.data);
    } catch (e) {
      console.error(e);
      setError("خطا در دریافت دانش‌آموزان");
    } finally {
      setLoadingStudents(false);
    }
  };

  const openGradeModal = (student) => {
    setGradeModal({ open: true, student, score: student.current_score ?? "" });
  };

  const closeGradeModal = () => {
    setGradeModal({ open: false, student: null, score: "" });
  };

  const submitGrade = async () => {
    const { student } = gradeModal;
    if (!student || !selectedSubject) return;
    const score = parseFloat(gradeModal.score);
    if (isNaN(score) || score < 0 || score > 20) {
      alert("نمره باید عدد بین 0 تا 20 باشد");
      return;
    }

    try {
      await api.post(
        "/api/grades",
        {
          student_id: student.id,
          subject_id: selectedSubject.id,
          score,
          term: "اول", // در صورت نیاز این را پویا کن
        },
        { headers: authHeader() }
      );

      // به‌روزرسانی محلی لیست نمرات اگر بخواهی
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, current_score: score } : s))
      );

      closeGradeModal();
      alert("نمره ثبت شد");
    } catch (e) {
      console.error("submitGrade:", e);
      alert("خطا در ثبت نمره");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // redirect or reload
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <FaChalkboardTeacher className="text-3xl text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold">پنل معلم</h1>
              <p className="text-sm text-gray-600">{profile ? `${profile.full_name || profile.name || ""}` : (user && user.full_name) || ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">
              <FaSignOutAlt /> خروج
            </button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6">
          {/* ستون دروس */}
          <aside className="col-span-1 bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><FaBook /> دروس من</h2>
            {loadingSubjects ? (
              <p>در حال بارگذاری...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : subjects.length === 0 ? (
              <p className="text-gray-500">هیچ درسی یافت نشد</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {subjects.map((sub) => (
                  <li key={sub.id}>
                    <button
                      onClick={() => openSubject(sub)}
                      className={`w-full text-right p-2 rounded ${selectedSubject?.id === sub.id ? "bg-purple-100" : "hover:bg-gray-50"}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">{sub.name}</div>
                        <div className="text-xs text-gray-500">{sub.grade_level} - {sub.major}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* ستون محتوای اصلی: دانش‌آموزان */}
          <main className="col-span-2 bg-white rounded shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2"><FaUserGraduate /> {selectedSubject ? `دانش‌آموزان درس ${selectedSubject.name}` : "دانش‌آموزان"}</h2>
              {selectedSubject && <div className="text-sm text-gray-500">پایه: {selectedSubject.grade_level} — رشته: {selectedSubject.major}</div>}
            </div>

            {selectedSubject ? (
              loadingStudents ? (
                <p>در حال بارگذاری دانش‌آموزان...</p>
              ) : students.length === 0 ? (
                <p className="text-gray-500">هیچ دانش‌آموزی در این درس یافت نشد</p>
              ) : (
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-sm text-gray-600">
                      <th className="p-2">ردیف</th>
                      <th className="p-2">نام</th>
                      <th className="p-2">کد</th>
                      <th className="p-2">نمره</th>
                      <th className="p-2">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, idx) => (
                      <tr key={s.id} className="border-t">
                        <td className="p-2 text-sm">{idx + 1}</td>
                        <td className="p-2 text-sm">{s.first_name} {s.last_name}</td>
                        <td className="p-2 text-sm">{s.student_code || s.code || ""}</td>
                        <td className="p-2 text-sm">{s.current_score ?? "—"}</td>
                        <td className="p-2 text-sm">
                          <button
                            onClick={() => openGradeModal(s)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            ثبت/ویرایش نمره
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              <div className="text-gray-500">یک درس را از ستون سمت چپ انتخاب کنید تا دانش‌آموزان آن را ببینید.</div>
            )}
          </main>
        </div>
      </div>

      {/* مودال ثبت نمره */}
      {gradeModal.open && gradeModal.student && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-96 p-6 text-right">
            <h3 className="text-lg font-semibold mb-3">ثبت نمره برای {gradeModal.student.first_name} {gradeModal.student.last_name}</h3>
            <div className="mb-3">
              <label className="block text-sm mb-1">نمره (0-20)</label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={gradeModal.score}
                onChange={(e) => setGradeModal((p) => ({ ...p, score: e.target.value }))}
                className="w-full border rounded p-2 text-left"
              />
            </div>

            <div className="flex justify-between gap-2">
              <button onClick={closeGradeModal} className="px-4 py-2 border rounded">انصراف</button>
              <button onClick={submitGrade} className="px-4 py-2 bg-blue-600 text-white rounded">ثبت نمره</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
