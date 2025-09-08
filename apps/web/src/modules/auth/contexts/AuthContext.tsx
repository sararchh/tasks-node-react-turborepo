import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PATHS from "@/routes/paths";
import {
  hasToken,
  hasUserLocalStorage,
  setUserStorage,
} from "@/shared/utils/jwt";

import { publicRoutes } from "@/routes/publicRoutes";

interface AuthContextData {
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    const initialize = async () => {
      const pathname: any = location.pathname;
      const token = await hasToken();
      if (!token && !publicRoutes.includes(pathname)) {
        navigate(PATHS?.index);
      }
      const userLocalStorage = hasUserLocalStorage();
      if (token && userLocalStorage) {
        setUser(userLocalStorage);
        setUserStorage(userLocalStorage);

        if (
          pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/"
        ) {
          navigate(PATHS.dashboard?.index);
        }
      }
      setLoading(false);
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    try {
      navigate(PATHS?.index);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setUserStorage(null);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleSetUser = (userData: any) => {
    setUser(userData);
    setUserStorage(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        setUser: handleSetUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
