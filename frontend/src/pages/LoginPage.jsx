import { Link } from "react-router-dom";
import axios from "axios";
import isEmail from "validator/lib/isEmail";
import { useState } from "react";
import { useUser } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "test5@gmail.com",
    password: "jatin1234",
  });
  const [error, setError] = useState(null);
  const { setIsAuthenticated, setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please enter both email/mobile and password");
      return;
    }

    if (!isEmail(email) && !/^[0-9]{10}$/.test(email)) {
      setError("Please enter a valid email or mobile number");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/v1/users/login",
        isEmail(email) ? { email, password } : { mobileNumber: email, password }
      );

      // Set token in local storage
      console.log(data.data.user);
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      // Set authentication state to true
      setIsAuthenticated(true);
      // Set user data
      setUser(data.data.user);
      // Redirect the user to a secure route
      navigate("/redirect");
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div className="flex mt-2 h-3/5 ">
        <div className="w-1/2 bg-blue-500 h-screen flex flex-col justify-center items-center  text-white">
          <h3 className="text-2xl">Nice to see you again...</h3>
          <br />
          <h1 className="text-5xl  font-bold">WELCOME BACK</h1>
        </div>
        <div className="w-1/2 h-4/5 flex flex-col justify-center items-center">
          <form className="w-full h-screen" onSubmit={handleSubmit}>
            <div className=" w-full h-screen flex flex-col justify-center items-center">
              {" "}
              <h1 className="text-2xl  m-5 text-blue-500 font-bold">
                Login Account
              </h1>
              <input
                className="w-1/2 h-10 bg-gray-200 m-4 border border-gray-300 outline-none rounded-md px-2"
                type="text"
                value={formData.firstName}
                name="email"
                onChange={handleChange}
                placeholder="Enter Mobile No./Email"
              />
              <input
                className="w-1/2 bg-gray-200 h-10 m-4 border border-gray-300 outline-none rounded-md px-2"
                type="password"
                value={formData.firstName}
                name="password"
                onChange={handleChange}
                placeholder="Enter Password"
              />
              <div className=" w-1/2 text-blue-500 text-xs flex justify-between">
                <Link to="/signup">Signup</Link>
                <p> forgot password</p>
              </div>
              <button className="w-1/3 h-10 m-4 bg-blue-500 font-bold text-xl text-center text-white rounded-md">
                Login
              </button>
            </div>
            {error && <p className="text-red-600">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
