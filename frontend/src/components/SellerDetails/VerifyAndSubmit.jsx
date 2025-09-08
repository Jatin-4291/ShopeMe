import axios from "axios";
import { useUser } from "../../contexts/userContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VerifyAndSubmit() {
  const { user, setUser } = useUser();
  const [isSellerApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/v1/users/${user._id}`,
        {
          isSellerApproved,
        }
      );
      setUser(response.data.data.data);

      // Show success toast
      toast.success("Seller account request sent successfully!");

      // Wait for 3 seconds before navigating to the homepage
      setTimeout(() => {
        navigate("/user");
      }, 3000);
    } catch (error) {
      console.error("Error verifying seller:", error);
      toast.error("Failed to send seller account request.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <ToastContainer />
      <h1 className="font-bold text-2xl mb-4">Verify And Submit</h1>

      <p>
        Our team will verify your seller profile in 24 hours and we will notify
        you via email at {user.email}.
      </p>
      <button
        onClick={handleSubmit}
        className={`bg-violet-900 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded mr-2 mt-4 ${
          isLoading ? "loading" : ""
        }`}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? "Submitting..." : "Verify And Submit"}
      </button>

      {/* Loader */}
      {isLoading && (
        <div className="loader"></div> // Your loader class here
      )}
    </div>
  );
}

export default VerifyAndSubmit;
