import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";

function Logout() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");

  const { setIsAuthenticated, setUser } = useUser();
  setIsAuthenticated(false);
  setUser(false);
  return <Navigate to="/login" />;
}

export default Logout;
