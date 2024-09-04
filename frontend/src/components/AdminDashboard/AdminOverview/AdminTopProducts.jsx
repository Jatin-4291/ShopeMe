import React from "react";

function AdminTopSeller({ adminStats }) {
  console.log(adminStats);

  const products = adminStats?.topProducts;
  console.log(products);

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">Image</th>
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Price</th>
              <th className="text-left py-3 px-4 font-semibold">Sales</th>
            </tr>
          </thead>
          <tbody>
            {products?.length > 0 ? (
              products?.map((product) => (
                <tr key={product._id}>
                  <td style={{ padding: "8px" }}>
                    <img
                      src={product.productImage[0].url}
                      alt={product.productName}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td style={{ padding: "8px" }}>{product.productName}</td>

                  <td style={{ padding: "8px" }}>${product.productPrice}</td>
                  <td style={{ padding: "8px" }}>{product.totalSales}</td>
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
