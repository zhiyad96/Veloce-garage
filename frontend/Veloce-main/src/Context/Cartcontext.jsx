import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../service/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Authcontext } from "./Authcontext";

export const Cartcontext = createContext();

function Cartprovider({ children }) {
  const [cart, setCart] = useState([]);
  const { user, loading } = useContext(Authcontext);
  const [cartlength, setCartLength] = useState(0);

  const navigate = useNavigate();

  // ------------------------------------------renderpage-----------------------------------
  useEffect(() => {
    if (loading) return;

    if (user?.id) {
      fetchCart();
    } else {
      setCart([]);
      setCartLength(0);
    }
  }, [user]);

  // ---------------- Add to cart ----------------
  const addtocart = async (product) => {
    if (!user?.id) {
      toast.error("Please log in to add items to cart");
      navigate("/login");
      return;
    }

    try {
      await api.post(`carts/`, {
        product: product.id,
        quantity: 1,
      });
      toast.success("added to cart");
      fetchCart();
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to update cart");
    }
  };

  const fetchCart = async () => {
    try {
      const res = await api.get("carts/");

      setCart(res.data?.items || []);
      setCartLength(res.data?.items?.length || 0);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- Quantity ----------------
  const updateQty = async (cartid, delta) => {
    const item = cart.find((i) => i.id === cartid);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);

    try {
      await api.put(`cartitem/${cartid}/`, {
        quantity: newQty,
      });
      toast.success("Quantity updated");
      fetchCart();
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to update quantity");
    }
  };

  const increaseQty = (cartid) => updateQty(cartid, 1);
  const decreaseQty = (cartid) => updateQty(cartid, -1);

  // ---------------- Remove from cart ----------------
  const removecart = async (cartid) => {
    if (!user?.id) return;

    try {
      await api.delete(`cartitem/${cartid}/`);
      fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = async (total, addressId, buyNowProduct = null) => {
    if (!addressId) {
      toast.error("Please select a shipping address");
      return;
    }

    const amount = Number(total || 0);
    if (amount <= 0) {
      toast.error("Invalid checkout amount");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Payment gateway failed to load");
      return;
    }

    try {
      const payload = buyNowProduct?.id
        ? {
            mode: "buy_now",
            item: { product_id: buyNowProduct.id, quantity: 1 },
            address_id: Number(addressId),
          }
        : {
            mode: "cart",
            address_id: Number(addressId),
          };

      // ✅ Use the correct endpoint
      const res = await api.post("checkout/create-order/", payload);

      const razorpayData = res.data.razorpay;

      const key = razorpayData.key;
      const orderId = razorpayData.order_id;
      const orderAmount = razorpayData.amount;
      if (!key || !orderId || !orderAmount) {
        throw new Error("Invalid payment response from server");
      }

      const options = {
        key,
        amount: orderAmount,
        currency: "INR",
        name: "Veloce Garage",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response) {
          // ✅ Use the correct verify endpoint
          await api.post("checkout/verify/", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          setCart([]);
          fetchCart();
          toast.success("Payment Successful");
          navigate("/OrederHistory");
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("🔥 FULL ERROR:", error);
  console.log("🔥 BACKEND DATA:", error.response?.data);
  alert(JSON.stringify(error.response?.data));
      const data = error.response?.data;
      let errorMessage =
        data?.detail ||
        data?.message ||
        data?.error ||
        (typeof data === "string" ? data : null);

      if (!errorMessage && data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const firstValue = data[firstKey];
        errorMessage = Array.isArray(firstValue)
          ? String(firstValue[0])
          : typeof firstValue === "string"
          ? firstValue
          : null;
      }

      toast.error(errorMessage || "Payment failed");
    }
  };

  return (
    <Cartcontext.Provider
      value={{
        cart,
        cartlength,
        setCart,
        addtocart,
        removecart,
        increaseQty,
        decreaseQty,
        fetchCart,
        handleCheckout,
      }}
    >
      {children}
    </Cartcontext.Provider>
  );
}

export default Cartprovider;
