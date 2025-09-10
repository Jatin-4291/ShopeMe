import { useState } from "react";
import { CgDanger } from "react-icons/cg";
import isEmail from "validator/lib/isEmail";
import api from "../utils/api.js";
import toast, { Toaster } from "react-hot-toast";

console.log("hello");
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter an email!");
      return;
    }
    if (!isEmail(email)) {
      setError("Please enter a correct email!");
      return;
    }

    try {
      const { data } = await api.post("/users/forgotpassword", { email });
      console.log(data);
      toast.success("Password reset link sent! Check your email.");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="bg-violet-900 h-2/5"></div>
      <div className="absolute top-50 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-400 shadow-lg rounded-md w-96 h-3/5 flex flex-col items-center justify-center">
        <CgDanger className="text-8xl text-violet-900 mb-12" />
        <h3 className="text-lg mb-8 text-center">Forgot Password?</h3>
        <p className="text-md mb-6 ml-3 mr-3 text-center">
          Enter your email and we will send you a link to reset your password.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <input
            type="email"
            className="mb-4 border border-gray-400 rounded-md outline-none w-4/5 h-10 px-3"
            value={email}
            onChange={handleChange}
            placeholder="Enter your Email"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button className="w-1/2 h-10 bg-violet-900 font-bold text-xl text-center text-white rounded-md">
            Submit
          </button>
        </form>
        <Toaster gutter={10} />
      </div>
      <div className="bg-white"></div>
    </div>
  );
}

export default ForgotPassword;
