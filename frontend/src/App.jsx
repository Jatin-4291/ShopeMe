import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CheckAuth from "./components/CheckAuth";
import RequireAuth from "./components/RequireAuth";
import CheckUser from "./components/CheckUser";
import Logout from "./components/Logout";
import ProductList from "./pages/ProductList";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CheckUser />}>
          <Route path="login" element={<LoginPage />}></Route>
          <Route path="signup" element={<SignUpPage />}></Route>
        </Route>
        <Route path="/logout" element={<Logout />}></Route>
        <Route path="/redirect" element={<CheckAuth />}></Route>
        <Route
          path="/user"
          element={<RequireAuth allowedRoles={["customer", "seller"]} />}
        >
          <Route index element={<HomePage />}></Route>
          <Route path="productList" element={<ProductList />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
