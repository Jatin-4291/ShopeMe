/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import api from "../../../../utils/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function VerifySellers() {
  const [error, setError] = useState(null); // Start with no error
  const [loading, setLoading] = useState(true); // Initially loading is true
  const [sellers, setSellers] = useState([]); // Initialize sellers as an empty array
  const [setTotalSellers] = useState(0); // Initialize total sellers
  const [searchQuery, setSearchQuery] = useState(""); // New state for search

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await api.get("/admin/unverified");
        setSellers(res.data.data.sellers || []); // Ensure empty array fallback
        setTotalSellers(res.data.data.totalSellers);
        setLoading(false); // Turn off loading state after fetching data
      } catch (err) {
        setError("Failed to load sellers data");
        setLoading(false); // Stop loading even if there's an error
      }
    };
    fetchSellers();
  }, [setTotalSellers]);

  const handleVerify = async (sellerId) => {
    try {
      const res = await api.patch(`/users/${sellerId}`, {
        isSellerAprooved: true,
        roles: "seller",
      });
      // Update the state to reflect that the seller is verified
      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller._id === sellerId
            ? { ...seller, isSellerAprooved: true }
            : seller
        )
      );
    } catch (err) {
      console.error("Error verifying seller:", err);
    }
  };

  // Filter sellers based on search query
  const filteredSellers = sellers.filter(
    (seller) =>
      `${seller.firstName} ${seller.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.mobileNumber.includes(searchQuery)
  );

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error if it exists
  }

  return (
    <div>
      <div className="w-full h-14 shadow-md bg-white m-2 border rounded-lg">
        <p className="text-xl text-violet-900 font-bold mt-4 ml-4">
          Seller Payment Management
        </p>
      </div>
      <div className="flex bg-white justify-between mt-4 p-2">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-md p-2 w-full sm:w-2/3"
        />
      </div>
      <Table>
        <TableCaption>A list of unverified sellers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>GST Number</TableHead>
            <TableHead>Bank Details</TableHead>
            <TableHead>Phone Number & Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSellers.map((seller) => (
            <TableRow key={seller._id}>
              <TableCell className="font-medium">
                {seller.firstName} {seller.lastName}
              </TableCell>
              <TableCell>{seller.gstNumber || "N/A"}</TableCell>
              <TableCell>
                {/* Display bank details vertically */}
                {seller.BankDetails ? (
                  <div className="flex flex-col">
                    <span>{seller.BankDetails.bankName}</span>
                    <span>{seller.BankDetails.accountNumber}</span>
                    <span>{seller.BankDetails.ifscCode}</span>
                    <span>{seller.BankDetails.accountHolderName}</span>
                  </div>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{seller.mobileNumber}</span>
                  <span>{seller.email}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {/* Display address details vertically */}
                {seller.address ? (
                  <div className="flex flex-col text-center">
                    <span>Hno-{seller.address.hNo}</span>
                    <span>Street-{seller.address.street}</span>
                    <span>Area-{seller.address.area}</span>
                    <span>District-{seller.address.district}</span>
                    <span>State-{seller.address.state}</span>
                  </div>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                {!seller.isSellerAprooved && (
                  <button
                    onClick={() => handleVerify(seller._id)}
                    className="flex flex-col text-violet-800 text-center"
                  >
                    Verify
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default VerifySellers;
