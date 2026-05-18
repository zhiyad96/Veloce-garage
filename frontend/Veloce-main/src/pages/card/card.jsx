import React, { useEffect, useRef, useState } from "react";
import { api } from "../../service/api";
import { useNavigate } from "react-router-dom";

const formatPrice = (value) => {
  const amount = Number(value || 0);
  return `Rs ${amount.toLocaleString("en-IN")}`;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?auto=format&fit=crop&w=900&q=80";

const normalizeProductsPayload = (payload) => {
  if (Array.isArray(payload)) {
    return {
      results: payload,
      count: payload.length,
    };
  }

  if (Array.isArray(payload?.results)) {
    return {
      ...payload,
      results: payload.results,
      count: Number(payload?.count ?? payload.results.length),
    };
  }

  return {
    results: [],
    count: 0,
  };
};

export default function Card() {
  const [products, setProducts] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("products/");
        setProducts(normalizeProductsPayload(res.data));
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featured =
    products?.results?.filter((item) => Boolean(item && item.id)).slice(0, 10) ||
    [];

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    const cardWidth = window.innerWidth < 768 ? 260 : 340;
    scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    const cardWidth = window.innerWidth < 768 ? 260 : 340;
    scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[var(--surface-soft)] py-14 sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(220,38,38,0.15),transparent_32%),radial-gradient(circle_at_85%_85%,rgba(17,24,39,0.25),transparent_38%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Curated Inventory</p>
          <h2 className="font-display mt-3 text-4xl uppercase tracking-wide text-zinc-900 sm:text-5xl">
            Machines With Character
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600 sm:text-base">
            Discover handpicked builds and premium parts trusted by performance enthusiasts and
            workshop professionals.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-x-5 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-lg transition-colors hover:bg-zinc-100 md:flex"
            aria-label="Scroll left"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 translate-x-5 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-lg transition-colors hover:bg-zinc-100 md:flex"
            aria-label="Scroll right"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={scrollContainerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="h-[360px] w-[260px] flex-shrink-0 animate-pulse rounded-3xl border border-zinc-200 bg-white p-4 sm:w-[300px]"
                  >
                    <div className="h-44 rounded-2xl bg-zinc-200" />
                    <div className="mt-4 h-5 w-3/4 rounded bg-zinc-200" />
                    <div className="mt-3 h-4 w-2/5 rounded bg-zinc-200" />
                    <div className="mt-6 h-10 rounded-xl bg-zinc-200" />
                  </div>
                ))
              : products?.results?.map((item) => (
                  <article
                    key={item.id}
                    className="group h-[360px] w-[260px] flex-shrink-0 snap-center overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[300px]"
                  >
                    <button
                      className="h-full w-full text-left"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <div className="relative h-44 overflow-hidden bg-zinc-100">
                        <img
                          src={item.images?.[0]?.image || fallbackImage}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                          Featured
                        </span>
                      </div>

                      <div className="flex h-[calc(100%-11rem)] flex-col p-4">
                        <h3 className="line-clamp-2 text-lg font-bold leading-tight text-zinc-900">{item.name}</h3>
                        <p className="mt-2 text-sm font-semibold text-red-700">{formatPrice(item.price)}</p>
                        <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                          Workshop-approved quality with fast dispatch from Veloce Garage.
                        </p>
                        <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-zinc-800">
                          View Details
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </div>
                    </button>
                  </article>
                ))}
          </div>
        </div>

        {featured.length > 0 && (
          <div className="mt-14">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-3xl uppercase text-zinc-900">Quick Picks</h3>
              <button
                onClick={() => navigate("/product")}
                className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {featured.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <img
                    src={item.images?.[0]?.image || fallbackImage}
                    alt={item.name}
                    className="h-24 w-full object-cover sm:h-28"
                  />
                  <div className="p-3">
                    <h4 className="line-clamp-2 text-sm font-semibold text-zinc-900">{item.name}</h4>
                    <p className="mt-1 text-xs font-bold text-zinc-700">{formatPrice(item.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
