import { useState } from "react";
import { useUser } from "../contexts/userContext";
import AccountCreation from "../components/SellerDetails/AccountCreation";
import BankDetails from "../components/SellerDetails/BankDetails";
import ShippingLocation from "../components/SellerDetails/ShippingLocation";
import DigitalSignature from "../components/SellerDetails/DigitalSignature";
import VerifyAndSubmit from "../components/SellerDetails/VerifyAndSubmit";
function SellerDetails() {
  const { user } = useUser();
  const [activeStep, setActiveStep] = useState(2); // Default to step 2

  // Step titles and descriptions
  const steps = [
    {
      title: "Account Creation",
    },
    {
      title: "Seller Details",
    },
    {
      title: "Bank Details",
    },
    {
      title: "Shipping Location",
    },
    {
      title: "Digital Signature",
    },
    {
      title: "Verify and Submit",
    },
  ];

  // Function to handle step completion
  const completeStep = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length)); // Move to the next step, max to the number of steps
  };

  // Function to determine the background color based on active step
  const getStepClass = (step) => {
    return step < activeStep
      ? "bg-violet-900 text-white" // Completed steps
      : step === activeStep
      ? "bg-violet-900 text-white" // Active step
      : "bg-gray-300 text-gray-700"; // Inactive steps
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
        <div className="bg-gray-100 text-lg font-bold m-0">
          <p className="mt-4 ml-4 mr-4">
            Complete these steps for easy onboarding
          </p>
        </div>
        <div className="flex flex-col mt-10">
          <div className="border-l-2 border-gray-300 pl-4">
            {steps.map((step, index) => (
              <div className="flex items-center mb-16" key={index}>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${getStepClass(
                    index + 1
                  )}`}
                >
                  {index + 1 < activeStep ? (
                    <span className="text-white">✓</span> // Tock for completed steps
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="ml-4">
                  <p
                    onClick={() =>
                      index + 1 < activeStep ? setActiveStep(index + 1) : null
                    } // Only allow click for previous steps
                    className={`font-bold ${
                      index + 1 < activeStep
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area for Current Step */}
      <div className="w-3/5 bg-gray-50">
        {activeStep === 2 && (
          <AccountCreation onComplete={completeStep} /> // Pass the completeStep function as a prop
        )}
        {activeStep === 3 && <BankDetails onComplete={completeStep} />}
        {activeStep === 4 && <ShippingLocation onComplete={completeStep} />}
        {activeStep === 5 && <DigitalSignature onComplete={completeStep} />}

        {activeStep === 6 && <VerifyAndSubmit />}

        {/* Continue for other steps... */}
      </div>
    </div>
  );
}

export default SellerDetails;
