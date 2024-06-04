import { createContext, useContext, useState } from "react";

export const UserContext = createContext({});

export const UserProvider = function ({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = function () {
  return useContext(UserContext);
};
