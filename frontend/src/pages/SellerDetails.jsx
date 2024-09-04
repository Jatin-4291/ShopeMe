import { useState } from "react";
import { useUser } from "../contexts/userContext";
import AccountCreation from "../components/SellerDetails/AccountCreation";
function SellerDetails() {
  const { user } = useUser();
  const [activeStep, setActiveStep] = useState(1); // Default to step 1

  // Function to determine the background color based on active step
  const getStepClass = (step) => {
    return step === activeStep
      ? "bg-violet-900 text-white"
      : "bg-gray-300 text-gray-700";
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-1/5 bg-violet-900">
        <div className="font-bold text-3xl m-5 mt-10 text-yellow-400">
          Seller Hub
          <div className="font-medium text-white text-xl">
            <span>by</span>
            <span className="font-bold"> ApniDukan</span>
          </div>
        </div>
        <div className="bg-violet-800 mt-8 h-[600px]">
          <p className="text-xl font-bold text-white m-4 mt-8">
            <span className="m-1">Grow your business</span>
            <span className="m-1">with ApniDukan</span>
          </p>
          <div className="m-4 text-white font-normal text-sm">
            <p>
              Offer your customers the delight of your products and the
              convenience of home deliveries!
            </p>
          </div>
          <div className="m-4 mt-8 text-white font-normal">
            <p className="font-bold text-md">Need Assistance!</p>
            <p className="text-xs mt-2 ml-2">Connect with</p>
            <a
              className="text-xs ml-2"
              href="mailto:seller-support@blinkit.com"
            >
              seller-support@blinkit.com
            </a>
          </div>
        </div>
        <div>
          <p className="mt-2 ml-4 text-white text-sm">{user.email}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-1/5 bg-gray-100 px-4 py-6 relative">
        <div className="bg-gray-200 text-lg font-bold m-0">
          <p className="mt-4 ml-4 mr-4">
            Complete these steps for easy onboarding
          </p>
        </div>
        <div className="flex flex-col pl-4">
          <div className="border-l-2 border-gray-300 pl-4">
            <div className="flex items-center mb-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass(
                  1
                )}`}
              >
                1
              </div>
              <div className="ml-4">
                <p className="font-bold">Account Creation</p>
                <p className="text-sm text-gray-600">Create your account</p>
              </div>
            </div>
            <div className="flex items-center mb-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass(
                  2
                )}`}
              >
                2
              </div>
              <div className="ml-4">
                <p className="font-bold">Seller Details</p>
                <p className="text-sm text-gray-600">
                  Provide seller information
                </p>
              </div>
            </div>
            <div className="flex items-center mb-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass(
                  3
                )}`}
              >
                3
              </div>
              <div className="ml-4">
                <p className="font-bold">Brand Details</p>
                <p className="text-sm text-gray-600">Add brand information</p>
              </div>
            </div>
            <div className="flex items-center mb-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass(
                  4
                )}`}
              >
                4
              </div>
              <div className="ml-4">
                <p className="font-bold">Bank Details</p>
                <p className="text-sm text-gray-600">
                  Enter bank account details
                </p>
              </div>
            </div>
            <div className="flex items-center mb-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass(
                  5
                )}`}
              >
                5
              </div>
              <div className="ml-4">
                <p className="font-bold">Shipping Locations</p>
                <p className="text-sm text-gray-600">
                  Specify shipping regions
                </p>
              </div>
            </div>
            <div className="flex items-center mb-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass(
                  6
                )}`}
              >
                6
              </div>
              <div className="ml-4">
                <p className="font-bold">Digital Signature</p>
                <p className="text-sm text-gray-600">Upload your signature</p>
              </div>
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass(
                  7
                )}`}
              >
                7
              </div>
              <div className="ml-4">
                <p className="font-bold">Verify and Submit</p>
                <p className="text-sm text-gray-600">
                  Review and submit your details
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty Div for Layout Adjustment */}
      <div className="w-3/5 bg-gray-50">
        {activeStep == 1 && <AccountCreation />}
      </div>
    </div>
  );
}

export default SellerDetails;
