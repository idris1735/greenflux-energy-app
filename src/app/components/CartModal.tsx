import React from "react";
import { Product } from "../data/mockProducts";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import Image from "next/image";
import { X } from "lucide-react";

interface CartModalProps {
  open: boolean;
  onClose: () => void;
  cart: Product[];
  onRemove: (id: string) => void;
}

const CartModal: React.FC<CartModalProps> = ({ open, onClose, cart, onRemove }) => {
  const total = cart.reduce((sum, p) => sum + p.price, 0);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200">
        <div className="relative p-6">
          {/* Close Icon */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Cart</h2>
          {cart.length === 0 ? (
            <div className="text-gray-400 text-center py-12">Your cart is empty.</div>
          ) : (
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {cart.map((product) => (
                <div key={product.id} className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="relative w-12 h-12 flex-shrink-0 rounded bg-gray-100">
                    <Image src={product.images[0]} alt={product.title} fill className="object-cover rounded" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{product.title}</div>
                    <div className="text-sm text-gray-500">₦{product.price.toLocaleString()}</div>
                  </div>
                  <button
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
                    onClick={() => onRemove(product.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex justify-between items-center">
            <span className="font-medium text-gray-700">Total</span>
            <span className="text-lg font-bold text-gray-900">₦{total.toLocaleString()}</span>
          </div>
          <div className="mt-6 flex gap-2">
            <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-md shadow-none" disabled={cart.length === 0}>
              Checkout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal; 