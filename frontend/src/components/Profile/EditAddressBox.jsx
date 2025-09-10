import { useState } from "react";
import PropTypes from "prop-types";
import api from "../../utils/api.js";
import { useUser } from "../../contexts/userContext";
function EditAddressBox({ setDisplayAddressBox }) {
  const { user, setUser } = useUser();
  const id = user._id;
  const [address, setAddress] = useState({
    hNo: "",
    street: "",
    area: "",
    district: "",
    state: "",
    pincode: "",
    landmark: "",
  });
  const handleCancel = () => {
    setDisplayAddressBox(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Address submitted:", address);
    try {
      const { data } = await api.patch(`/users/${id}`, { address });
      console.log(data.data.data); // This should log the response data
      setDisplayAddressBox(false);
      setUser(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-6 w-full">
      <div className="w-full h-auto bg-violet-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">House No</label>
              <input
                type="text"
                name="hNo"
                value={address.hNo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Street</label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Area</label>
              <input
                type="text"
                name="area"
                value={address.area}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">District</label>
              <input
                type="text"
                name="district"
                value={address.district}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">State</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Landmark</label>
              <input
                type="text"
                name="landmark"
                value={address.landmark}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-4 justify-end">
            <button
              onClick={handleCancel}
              type="submit"
              className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
EditAddressBox.propTypes = {
  setDisplayAddressBox: PropTypes.func.isRequired,
};

export default EditAddressBox;
