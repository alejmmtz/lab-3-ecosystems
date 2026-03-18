import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, getCurrentUser } from "../../api/client";
import { type Order } from "../../types/Order";
import StoreList from "./components/StoreList";
import StoreMenu from "./components/StoreMenu";

export default function Consumer() {
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "consumer") {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    api
      .get("/api/order")
      .then((res) => setMyOrders(res.data))
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white min-h-screen">
      <nav className="px-12 py-6 flex justify-between items-center border-b-2 border-dashed border-blue ">
        <div>
          <h1 className="text-blue text-4xl">HomeTaste</h1>
          <p className="text-black font-bold text-sm mt-2">
            Consumer: {user?.name}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="border-2 border-blue text-blue font-bold py-2 px-6 uppercase text-sm hover:bg-green transition-all duration-300 cursor-pointer "
        >
          Logout
        </button>
      </nav>

      <div className="p-12">
        {!selectedStoreId ? (
          <>
            <div className="mb-8 border-b-2 border-blue pb-4">
              <h2 className="text-blue text-5xl">Stores</h2>
            </div>
            <StoreList onSelectStore={setSelectedStoreId} />
          </>
        ) : (
          <>
            <div className="mb-8 flex gap-4 border-b-2 border-blue pb-4">
              <button
                onClick={() => setSelectedStoreId(null)}
                className="border-2 border-blue bg-blue text-white font-bold py-2 px-4 uppercase text-sm hover:bg-green hover:text-blue transition-all duration-300 cursor-pointer"
              >
                Back
              </button>
              <h2 className="text-blue text-5xl ">Menu</h2>
            </div>
            <StoreMenu storeId={selectedStoreId} />
          </>
        )}

        <div className="mt-24 border-blue">
          <div className="mb-8 border-b-2 border-blue pb-4">
            <h2 className="text-blue text-5xl">My Orders</h2>
          </div>

          <div className="space-y-6">
            {myOrders.map((order) => (
              <div
                key={order.id}
                className="border-2 border-blue p-6 bg-white  flex justify-between items-center"
              >
                <div>
                  <h2 className="text-blue font-bold text-4xl uppercase">
                    Order #{order.id}
                  </h2>
                  <p className="text-black font-medium text-md">
                    Status:{" "}
                    <span className="text-blue uppercase">{order.status}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-2 italic">
                    {order.address}
                  </p>
                </div>
                <div className="text-right border-l-2 border-dashed border-blue pl-8">
                  <p className="text-blue text-4xl font-black">
                    ${order.total}
                  </p>
                  <p className="text-sm font-bold ">Paid Total</p>
                </div>
              </div>
            ))}

            {myOrders.length === 0 && (
              <div className="border-2 border-dashed border-blue p-12 text-center">
                <p className="text-blue text-xl font-bold ">
                  No orders placed yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
