import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:3001/api/me", {
      credentials: "include",
    })
      .then((res) => (res.status === 200 ? res.json() : null))
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const login = () => {
    const currentPath = window.location.pathname;
    window.location.href = `http://127.0.0.1:3001/api/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const logout = async () => {
    await fetch("http://127.0.0.1:3001/api/logout", {
      method: "GET",
      credentials: "include",
    })
      .then(() => setUser(null))
      .catch(() => setLoading(false));
    const currentPath = window.location.pathname;
    window.location.href = currentPath;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext }
