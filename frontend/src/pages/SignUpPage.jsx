import { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    address: "",
    password: "",
    passwordConfirm: "",
  });

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
      address,
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
          address,
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

  return (
    <>
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen bg-blue-500 mt-2">
          <div className="w-4/5 md:w-1/2 lg:w-1/3 bg-white rounded-lg p-6">
            <h1 className="text-3xl mb-4 text-center">Sign Up</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={formData.firstName}
                  name="firstName"
                  onChange={handleChange}
                  placeholder="First Name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={formData.lastName}
                  name="lastName"
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <input
                type="email"
                value={formData.email}
                name="email"
                onChange={handleChange}
                placeholder="Email Address"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <input
                type="Number"
                value={formData.mobileNumber}
                name="mobileNumber"
                onChange={handleChange}
                placeholder="Mobile No."
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={formData.address}
                name="address"
                onChange={handleChange}
                placeholder="Address"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-4">
                <input
                  type="password"
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <input
                  type="password"
                  value={formData.passwordConfirm}
                  name="passwordConfirm"
                  onChange={handleChange}
                  placeholder="Password Confirm"
                  className="flex-1  px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-center hover:bg-blue-600 transition duration-300"
              >
                Sign Up
              </button>
              {error && <p className="text-red-600">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
