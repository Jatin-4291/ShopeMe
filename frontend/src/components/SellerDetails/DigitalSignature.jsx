/* eslint-disable react/prop-types */

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import api from "../../utils/api.js";
import { useUser } from "../../contexts/userContext";

function DigitalSignature({ onComplete }) {
  const { user, setUser } = useUser();
  const sigPad = useRef(null); // Ref to capture signature
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Function to clear the signature
  const clearSignature = () => {
    sigPad.current.clear();
  };

  // Function to save the signature
  const saveSignature = async () => {
    if (sigPad.current.isEmpty()) {
      alert("Please sign before submitting!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Get the signature as a blob
    const signatureBlob = await new Promise((resolve) =>
      sigPad.current.getCanvas().toBlob(resolve)
    );

    const formData = new FormData();
    formData.append("signature", signatureBlob, "signature.png");

    try {
      // Post the form data to your backend
      const response = await api.patch(
        `/users/signature/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.data.user);

      if (response.status === 200) {
        setSuccess(true); // Show success message
        setUser(response.data.data.user);
      } else {
        setError("Failed to save signature");
      }
    } catch (err) {
      console.error("Error saving signature:", err);
      setError("An error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="font-bold text-2xl mb-4">Digital Signature</h1>
      {user.sellerSignature ? (
        <div className="mt-10">
          <p className="p-2">Your Signature:</p>
          <img
            src={user.sellerSignature}
            alt="Signature"
            className="mt-2 border border-gray-300 rounded"
            style={{ maxWidth: "100%", maxHeight: "300px" }}
          />
          <button
            onClick={onComplete}
            className="bg-violet-900 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded mr-2 mt-4"
          >
            Next
          </button>
        </div>
      ) : (
        <div>
          <div className="mt-10">
            <p className="p-2">Sign here</p>
            <div className="flex items-center">
              <SignatureCanvas
                ref={sigPad}
                penColor="green"
                canvasProps={{
                  width: 500,
                  height: 100,
                  className: "outline border rounded-lg",
                }}
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={saveSignature}
              className="bg-violet-900 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded mr-2"
            >
              {isLoading ? "Saving..." : "Save Signature"}
            </button>
            <button
              onClick={clearSignature}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {success && (
        <p className="text-green-500 mt-4">Signature saved successfully!</p>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default DigitalSignature;
