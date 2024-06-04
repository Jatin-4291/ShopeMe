import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";
function CheckAuth() {
  const { isAuthenticated, user } = useUser();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (isAuthenticated && user.roles === "customer") {
    return <Navigate to="/user" />;
  }
}

export default CheckAuth;
