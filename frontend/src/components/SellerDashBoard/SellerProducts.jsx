import { useState } from "react";
import AddProducts from "./AddProducts";
import MyProducts from "./MyProducts";
function SellerProducts() {
  const [activeTab, setActiveTab] = useState("my-products");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="flex h-screen m-0 p-0">
      <div className="w-full h-24 shadow-md bg-white  m-2 border rounded-lg">
        <p className="text-xl font-bold mt-4 ml-4">Products</p>
        <div className="flex gap-5 text-sm ml-4 mt-4">
          <div
            className={`cursor-pointer ${
              activeTab === "my-products" ? "border-b-2 border-violet-900" : ""
            }`}
            onClick={() => handleTabClick("my-products")}
          >
            My Products
          </div>
          <div
            className={`cursor-pointer ${
              activeTab === "add-product" ? "border-b-2 border-violet-900" : ""
            }`}
            onClick={() => handleTabClick("add-product")}
          >
            Add a Product
          </div>
        </div>
        <div className="flex-1 bg-gray-100 p-4">
          {activeTab === "my-products" && <MyProducts />}
          {activeTab === "add-product" && <AddProducts />}
        </div>
      </div>
    </div>
  );
}

export default SellerProducts;
