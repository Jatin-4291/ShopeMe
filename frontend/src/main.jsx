import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./contexts/userContext.jsx";
import { ProductProvider } from "./contexts/productContext.jsx";
import { CategoryProvider } from "./contexts/categoriesContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <ProductProvider>
        <CategoryProvider>
          <App />
        </CategoryProvider>
      </ProductProvider>
    </UserProvider>
  </React.StrictMode>
);
