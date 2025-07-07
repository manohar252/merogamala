import React from 'react';

const ShopSection = () => {
  return (
    <section className="py-8 px-4">
      {/* 🛍️ Replace the content below with your product listings or shop items */}
      <h2 className="text-2xl font-bold mb-4">Our Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Example product card */}
        <div className="border p-4 rounded shadow text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Sample Product"
            className="w-full h-40 object-cover mb-2"
          />
          <h3 className="font-semibold">Product Name</h3>
          <p className="text-sm text-gray-600">Rs. 999</p>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
