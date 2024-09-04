function TopSellingProductsSection({ topSellingProducts }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Top-Selling Products</h3>
      <ul className="list-disc list-inside">
        {topSellingProducts.map((product) => (
          <li key={product.productId} className="text-gray-700">
            {product.name}: {product.totalSold} units sold
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopSellingProductsSection;
