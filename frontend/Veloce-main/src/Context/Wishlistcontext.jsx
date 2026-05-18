import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../service/api";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "./Authcontext";
import toast from "react-hot-toast";

export const Wishcontext = createContext();

function Wishlistprovider({ children }) {
  const { user } = useContext(Authcontext);
  const [wish, setwish] = useState([]);
  const [wishLoading, setWishLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchWish();
    } else {
      setwish([]);
    }
  }, [user]);

  const fetchWish = async () => {
    try {
      const res = await api.get("/wishlist/");
      setwish(res.data);
    } catch (err) {
      console.log("Wishlist fetch failed", err);
    }
  };

  // ------------------- Add/Remove from wishlist -------------------

  const addtowish = async (product) => {
    if (wishLoading) return;
    setWishLoading(true);

    if (!user?.id) {
      toast.error("Please log in to add items to wishlist");
      navigate("/login");
      setWishLoading(false);
      return;
    }

    try {
      const exists = wish.find((item) => item.product === product.id);

      if (exists) {
        await api.delete(`wishlist/${exists.id}/`);

        setwish((prev) => prev.filter((item) => item.product !== product.id));

        toast.success("Removed from wishlist");
      } else {
        const { data } = await api.post("wishlist/", {
          product: product.id,
        });

        setwish((prev) => [...prev, data]);

        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Wishlist update failed");
    } finally {
      setWishLoading(false);
    }
  };
  return (
    <Wishcontext.Provider value={{ wish, addtowish }}>
      {children}
    </Wishcontext.Provider>
  );
}

export default Wishlistprovider;
