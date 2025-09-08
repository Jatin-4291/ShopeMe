import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function SignUpPage() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    passwordConfirm: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
      passwordConfirm,
    } = formData;

    try {
      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/v1/users/signup",
        {
          firstName,
          lastName,
          email,
          mobileNumber,
          password,
          passwordConfirm,
        }
      );

      if (data) {
        console.log(data);
        navigate("/login");
      }
    } catch (error) {
      // Check if the error response contains any error message
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-violet-500 to-violet-900">
        <div className="w-11/12 md:w-3/4 lg:w-1/2 bg-white rounded-lg p-8 shadow-lg transform transition-all hover:scale-105">
          <h1 className="text-4xl mb-6 text-center text-violet-900 font-bold">
            Sign Up
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={formData.firstName}
                name="firstName"
                onChange={handleChange}
                placeholder="First Name"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-violet-500"
              />
              <input
                type="text"
                value={formData.lastName}
                name="lastName"
                onChange={handleChange}
                placeholder="Last Name"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-violet-500"
              />
            </div>
            <input
              type="email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              placeholder="Email Address"
              className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-violet-500"
            />
            <input
              type="number"
              value={formData.mobileNumber}
              name="mobileNumber"
              onChange={handleChange}
              placeholder="Mobile No."
              className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-violet-500"
            />

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-violet-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="relative flex-1">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  value={formData.passwordConfirm}
                  name="passwordConfirm"
                  onChange={handleChange}
                  placeholder="Password Confirm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-violet-500"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="bg-violet-700 text-white px-4 py-3 rounded-md text-center hover:bg-violet-800 transition duration-300"
            >
              Sign Up
            </button>
            {error && <p className="text-red-600">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
