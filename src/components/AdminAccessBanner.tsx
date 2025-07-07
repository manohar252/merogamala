import React from 'react';
import { Settings, ShoppingCart, MessageSquare, FileText } from 'lucide-react';

const AdminAccessBanner = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">🔧 Admin Features Available</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Admin Panel</span>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingCart className="h-4 w-4" />
              <span>Shopping Cart</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>Plant Requests</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>WhatsApp Expert</span>
            </div>
          </div>
          <p className="text-xs mt-2 opacity-90">
            Access admin panel at <strong>/admin</strong> | Demo: admin/admin123 + 2FA
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAccessBanner;