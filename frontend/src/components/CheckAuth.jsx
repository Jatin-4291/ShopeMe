import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";
function CheckAuth() {
  const { isAuthenticated, user } = useUser();
  console.log(isAuthenticated);
  console.log(user.roles);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && user.roles === "customer") {
    console.log(isAuthenticated, user.roles);
    return <Navigate to="/user" />;
  }
  if (isAuthenticated && user.roles === "admin") {
    console.log(isAuthenticated, user.roles);
    return <Navigate to="/admin" />;
  }
  if (isAuthenticated && user.roles === "seller") {
    console.log(isAuthenticated, user.roles);
    return <Navigate to="/seller" />;
  }
}

export default CheckAuth;
