/* eslint-disable react/prop-types */

import { useState } from "react";
import { useUser } from "../../contexts/userContext";
import api from "../../utils/api";
function ShippingLocation({ onComplete }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    hNo: user?.address?.hNo || "",
    street: user?.address?.street || "",
    area: user?.address?.area || "",
    district: user?.address?.district || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    landmark: user?.address?.landmark || "",
  });
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
    setLoading(true);
    try {
      const res = await api.patch(
        `/users/${user._id}`,
        { address: formData } // Update only BankDetails field
      );
      setUser(res.data.data.data);
      setSuccessMessage("Bank details updated successfully");
      setErrorMessage(null);
      onComplete();
    } catch (error) {
      setErrorMessage(
        "There was an error updating the bank details. Please try again."
      );
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel action

  return (
    <div className="mt-4 w-ful">
      <div className="w-full h-[720px] bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Add Address</h2>
        {errorMessage && (
          <p className="text-red-500 mb-4" aria-live="polite">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="text-green-500 mb-4" aria-live="polite">
            {successMessage}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">House No</label>
              <input
                type="text"
                name="hNo"
                value={formData.hNo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Street</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Area</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Landmark</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-4 justify-end">
            <button
              type="submit"
              className={`bg-violet-900 text-white py-2 px-6 rounded-lg transition duration-200 shadow-md transform hover:scale-105 ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-violet-700"
              }`}
              disabled={loading}
            >
              {loading ? <div className="loader"></div> : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShippingLocation;
