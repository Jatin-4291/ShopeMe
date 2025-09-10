import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import { useState, useEffect } from "react";
import axios from "axios";

function CheckAuth() {
  const { isAuthenticated, user, setUser, setIsAuthenticated } = useUser();
  const [setGoogleUser] = useState(null); // Correctly defining state
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const getGoogleData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/login/sucess`, {
          withCredentials: true,
        });
        console.log(response.data.data);
        setGoogleUser(response.data.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        setIsAuthenticated(true);
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching Google user data:", error);
      }
    };

    // Only fetch Google data if not already authenticated
    if (!isAuthenticated) {
      getGoogleData();
    }
  }, [isAuthenticated, setUser, setIsAuthenticated, setGoogleUser, backendUrl]); // Dependencies

  console.log(user);
  console.log(isAuthenticated);

  // Redirect logic based on user roles
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

  // Optionally, render nothing or a loading screen if still processing authentication
  return null;
}

export default CheckAuth;
