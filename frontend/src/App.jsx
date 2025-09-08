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
import ForgotPassward from "./pages/ForgotPassward";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import SellerDetails from "./pages/SellerDetails";
import SellerDashBoard from "./pages/SellerDashBoard";
import AdminDashboard from "./pages/AdminDashboard";
import CategoryPage from "./pages/CategoryPage";
import SubCategoryProducts from "./pages/SubCategoryProducts";
import Overview from "./components/SellerDashBoard/Overview";
import OrdersForSeller from "./components/AdminDashboard/AdminOrders";
import SellerProducts from "./components/SellerDashBoard/SellerProducts";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CheckUser />}>
          <Route index element={<HomePage />} />
          <Route path="productList" element={<ProductList />} />
          <Route path="productDetails/:id" element={<ProductDetails />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="forgotpassward" element={<ForgotPassward />} />
          <Route path="resetpassword/:token" element={<ResetPassword />} />
          <Route path="categorypage/:id" element={<CategoryPage />} />
          <Route path="subcategorypage/:id" element={<SubCategoryProducts />} />
          <Route path="cart" element={<CartPage />} />
        </Route>
        <Route path="/logout" element={<Logout />} />
        <Route path="/redirect" element={<CheckAuth />} />
        <Route
          path="/user"
          element={<RequireAuth allowedRoles={["customer"]} />}
        >
          <Route index element={<HomePage />} />
          <Route path="productList" element={<ProductList />} />
          <Route path="productDetails/:id" element={<ProductDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart/:id" element={<CartPage />} />
          <Route path="orders/:orderId" element={<OrdersPage />} />
          <Route path="seller-details" element={<SellerDetails />} />
          <Route path="categorypage/:id" element={<CategoryPage />} />
          <Route path="subcategorypage/:id" element={<SubCategoryProducts />} />
        </Route>
        <Route
          path="/seller"
          element={<RequireAuth allowedRoles={["seller"]} />}
        >
          <Route index element={<SellerDashBoard />} />
        </Route>
        <Route path="/admin" element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route index element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<CheckUser />} />{" "}
        {/* Catch-all route for handling undefined paths */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
