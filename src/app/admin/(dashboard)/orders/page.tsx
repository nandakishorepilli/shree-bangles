import { getOrders } from "@/services/orderService";
import { formatPrice } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-blush-900">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-blush-400">No orders placed yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-blush-100 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-blush-900">{order.customerName}</p>
                  <p className="text-xs text-blush-400">
                    {order.email} · {order.phone}
                  </p>
                </div>
                <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-medium text-blush-700">{order.status}</span>
              </div>
              <p className="mb-3 text-sm text-blush-600">
                {order.address}, {order.city}, {order.state} {order.pincode}
              </p>
              <ul className="space-y-1 text-sm">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.productName} × {item.quantity} {[item.color, item.size].filter(Boolean).join(" / ")}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t border-blush-50 pt-3 text-right font-semibold text-blush-800">
                Total: {formatPrice(order.totalAmount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
