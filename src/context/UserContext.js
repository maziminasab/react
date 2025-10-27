import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    firstName: "نام",
    lastName: "نام‌خانوادگی",
    grade: "پایه",
    major: "رشته",
    profilePic: "/profile.png", // عکس پیشفرض
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};