import React, { useState } from "react";

function AdminTopSeller({ adminStats }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategories, setCurrentCategories] = useState([]);

  const sellers = adminStats?.topSellers;

  const handleMoreClick = (categories) => {
    setCurrentCategories(categories);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentCategories([]);
  };

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
              sellers.map((seller) => (
                <tr key={seller._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{seller.sellerName}</td>
                  <td className="py-2 px-4 border-b">
                    {/* Display first 2 categories */}
                    {seller.sellerProducts.slice(0, 2).join(", ")}
                    {seller.sellerProducts.length > 2 && (
                      <>
                        {" "}
                        <button
                          className="text-violet-600 underline ml-1"
                          onClick={() => handleMoreClick(seller.sellerProducts)}
                        >
                          More
                        </button>
                      </>
                    )}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">All Categories</h3>
            <ul className="list-disc pl-5 mb-4">
              {currentCategories.map((category, index) => (
                <li key={index}>{category}</li>
              ))}
            </ul>
            <button
              className="bg-violet-600 text-white py-2 px-4 rounded hover:bg-violet-700"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTopSeller;
