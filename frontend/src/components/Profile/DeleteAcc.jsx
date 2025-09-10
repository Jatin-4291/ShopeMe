import { useState, useEffect } from "react";
import { useUser } from "../../contexts/userContext";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
function DeleteAcc() {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const id = user._id;
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.delete(`/users/${id}`);
      console.log(data.data.data); // This should log the response data
      setShowModal(false); // Close the modal on successful delete
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="mt-5">
      <button
        onClick={openModal}
        className="text-red-600 text-l border border-none"
      >
        Delete Account
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-xl mb-4">
              Are you sure you want to delete your account?
            </h2>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteAcc;
