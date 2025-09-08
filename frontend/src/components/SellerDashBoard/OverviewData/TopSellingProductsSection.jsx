/* eslint-disable react/prop-types */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
function TopSellingProductsSection({ topSellingProducts }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const displayedProducts = topSellingProducts.slice(0, 2);
  const remainingProducts = topSellingProducts.slice(2);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Top-Selling Products
      </h3>
      <ul className="space-y-3">
        {displayedProducts.map((product) => (
          <li key={product.productId} className="flex items-center gap-4">
            <img
              className="w-12 h-12 object-cover rounded-lg"
              src={product.images[0]?.url}
              alt={product.name}
            />
            <div>
              <h4 className="text-md font-medium text-gray-900">
                {product.name}
              </h4>
              <p className="text-sm text-gray-500">
                {product.totalSold} units sold
              </p>
            </div>
          </li>
        ))}
      </ul>

      {remainingProducts.length > 0 && (
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
        >
          More
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>All Top-Selling Products</DialogTitle>
          </DialogHeader>
          <ul className="space-y-3 mt-4">
            {topSellingProducts.map((product) => (
              <li key={product.productId} className="flex items-center gap-4">
                <img
                  className="w-12 h-12 object-cover rounded-lg"
                  src={product.images[0]?.url}
                  alt={product.name}
                />
                <div>
                  <h4 className="text-md font-medium text-gray-900">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {product.totalSold} units sold
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TopSellingProductsSection;
