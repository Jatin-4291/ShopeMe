function RevenueSection({ totalRevenue }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
      <p className="text-xl font-bold text-green-500">
        ${totalRevenue.toFixed(2)}
      </p>
    </div>
  );
}

export default RevenueSection;
