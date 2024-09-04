import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export const UserProvider = function ({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPhoto, setIsPhoto] = useState(false);
  useEffect(() => {
    if (user === null) return;
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    if (user !== null) {
      return;
    }
    const userInStorage = localStorage.getItem("user");
    console.log(userInStorage);

    if (userInStorage !== "null" && userInStorage !== null) {
      setUser(JSON.parse(userInStorage));
      setIsAuthenticated(true);
    }
  }, [user]);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isPhoto,
        setIsPhoto,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = function () {
  return useContext(UserContext);
};
