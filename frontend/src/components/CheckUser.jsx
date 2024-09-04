import { Outlet } from "react-router-dom";
import { useUser } from "../contexts/userContext";
function CheckUser() {
  const { isAuthenticated } = useUser();
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    console.log("hi");
    return <Outlet />;
  } else {
    return <h1 className="text-3xl">You are already login</h1>;
  }
}

export default CheckUser;
