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
}

export default CheckAuth;
