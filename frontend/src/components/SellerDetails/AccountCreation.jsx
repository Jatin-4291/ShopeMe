import { useState, useEffect } from "react";
import { useUser } from "../../contexts/userContext";
import axios from "axios";

function AccountCreation({ onComplete }) {
  const { user } = useUser();
  console.log(user);

  // Initialize form data with user information if available
  const [formData, setFormData] = useState({
    gstNumber: "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || null,
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/v1/users/${user._id}`,
        formData
      );
      setSuccessMessage("Account updated successfully");
      setErrorMessage(null);
      // onComplete(); // Call onComplete function to move to the next step
    } catch (error) {
      setErrorMessage(
        "There was an error updating the account. Please try again."
      );
      setSuccessMessage(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 h-screen rounded-lg">
      <p className="font-bold text-2xl mb-4">Create an Account</p>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block font-medium mb-1" htmlFor="gstNumber">
            GST Number
          </label>
          <input
            type="text"
            name="gstNumber"
            id="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-violet-900"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-violet-900"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-violet-900"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-violet-900"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="mobileNumber">
            Mobile Number
          </label>
          <input
            type="tel"
            name="mobileNumber"
            id="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-violet-900"
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-violet-900 text-white py-2 px-6 rounded-lg hover:bg-violet-700 transition duration-200 shadow-md transform hover:scale-105"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccountCreation;
