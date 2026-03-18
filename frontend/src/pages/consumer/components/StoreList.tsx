import { useState, useEffect } from "react";
import { api } from "../../../api/client";
import { type Store } from "../../../types/Store";

interface StoreListProps {
  onSelectStore: (storeId: number) => void;
}

export default function StoreList({ onSelectStore }: StoreListProps) {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get("/api/store");
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-8 w-full">
      {stores.map((store) => (
        <div
          key={store.id}
          className={`border-2 border-blue p-6 flex flex-col bg-white transition-colors group  ${
            store.status === "open"
              ? "cursor-pointer "
              : "opacity-40 cursor-not-allowed"
          }`}
          onClick={() => store.status === "open" && onSelectStore(store.id)}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-blue text-3xl pr-4 uppercase">{store.name}</h2>
            <span
              className={`border-2 border-blue px-2 py-1 text-xs font-bold uppercase ${
                store.status === "open"
                  ? "bg-green text-blue"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {store.status}
            </span>
          </div>

          <button
            disabled={store.status !== "open"}
            className="mt-6 border-2 border-blue cursor-pointer text-blue bg-white font-bold py-2 px-4 uppercase text-xs group-hover:bg-blue group-hover:text-white transition-all disabled:opacity-0"
          >
            {store.status === "open" ? "View Menu" : "Closed"}
          </button>
        </div>
      ))}

      {stores.length === 0 && (
        <div className="col-span-full border-2 border-dashed border-blue p-12 text-center">
          <p className="text-blue text-2xl font-bold ">
            There are no stores in our App.
          </p>
        </div>
      )}
    </div>
  );
}
