import { createContext, useContext, useState } from "react";

export const ProductContext = createContext({});

export const ProductProvider = function ({ children }) {
  const [searchProduct, setSearchProduct] = useState("");
  return (
    <ProductContext.Provider
      value={{
        searchProduct,
        setSearchProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = function () {
  return useContext(ProductContext);
};
