import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api, getCurrentUser } from "../../api/client";
import { type Order } from "../../types/Order";

interface OrderPayload {
  status: string;
  deliveryId?: string;
}

export default function Delivery() {
  const [orders, setOrders] = useState<Order[]>([]);
  const user = getCurrentUser();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get("/api/order");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchOrders();
    };
    loadData();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const payload: OrderPayload = { status: newStatus };
      if (newStatus === "picked") payload.deliveryId = user?.id;

      await api.patch(`/api/order/${orderId}`, payload);
      fetchOrders();
    } catch (error) {
      alert("Error: " + error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white min-h-screen pb-12 min-w-5xl">
      <nav className="px-12 py-6 flex justify-between items-center border-b-2 border-dashed border-blue ">
        <div>
          <h1 className="text-blue text-4xl font-black">HomeTaste</h1>
          <p className="text-black font-bold ">
            Rider: {user?.name || "Guest"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="border-2 border-blue text-blue font-bold py-2 px-6 uppercase  hover:bg-green cursor-pointer"
        >
          Logout
        </button>
      </nav>

      <div className="p-12 w-full mx-auto">
        <h2 className="text-blue text-5xl mb-10 border-b-2 border-blue pb-4">
          Deliveries
        </h2>

        {orders.length === 0 ? (
          <div className="border-2 border-dashed border-blue p-12 text-center ">
            <p className="text-blue text-2xl font-bold uppercase">
              No orders available
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`border-2 border-blue p-6 flex flex-col justify-between  ${
                  order.status === "accepted"
                    ? "bg-white"
                    : order.status === "picked"
                      ? "bg-white"
                      : "bg-gray-100"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-blue font-bebas text-3xl">
                      Order #{order.id}
                    </h3>
                    <span className="border-2 border-blue px-2 py-1 text-xs font-bold uppercase">
                      {order.status}
                    </span>
                  </div>
                  <div className="border-t-2 border-dashed border-blue pt-4 mb-4">
                    <p className="text-blue text-lg font-medium">
                      {order.address}
                    </p>
                  </div>
                </div>

                {order.status === "accepted" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "picked")}
                    className="w-full border-2 border-blue bg-blue text-white font-bold py-3 uppercase hover:bg-green hover:text-blue cursor-pointer"
                  >
                    Accept Delivery
                  </button>
                )}

                {order.status === "picked" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "delivered")}
                    className="w-full border-2 border-blue bg-green text-blue font-bold py-3 uppercase hover:bg-blue hover:text-white cursor-pointer"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
