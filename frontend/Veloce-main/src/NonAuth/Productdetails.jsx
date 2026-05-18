import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../service/api";
import { Cartcontext } from "../Context/Cartcontext";
import { Wishcontext } from "../Context/Wishlistcontext";
import Footer from "../pages/Footer";

const fallbackImage =
  "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?auto=format&fit=crop&w=900&q=80";

const formatPrice = (value) => {
  const amount = Number(value || 0);
  return `Rs ${amount.toLocaleString("en-IN")}`;
};

function Productdetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { wish, addtowish } = useContext(Wishcontext);
  const { cart, increaseQty, decreaseQty, addtocart } = useContext(Cartcontext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`products/${id}/`);
        setProduct(res.data);
      } catch (err) {
        console.log(err.response?.data || err.message);
        setError("Unable to load this product right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const galleryImages = useMemo(() => {
    const images = (product?.images || []).map((img) => img?.image).filter(Boolean);
    return images.length > 0 ? images : [fallbackImage];
  }, [product]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [galleryImages.length, id]);

  const incart = cart.find((item) => Number(item.product) === Number(product?.id));
  const isWishlisted = wish.some((item) => Number(item.product) === Number(product?.id));

  const mainImage = galleryImages[Math.min(activeImageIndex, galleryImages.length - 1)] || fallbackImage;

  const showPreviousImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const showNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface-soft)] pt-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="h-[480px] animate-pulse rounded-3xl bg-zinc-200" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-200" />
            <div className="h-8 w-1/3 animate-pulse rounded bg-zinc-200" />
            <div className="h-28 animate-pulse rounded bg-zinc-200" />
            <div className="h-12 animate-pulse rounded bg-zinc-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[var(--surface-soft)] pt-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            {error || "Product not found."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-soft)] pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl">
          <div className="grid grid-cols-1 gap-8 p-5 sm:p-7 lg:grid-cols-2 lg:gap-12 lg:p-10">
            <div>
              <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100">
                <img
                  src={mainImage}
                  alt={product?.name}
                  className="h-[320px] w-full object-cover sm:h-[440px]"
                />

                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={showPreviousImage}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow hover:bg-white"
                      aria-label="Previous image"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={showNextImage}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow hover:bg-white"
                      aria-label="Next image"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                      {activeImageIndex + 1} / {galleryImages.length}
                    </span>
                  </>
                )}
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {galleryImages.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    onClick={() => setActiveImageIndex(index)}
                    className={`overflow-hidden rounded-xl border transition-all ${
                      activeImageIndex === index
                        ? "border-zinc-900 ring-2 ring-zinc-900/20"
                        : "border-zinc-200 hover:border-zinc-400"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={img} alt={`${product?.name} ${index + 1}`} className="h-16 w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Veloce Collection</p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-zinc-900 sm:text-4xl">{product.name}</h1>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-3xl font-bold text-red-700">{formatPrice(product.price)}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    product.is_active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {product.is_active ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-600">
                {product?.description || "No description available for this product yet."}
              </div>

              <div className="mt-5">
                <button
                  onClick={() => addtowish(product)}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
                >
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>
              </div>

              {incart ? (
                <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-sm font-semibold text-zinc-700">Quantity in cart</p>
                  <div className="mt-3 flex items-center gap-4">
                    <button
                      onClick={() => decreaseQty(incart.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold text-zinc-900">{incart.quantity}</span>
                    <button
                      onClick={() => increaseQty(incart.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700"
                    >
                      +
                    </button>
                    <button
                      onClick={() => navigate("/cart")}
                      className="ml-auto rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Go To Cart
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <button
                    onClick={() => addtocart(product)}
                    className="w-full rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-black"
                  >
                    Add To Cart
                  </button>
                </div>
              )}

              <div className="mt-3">
                <button
                  onClick={() => {
                    if (!product?.id) return;
                    navigate("/checkout", {
                      state: {
                        product,
                        total: Number(product.price || 0),
                      },
                    });
                  }}
                  className="w-full rounded-xl bg-red-700 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-600"
                >
                  Buy Now
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:grid-cols-3">
                <span>Fast Delivery</span>
                <span>Secure Payment</span>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Productdetails;
