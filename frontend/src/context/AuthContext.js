import { createContext, useContext, useState, useCallback } from "react";
import {
  storage,
  login as doLogin,
  register as doRegister,
  pushNotification,
} from "../utils/data";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());
  const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null

  const login = useCallback((email, password) => {
    const u = doLogin(email, password);
    if (!u) throw new Error("Invalid email or password");
    storage.setUser(u);
    setUser(u);
    return u;
  }, []);

  const register = useCallback((name, email, phone, password) => {
    const u = doRegister(name, email, phone, password);
    storage.setUser(u);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    storage.clearUser();
    setUser(null);
  }, []);

  const notify = useCallback((userId, title, message, type) => {
    pushNotification(userId, title, message, type);
  }, []);

  const unreadCount = () => {
    if (!user) return 0;
    return storage
      .getNotifications()
      .filter((n) => n.userId === user.id && !n.read).length;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        notify,
        unreadCount,
        authModal,
        setAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
