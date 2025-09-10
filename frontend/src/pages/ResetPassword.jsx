import { useState } from "react";
import api from "../../utils/api.js";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await api.patch(`/users/resetPassword/${token}`, {
        password,
        passwordConfirm: confirmPassword,
      });
      console.log(response);
      toast.success("Password has been reset successfully");
    } catch (error) {
      setMessage("Error resetting password");
    }
  };
  return (
    <div className="w-full h-screen">
      <div className="bg-violet-900 h-2/5"></div>
      <div className="absolute top-50 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-400 shadow-lg rounded-md w-1/5 h-2/5 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold text-violet-900 mb-8 text-center">
          ResetPassWord
        </h1>
        <p className="text-md mb-6 ml-3 mr-3 text-center">
          Enter your new Password
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 border border-gray-400 rounded-md outline-none w-4/5 h-10 px-3"
            placeholder="New password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4 border border-gray-400 rounded-md outline-none w-4/5 h-10 px-3"
            placeholder="Confirm Password"
          />
          <button className="w-1/2 h-10 bg-violet-900 font-bold text-xl text-center text-white rounded-md">
            Submit
          </button>
          {message && <p className="text-red-500 text-sm mb-4">{message}</p>}
        </form>
        <Toaster gutter={10} />
      </div>
    </div>
  );
}
export default ResetPassword;
