import NameEdit from "./NameEdit";
import EmailEdit from "./EmailEdit";
import MobileEdit from "./MobileEdit";
import DeleteAcc from "./DeleteAcc";
import { useUser } from "../../contexts/userContext";
import { useState } from "react";
import { Link } from "react-router-dom";
function ProfileInfo() {
  const { user } = useUser();
  console.log(user);

  return (
    <div>
      <NameEdit />
      <EmailEdit />
      <MobileEdit />
      <button className="bg-violet-900 mt-4 px-5 py-2 text-lg font-medium text-white border border-violet-800 rounded-lg shadow-md hover: hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500">
        {user.roles === "seller" ? (
          <Link to="/seller/dashboard" className="text-center">
            Seller Dashboard
          </Link>
        ) : (
          <Link to="/user/seller-details" className="text-center">
            Become a Seller
          </Link>
        )}
      </button>

      <div className="mt-7">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">FAQs</h1>
          <p className="font-semibold mt-2 text-sm">
            What happens when I update my email address (or mobile number)?
          </p>
          <p className="mt-2 text-sm">
            Your login email id (or mobile number) changes, likewise. You'll
            receive all your account related communication on your updated email
            address (or mobile number).{" "}
          </p>
        </div>
        <div className="mb-6">
          <p className="font-semibold mt-2 text-sm">
            When will my Flipkart account be updated with the new email address
            (or mobile number)?{" "}
          </p>
          <p className="mt-2 text-sm">
            It happens as soon as you confirm the verification code sent to your
            email (or mobile) and save the changes.
          </p>
        </div>
        <p className="font-semibold mt-2 text-sm">
          What happens when I update my email address (or mobile number)?
        </p>
        <p className="mt-2 text-sm">
          Updating your email address (or mobile number) doesn't invalidate your
          account. Your account remains fully functional. You'll continue seeing
          your Order history, saved information and personal details
        </p>
      </div>
      <DeleteAcc />
    </div>
  );
}

export default ProfileInfo;
