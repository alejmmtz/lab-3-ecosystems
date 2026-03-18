import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api, getCurrentUser } from "../../api/client";
import { type Store } from "../../types/Store";
import { type Order } from "../../types/Order";

export default function Store() {
  const [store, setStore] = useState<Store | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
  });

  const user = getCurrentUser();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const storeResponse = await api.get("/api/store");
      const myStore = storeResponse.data.find(
        (store: Store) => store.ownerId === user?.id,
      );
      setStore(myStore);

      const orderResponse = await api.get("/api/order");
      setOrders(orderResponse.data);
    } catch (error) {
      console.error(error);
    }
  }, [user?.id]);

  useEffect(() => {
    let isUp = true;

    const loadData = async () => {
      if (isUp) {
        await fetchData();
      }
    };
    loadData();

    return () => {
      isUp = false;
    };
  }, [fetchData]);

  const handleCreateProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.post("/api/product", {
        ...product,
        price: Number(product.price),
      });
      alert("Creado");
      setProduct({ name: "", price: "", description: "" });
    } catch (error) {
      alert("Error:" + error);
    }
  };

  const toggleStatus = async () => {
    if (!store) return;
    const newStatus = store.status === "open" ? "closed" : "open";
    await api.patch(`/api/store/${store.id}`, { status: newStatus });
    setStore({ ...store, status: newStatus });
  };

  const acceptOrder = async (id: number) => {
    await api.patch(`/api/order/${id}`, { status: "accepted" });
    fetchData();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white min-h-screen pb-12 min-w-5xl">
      <nav className="px-12 py-6 flex justify-between items-center border-b-2 border-dashed border-blue ">
        <div>
          <h1 className="text-blue text-4xl font-black">HomeTaste</h1>
          <p className="text-black font-bold ">Store: {store?.name}</p>
        </div>
        <button
          onClick={logout}
          className="border-2 border-blue text-blue font-bold py-2 px-6 uppercase hover:bg-green "
        >
          Logout
        </button>
      </nav>

      <div className="p-12 w-8xl mx-auto flex gap-12">
        <div className="space-y-8 w-100 shrink-0">
          <div className="border-2 border-blue p-6 ">
            <h2 className="text-blue text-3xl mb-4 border-b-2 border-dashed border-blue">
              Status
            </h2>
            <div className="flex justify-between items-center">
              <span className="font-bold uppercase">{store?.status}</span>
              <button
                onClick={toggleStatus}
                className="bg-blue text-white p-2 uppercase font-bold text-xs border-2 border-blue hover:bg-green transition-all hover:text-blue"
              >
                Toggle
              </button>
            </div>
          </div>

          <div className="border-2 border-blue p-6">
            <h2 className="text-blue text-3xl mb-4 border-b-2 border-dashed border-blue">
              Add Item
            </h2>
            <form
              onSubmit={handleCreateProduct}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={product.name}
                onChange={(event) =>
                  setProduct({ ...product, name: event.target.value })
                }
                className="border-2 border-blue p-2 outline-none"
              />
              <input
                type="number"
                placeholder="Price"
                value={product.price}
                onChange={(event) =>
                  setProduct({ ...product, price: event.target.value })
                }
                className="border-2 border-blue p-2 outline-none"
              />
              <textarea
                placeholder="Description"
                value={product.description}
                onChange={(event) =>
                  setProduct({ ...product, description: event.target.value })
                }
                className="border-2 border-blue p-2 outline-none resize-none"
              />
              <button className="bg-green border-2 border-blue text-blue font-bold py-3 uppercase cursor-pointer">
                Save
              </button>
            </form>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-blue text-5xl mb-6 border-b-2 border-blue pb-2">
            Orders
          </h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border-2 border-blue p-6 flex justify-between items-center "
              >
                <div>
                  <h2 className="text-blue font-bold text-4xl">
                    Order #{order.id} - {order.status}
                  </h2>
                  <p className="text-sm">{order.address}</p>
                  <p className="font-bold text-blue">${order.total}</p>
                </div>
                {order.status === "pending" && (
                  <button
                    onClick={() => acceptOrder(order.id)}
                    className="border-2 border-blue bg-blue text-white py-2 px-4 uppercase hover:bg-green transition-all hover:text-blue cursor-pointer"
                  >
                    Accept
                  </button>
                )}
              </div>
            ))}
            {orders.length === 0 && (
              <div className="border-2 border-dashed border-blue p-8 text-center text-blue font-bold uppercase">
                No orders yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
