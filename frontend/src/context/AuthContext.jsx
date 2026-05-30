import { createContext, useContext, useState, useCallback } from "react";
import { loginAPI, registerAPI } from "../utils/api";

const AuthContext = createContext(null);

// Helper to read/write user from localStorage
const storage = {
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem("mb_user"));
    } catch {
      return null;
    }
  },
  setUser: (u) => localStorage.setItem("mb_user", JSON.stringify(u)),
  clearUser: () => localStorage.removeItem("mb_user"),
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());
  const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null

  const login = useCallback(async (email, password) => {
    const u = await loginAPI(email, password); // calls backend
    storage.setUser(u);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (name, email, phone, password) => {
    const u = await registerAPI(name, email, phone, password); // calls backend
    storage.setUser(u);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    storage.clearUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        authModal,
        setAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
