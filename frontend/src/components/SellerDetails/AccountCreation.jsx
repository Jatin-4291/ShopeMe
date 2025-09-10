/* eslint-disable react/prop-types */

import { useState } from "react";
import { useUser } from "../../contexts/userContext";
import api from "../../utils/api";

function AccountCreation({ onComplete }) {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    gstNumber: user.gstNumber || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || null,
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false); // Track loading state

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
    setLoading(true); // Start loading
    try {
      const res = await api.patch(`/users/${user._id}`, formData);
      setUser(res.data.data.data);
      setSuccessMessage("Account updated successfully");
      setErrorMessage(null);
      setLoading(false); // Stop loading
      onComplete(); // Call onComplete function to move to the next step
    } catch (error) {
      setErrorMessage(
        "There was an error updating the account. Please try again."
      );
      setSuccessMessage(null);
      setLoading(false); // Stop loading
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
        {/* Loader */}
        {loading && (
          <div className="loader mx-auto my-4"></div> // Display loader
        )}
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
            disabled={loading} // Disable button while loading
            className={`bg-violet-900 text-white py-2 px-6 rounded-lg hover:bg-violet-700 transition duration-200 shadow-md transform ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccountCreation;
