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
} from "@/components/ui/card";
import api from "../../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminSettings() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
    bankName: user?.bankName || "",
    accountNumber: user?.accountNumber || "",
    ifscCode: user?.ifscCode || "",
    accountHolderName: user?.accountHolderName || "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await api.patch(`/users/${user._id}`, formData);
      toast.success("Admin details updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Error updating admin details: " + error.message);
      setIsEditing(false);
    }
  };

  return (
    <div>
      <div className="w-full h-14 shadow-md bg-white m-2 border rounded-lg">
        <p className="text-xl text-violet-900 font-bold mt-4 ml-4">Settings</p>
      </div>
      <Card className="w-full mt-2 bg-white shadow-md rounded-md">
        <CardHeader>
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
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 ${
                isEditing ? "" : "pointer-events-none opacity-70"
              }`}
            >
              <div>
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                  />
                ) : (
                  <p>{formData.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                  />
                ) : (
                  <p>{formData.lastName}</p>
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
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                {isEditing ? (
                  <Input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="text"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                  />
                ) : (
                  <p>{formData.mobileNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-violet-900">
              Payment Details
            </h2>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 ${
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
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Enter your bank name"
                  />
                ) : (
                  <p>{formData.bankName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                {isEditing ? (
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter your account number"
                  />
                ) : (
                  <p>{formData.accountNumber}</p>
                )}
              </div>
              <div>
                <Label htmlFor="ifscCode">IFSC Code</Label>
                {isEditing ? (
                  <Input
                    id="ifscCode"
                    name="ifscCode"
                    type="text"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    placeholder="Enter your IFSC code"
                  />
                ) : (
                  <p>{formData.ifscCode}</p>
                )}
              </div>
              <div>
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                {isEditing ? (
                  <Input
                    id="accountHolderName"
                    name="accountHolderName"
                    type="text"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    placeholder="Enter your IFSC code"
                  />
                ) : (
                  <p>{formData.accountHolderName}</p>
                )}
              </div>
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
        <ToastContainer />
      </Card>
    </div>
  );
}

export default AdminSettings;
