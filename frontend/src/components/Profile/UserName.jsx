import { useEffect, useState } from "react";
import { useUser } from "../../contexts/userContext";
import { CgProfile } from "react-icons/cg";

function UserName() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { isPhoto, user } = useUser();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [user]);
  console.log(user);

  console.log(firstName, user.firstName);

  return (
    <div className="w-full h-24 flex items-center bg-white shadow-md p-4 rounded-lg gap-3">
      <div>
        {isPhoto ? (
          <img
            src={user.photo}
            alt="Profile"
            className="object-cover w-16 h-16 rounded-full"
          />
        ) : (
          <CgProfile className="text-violet-900 w-16 h-16" />
        )}
      </div>
      <div>
        <p className=" text-sm">Hello,</p>
        <h1 className="text-xl">
          {firstName} {lastName}
        </h1>
      </div>
    </div>
  );
}

export default UserName;
