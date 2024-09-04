import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserName from "../components/Profile/UserName";
import { FaBox, FaChevronRight } from "react-icons/fa";
import { MdManageAccounts, MdFolderShared } from "react-icons/md";
import { AiOutlinePoweroff } from "react-icons/ai";
import ProfileInfo from "../components/Profile/ProfileInfo";
import ManageAddress from "../components/Profile/ManageAddress";

function Profile() {
  const [displayedComponent, setDisplayedComponent] = useState(null);

  const showProfileInfo = () => {
    setDisplayedComponent("profileInfo");
  };

  const showManageAddress = () => {
    setDisplayedComponent("manageAddress");
  };
  const showReviewAndRating = () => {};
  const showWishList = () => {};
  const showNotifications = () => {};

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-100 flex justify-center items-start pt-8">
        <div className="w-11/12 max-w-6xl p-6 flex bg-white shadow-md rounded-lg">
          <div className="w-2/6 pr-4 border-r border-gray-300">
            <UserName />
            <div className="mt-6">
              <div className="h-16 shadow-md bg-white border rounded-lg mt-5 cursor-pointer flex items-center gap-4 px-4 hover:bg-gray-100">
                <FaBox className="text-violet-900 text-3xl" />
                <h1 className="text-xl text-gray-700">My Orders</h1>
                <FaChevronRight className="text-xl text-violet-900 ml-auto" />
              </div>
              <div className="h-auto bg-white cursor-pointer mt-5 p-4 hover:bg-gray-100 rounded-lg">
                <div className="flex items-center gap-4">
                  <MdManageAccounts className="text-3xl text-violet-900" />
                  <h1 className="text-xl text-gray-700">Account Settings</h1>
                </div>
                <div className="ml-10 flex flex-col gap-3 mt-2 text-gray-600">
                  <p
                    onClick={showProfileInfo}
                    className="cursor-pointer hover:text-violet-700"
                  >
                    Profile Information
                  </p>
                  <p
                    onClick={showManageAddress}
                    className="cursor-pointer hover:text-violet-700"
                  >
                    Manage Address
                  </p>
                </div>
              </div>
              <div className="h-auto bg-white mt-5 p-4 hover:bg-gray-100 rounded-lg cursor-pointer">
                <div className="flex items-center gap-4">
                  <MdFolderShared className="text-3xl text-violet-900" />
                  <h1 className="text-xl text-gray-700">My Stuff</h1>
                </div>
                <div className="ml-10 flex flex-col gap-3 mt-2 text-gray-600">
                  <p
                    onClick={showReviewAndRating}
                    className="cursor-pointer hover:text-violet-700"
                  >
                    Reviews and Ratings
                  </p>
                  <p
                    onClick={showWishList}
                    className="cursor-pointer hover:text-violet-700"
                  >
                    WishList
                  </p>
                  <p
                    onClick={showNotifications}
                    className="cursor-pointer hover:text-violet-700"
                  >
                    All Notifications
                  </p>
                </div>
              </div>
              <Link to="/logout">
                <div className="h-16 mt-5 border rounded-lg shadow-md bg-white flex items-center gap-4 p-4 hover:bg-gray-100 cursor-pointer">
                  <AiOutlinePoweroff className="text-3xl text-violet-900" />
                  <h1 className="text-xl text-gray-700">Logout</h1>
                </div>
              </Link>
            </div>
          </div>
          <div className="w-4/6 pl-4">
            {displayedComponent === null && <ProfileInfo />}
            {displayedComponent === "profileInfo" && <ProfileInfo />}
            {displayedComponent === "manageAddress" && <ManageAddress />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
