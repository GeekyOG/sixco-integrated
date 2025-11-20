// AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  userData: null,
  authLogin: () => {},
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  // Load user from storage on mount
  useEffect(() => {
    const raw = localStorage.getItem("userData");
    if (raw) setUserData(JSON.parse(raw));
  }, []);

  const authLogin = (data) => {
    setUserData(data);
    localStorage.setItem("userData", JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ userData, authLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
