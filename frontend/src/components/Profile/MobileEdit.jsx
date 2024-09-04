import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../contexts/userContext";
function MobileEdit() {
  const [isEdit, setIsEdit] = useState(false);
  const [mobile, setMobile] = useState("");
  const { user, setUser } = useUser();
  const id = user._id;

  const handleEdit = () => {
    setMobile(user.mobileNumber);
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        `http://127.0.0.1:8000/api/v1/users/${id}`,
        { mobile }
      );
      console.log(data.data.data); // This should log the response data
      setUser(data.data.data); // Update the user context with the new data
      setIsEdit(false); // Exit edit mode
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <div className="flex gap-2">
          <h1 className="text-xl font-semibold m-2">Mobile Number</h1>
          {isEdit ? (
            <button
              onClick={handleCancel}
              className="border border-none text-violet-900"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="border border-none text-violet-900"
            >
              Edit
            </button>
          )}
        </div>
        <div className="flex gap-4">
          {isEdit ? (
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-72 h-12 border border-gray-300 text-gray-400 text-center"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black h-12 w-20 flex justify-center items-center border rounded-md transition duration-300 ease-in-out">
                Save
              </button>
            </form>
          ) : (
            <div className="flex gap-4">
              <div className="w-72 h-12 border border-gray-300 text-gray-400 text-center">
                <p className="mt-2">{user.mobileNumber}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileEdit;
