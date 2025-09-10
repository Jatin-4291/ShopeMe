/* eslint-disable react/prop-types */

import { useState } from "react";
import { useUser } from "../../contexts/userContext";
import api from "../../utils/api.js";
function BankDetails({ onComplete }) {
  const { user, setUser } = useUser();

  const [formData, setFormData] = useState({
    bankName: user?.BankDetails?.bankName || "",
    accountNumber: user?.BankDetails?.accountNumber || "",
    ifscCode: user?.BankDetails?.ifscCode || "",
    accountHolderName: user?.BankDetails?.accountHolderName || "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.patch(`/users/${user._id}`, {
        BankDetails: formData,
      });
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

  const InputField = ({ label, id, name, value, onChange }) => (
    <div>
      <label className="block font-medium mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        type="text"
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        required
        aria-label={label}
        className="w-full border border-gray-300 rounded-lg p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-violet-900"
      />
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 h-screen rounded-lg">
      <p className="font-bold text-2xl mb-4">Bank Details</p>
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
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <InputField
          label="Bank Name"
          id="bankName"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
        />
        <InputField
          label="Account Number"
          id="accountNumber"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
        />
        <InputField
          label="IFSC Code"
          id="ifscCode"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleChange}
        />
        <InputField
          label="Account Holder Name"
          id="accountHolderName"
          name="accountHolderName"
          value={formData.accountHolderName}
          onChange={handleChange}
        />
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className={`bg-violet-900 text-white py-2 px-6 rounded-lg transition duration-200 shadow-md transform hover:scale-105 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-violet-700"
            }`}
            disabled={loading}
          >
            {loading ? <div className="loader"></div> : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BankDetails;
