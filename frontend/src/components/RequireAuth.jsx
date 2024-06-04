import { Outlet } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import PropTypes from "prop-types";
import { useEffect } from "react";
function RequireAuth({ allowedRoles }) {
  const { setIsAuthenticated, isAuthenticated, user, setUser } = useUser();
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(userData);
    }
  }, []);
  if (isAuthenticated && allowedRoles.includes(user?.roles)) {
    return <Outlet />;
  }
}
RequireAuth.propTypes = {
  allowedRoles: PropTypes.array.isRequired, // Assuming allowedRoles is an array
};
export default RequireAuth;
