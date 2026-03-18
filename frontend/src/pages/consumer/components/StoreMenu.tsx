import { useState, useEffect } from "react";
import { api } from "../../../api/client";
import { type Product } from "../../../types/Product";

interface StoreMenuProps {
  storeId: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function StoreMenu({ storeId }: StoreMenuProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/api/product?storeId=${storeId}`)
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, [storeId]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const isAdded = prev.find((i) => i.product.id === product.id);
      return isAdded
        ? prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          )
        : [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((i) => i.product.id !== id));

  const subtotal = cart.reduce(
    (acc, i) => acc + i.product.price * i.quantity,
    0,
  );
  const total = subtotal + 2000;

  const handleCheckout = async () => {
    if (!cart.length || !window.confirm("Place order?")) return;

    setSubmitting(true);
    try {
      await api.post("/api/order", {
        storeId,
        subtotal,
        total,
        tip: 2000,
        address: "Test #123",
        indications: "Leave at Door",
        Products: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
      });
      alert("Success!");
      window.location.reload();
    } catch (error) {
      alert("Error: " + error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex gap-12 w-full mx-auto">
      <div className="grid grid-cols-2 gap-8 flex-1">
        {products.map((p) => (
          <div
            key={p.id}
            className="border-2 border-blue p-6 bg-whiteflex flex-col "
          >
            <div className="flex-1 mb-4">
              <h2 className="text-blue text-3xl  mb-2">{p.name}</h2>
              <p className="text-black text-sm font-medium ">
                {p.description || "This item has no description"}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-blue">
              <h2 className="text-blue text-2xl font-bold ">${p.price}</h2>
              <button
                onClick={() => addToCart(p)}
                className="border-2 border-blue text-blue font-bold py-1 px-4 text-xs uppercase hover:bg-green cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="w-100 shrink-0">
        <div className="top-12 border-2 border-blue bg-white p-6 ">
          <h1 className="text-blue text-3xl mb-4 text-center border-b-2 border-dashed border-blue pb-2 uppercase">
            Your Order
          </h1>

          <div className="space-y-4 mb-6">
            {cart.map((i) => (
              <div key={i.product.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-bold uppercase">{i.product.name}</p>
                  <p className="text-gray-600">
                    {i.quantity} x ${i.product.price}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(i.product.id)}
                  className="text-red-500 font-bold hover:underline cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
            {!cart.length && (
              <p className="text-center text-gray-400 py-4">Cart is empty</p>
            )}
          </div>

          <div className="border-t-2 border-dashed border-blue pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tip:</span>
              <span>$2000</span>
            </div>
            <div className="flex justify-between font-bold text-xl bg-green text-blue p-2 border-2 border-blue mt-2">
              <span>TOTAL:</span>
              <span>${total}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={submitting || !cart.length}
            className="mt-6 w-full bg-blue border-2 border-blue text-white font-bold py-3 uppercase hover:bg-green hover:text-blue transition-all cursor-pointer disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
