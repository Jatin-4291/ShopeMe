import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/userContext";
function CheckUser() {
  const { isAuthenticated, user } = useUser();
  console.log(isAuthenticated, user);
  if (!isAuthenticated) {
    console.log("hi");
    return <Outlet />;
  } else {
    return <Navigate to="/redirect" />;
  }
}

export default CheckUser;
