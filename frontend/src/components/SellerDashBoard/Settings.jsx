import { useState } from "react";
import { useUser } from "../../contexts/userContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Settings() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: user?.firstName || "",
    email: user?.email || "",
    phoneNumber: user?.mobileNumber || "",
    bankDetails: user?.BankDetails || {
      bankName: "",
      ifscCode: "",
      accountNumber: "",
      accountHolderName: "",
    },
    address: user?.address || {
      area: "",
      country: "",
      district: "",
      hNo: "",
      landmark: "",
      state: "",
      street: "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      bankDetails: { ...formData.bankDetails, [name]: value },
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: { ...formData.address, [name]: value },
    });
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/v1/users/${user._id}`,
        formData
      );
      toast.success("Details updated successfully!"); // Use toast for success message
      setIsEditing(false);
    } catch (error) {
      toast.error("Error updating details: " + error.message); // Use toast for error message
      setIsEditing(false);
    }
  };

  return (
    <Card className="w-full mt-2 bg-white shadow-md rounded-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-violet-900">
          Seller Settings
        </CardTitle>
        <CardDescription>
          Manage and update your profile details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Personal Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-violet-900">
            Personal Details
          </h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ${
              isEditing ? "" : "pointer-events-none opacity-70"
            }`}
          >
            <div>
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              ) : (
                <p>{formData.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              ) : (
                <p>{formData.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              ) : (
                <p>{formData.phoneNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div>
          <h2 className="text-xl font-semibold text-violet-900">
            Bank Details
          </h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ${
              isEditing ? "" : "pointer-events-none opacity-70"
            }`}
          >
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              {isEditing ? (
                <Input
                  id="bankName"
                  name="bankName"
                  type="text"
                  value={formData.bankDetails.bankName}
                  onChange={handleBankChange}
                  placeholder="Enter bank name"
                />
              ) : (
                <p>{formData.bankDetails.bankName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              {isEditing ? (
                <Input
                  id="ifscCode"
                  name="ifscCode"
                  type="text"
                  value={formData.bankDetails.ifscCode}
                  onChange={handleBankChange}
                  placeholder="Enter IFSC code"
                />
              ) : (
                <p>{formData.bankDetails.ifscCode}</p>
              )}
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              {isEditing ? (
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleBankChange}
                  placeholder="Enter account number"
                />
              ) : (
                <p>{formData.bankDetails.accountNumber}</p>
              )}
            </div>
            <div>
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              {isEditing ? (
                <Input
                  id="accountHolderName"
                  name="accountHolderName"
                  type="text"
                  value={formData.bankDetails.accountHolderName}
                  onChange={handleBankChange}
                  placeholder="Enter account holder name"
                />
              ) : (
                <p>{formData.bankDetails.accountHolderName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div>
          <h2 className="text-xl font-semibold text-violet-900">Address</h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ${
              isEditing ? "" : "pointer-events-none opacity-70"
            }`}
          >
            <div>
              <Label htmlFor="area">Area</Label>
              {isEditing ? (
                <Input
                  id="area"
                  name="area"
                  type="text"
                  value={formData.address.area}
                  onChange={handleAddressChange}
                  placeholder="Enter area"
                />
              ) : (
                <p>{formData.address.area}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              {isEditing ? (
                <Input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  placeholder="Enter state"
                />
              ) : (
                <p>{formData.address.state}</p>
              )}
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              {isEditing ? (
                <Input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.address.country}
                  onChange={handleAddressChange}
                  placeholder="Enter country"
                />
              ) : (
                <p>{formData.address.country}</p>
              )}
            </div>
            {/* Add other address fields similarly... */}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {isEditing ? (
          <Button variant="default" onClick={handleSave}>
            Save
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </CardFooter>
      <ToastContainer /> {/* Add the ToastContainer here */}
    </Card>
  );
}

export default Settings;
