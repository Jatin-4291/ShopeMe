import React from "react";

function AdminTopSeller({ adminStats }) {
  console.log(adminStats);

  const sellers = adminStats?.topSellers;
  console.log(sellers);

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">Seller</th>
              <th className="text-left py-3 px-4 font-semibold">Categories</th>
              <th className="text-left py-3 px-4 font-semibold">
                Total Income
              </th>
            </tr>
          </thead>
          <tbody>
            {sellers?.length > 0 ? (
              sellers?.map((seller) => (
                <tr key={seller._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{seller.sellerName}</td>
                  <td className="py-2 px-4 border-b">
                    {seller.sellerProducts}
                  </td>
                  <td className="py-2 px-4 border-b">₹{seller.totalIncome}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-2 px-4 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTopSeller;
