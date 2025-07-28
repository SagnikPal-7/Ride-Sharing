import React, { createContext, useState, useEffect } from "react";

export const UserDataContext = createContext();

export const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try to load user from localStorage on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Whenever user changes, update localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};
