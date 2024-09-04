import { FaPlus } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { useUser } from "../../contexts/userContext";
import { useEffect, useState } from "react";
import EditAddressBox from "./EditAddressBox";

function ManageAddress() {
  const { user } = useUser();
  const address = user?.address;
  const [address_, setAddress_] = useState({
    hNo: "",
    street: "",
    area: "",
    district: "",
    state: "",
    pincode: "",
    landmark: "",
  });
  const [displayAddressBox, setDisplayAddressBox] = useState(false);

  const handleAddAddress = () => {
    setDisplayAddressBox(true);
  };

  useEffect(() => {
    if (address) {
      setAddress_(address);
    }
  }, [address]);

  console.log(address_);

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold">Manage Address</h1>
      <div className="w-4/5 h-12 border border-b-2 mt-4">
        <button
          onClick={handleAddAddress}
          className="mt-2 ml-6 text-violet-900 border border-none"
        >
          {!address ? (
            <div className="flex gap-3">
              <span>
                <FaPlus className="mt-1" />
              </span>
              ADD A NEW ADDRESS
            </div>
          ) : (
            <div className="flex gap-3">
              <span>
                <MdEdit className="mt-1" />
              </span>
              EDIT ADDRESS
            </div>
          )}
        </button>
      </div>
      {displayAddressBox && (
        <EditAddressBox setDisplayAddressBox={setDisplayAddressBox} />
      )}
      {address && (
        <div className="w-4/5 h-auto border border-b-2 mt-10 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Current Address</h2>
          <div className="flex gap-10 text-md font-semibold mt-4">
            <h1>
              {user.firstName} {user.lastName}
            </h1>
            <h1>{user.mobileNumber}</h1>
          </div>
          <p className="mt-2">
            {address_.hNo},{address_.street},{address_.area},{address_.district}{" "}
            {address_.state},{address_.pincode},{address_.landmark}
          </p>
        </div>
      )}
    </div>
  );
}

export default ManageAddress;
