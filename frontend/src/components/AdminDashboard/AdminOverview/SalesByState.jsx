function SalesByState({ adminStats }) {
  const salesByState = adminStats.ordersByState;
  return (
    <div>
      <div className="m-2 text-2xl">&#x20B9;{adminStats.totalIncome}</div>
      <div className="bg-white rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full ">
            <tbody>
              {salesByState?.length > 0 ? (
                salesByState?.map((s, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px" }}>{s.state}</td>

                    <td style={{ padding: "8px" }}>{s.totalOrders}</td>
                    <td style={{ padding: "8px" }}>{s.totalIncome}</td>
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
    </div>
  );
}

export default SalesByState;
