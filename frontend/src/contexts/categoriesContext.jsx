import { createContext, useContext, useState } from "react";
export const CategoryContext = createContext({});

export const CategoryProvider = function ({ children }) {
  const [categories, setCategories] = useState([]);
  return (
    <CategoryContext.Provider
      value={{
        categories,
        setCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = function () {
  return useContext(CategoryContext);
};
