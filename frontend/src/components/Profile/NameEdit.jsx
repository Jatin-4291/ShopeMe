import { useState } from "react";
import { useUser } from "../../contexts/userContext";
import api from "../../utils/api.js";
import ClipLoader from "react-spinners/ClipLoader";

function NameEdit() {
  const [isEdit, setIsEdit] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const { user, setUser } = useUser();
  const id = user._id;

  const handleEdit = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const { data } = await api.patch(`/users/${id}`, {
        firstName,
        lastName,
      });
      console.log(data.data.data); // This should log the response data
      setUser(data.data.data); // Update the user context with the new data
      setIsEdit(false); // Exit edit mode
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false); // Stop loading
  };

  return (
    <div>
      <div className="flex gap-2">
        <h1 className="text-xl font-semibold m-2">Personal Information</h1>
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
          <form onSubmit={handleSubmit} className="flex gap-4 items-center">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-36 h-12 border border-gray-300 text-gray-400 text-center"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-36 h-12 border border-gray-300 text-gray-400 text-center "
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black h-12 w-20 flex justify-center items-center border rounded-md transition duration-300 ease-in-out"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <ClipLoader color={"#000"} loading={isLoading} size={20} />
              ) : (
                "Save"
              )}
            </button>
          </form>
        ) : (
          <div className="flex gap-4">
            <div className="w-36 h-12 border border-gray-300 text-gray-400 text-center">
              <p className="mt-2">{user.firstName}</p>
            </div>
            <div className="w-36 h-12 border border-gray-300 text-gray-300 text-center">
              <p className="mt-2">{user.lastName}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NameEdit;
