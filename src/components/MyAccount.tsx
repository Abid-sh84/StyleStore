// File: components/MyAccount.tsx
import { X } from 'lucide-react';

interface MyAccountProps {
  user: { name: string; email: string };
  orderHistory: { id: number; productName: string; quantity: number; date: string }[];
  onClose: () => void;
}

export function MyAccount({ user, orderHistory, onClose }: MyAccountProps) {
  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50 overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">My Account</h2>
        <button onClick={onClose}><X /></button>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <hr />
        <div>
          <h3 className="text-lg font-semibold mb-2">Order History</h3>
          {orderHistory.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <ul className="space-y-2">
              {orderHistory.map(order => (
                <li key={order.id} className="border p-3 rounded-md shadow-sm">
                  <p><strong>Product:</strong> {order.productName}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
