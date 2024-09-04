import { createContext, useContext, useState } from "react";

export const ProductContext = createContext({});

export const ProductProvider = function ({ children }) {
  const [searchProduct, setSearchProduct] = useState("");
  const [productId, setProductId] = useState("");
  const [cartItems, setCartItems] = useState([{}]);
  const [cartId, setCartId] = useState("");
  return (
    <ProductContext.Provider
      value={{
        searchProduct,
        setSearchProduct,
        productId,
        setProductId,
        cartItems,
        setCartItems,
        cartId,
        setCartId,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = function () {
  return useContext(ProductContext);
};
