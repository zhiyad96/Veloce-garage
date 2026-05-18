import React, { useContext, useEffect, useState } from "react";
import { api } from "../service/api";
import { useNavigate } from "react-router-dom";
import { Wishcontext } from "../Context/Wishlistcontext";

const productsPerPage = 8;
const fallbackImage =
  "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?auto=format&fit=crop&w=900&q=80";
const headerCarImages = [
  "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1800&q=80",
];

const SORT_OPTIONS = [
  { value: "default", label: "Relevance" },
  { value: "price-low-high", label: "Price -- Low to High" },
  { value: "price-high-low", label: "Price -- High to Low" },
  { value: "name-a-z", label: "Name -- A to Z" },
  { value: "name-z-a", label: "Name -- Z to A" },
];

const QUICK_BUDGETS = [
  { label: "Under Rs 5,000", min: "", max: "5000" },
  { label: "Rs 5,000 - Rs 15,000", min: "5000", max: "15000" },
  { label: "Rs 15,000 - Rs 40,000", min: "15000", max: "40000" },
  { label: "Above Rs 40,000", min: "40000", max: "" },
];

const formatPrice = (value) => {
  const amount = Number(value || 0);
  return `Rs ${amount.toLocaleString("en-IN")}`;
};

const normalizeBudgetValues = (minValue, maxValue) => {
  const hasMin = minValue !== "";
  const hasMax = maxValue !== "";

  let normalizedMin = hasMin ? String(Math.max(0, Number(minValue) || 0)) : "";
  let normalizedMax = hasMax ? String(Math.max(0, Number(maxValue) || 0)) : "";

  if (normalizedMin !== "" && normalizedMax !== "") {
    const minNumber = Number(normalizedMin);
    const maxNumber = Number(normalizedMax);

    if (minNumber > maxNumber) {
      normalizedMin = String(maxNumber);
      normalizedMax = String(minNumber);
    }
  }

  return { normalizedMin, normalizedMax };
};

const readStoredValue = (key, fallback = "") => {
  const storedValue = localStorage.getItem(key);

  if (
    storedValue === null ||
    storedValue === "null" ||
    storedValue === "undefined"
  ) {
    return fallback;
  }

  return storedValue;
};

const toList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
};

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

export default function Product() {
  const navigate = useNavigate();
  const { wish, addtowish } = useContext(Wishcontext);

  const [products, setProducts] = useState({ results: [], count: 0 });
  console.log(products)

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeHeaderImage, setActiveHeaderImage] = useState(0);

  const [searchTerm, setSearchTerm] = useState(readStoredValue("searchTerm"));
  const [sortOption, setSortOption] = useState(() => {
    const storedSort = readStoredValue("sortOption", "default");
    const validSort = SORT_OPTIONS.some(
      (option) => option.value === storedSort
    );

    return validSort ? storedSort : "default";
  });
  const [selectedCategory, setSelectedCategory] = useState(
    readStoredValue("selectedCategory", "all")
  );
  const [categories, setCategories] = useState([]);

  const [minPriceInput, setMinPriceInput] = useState(
    readStoredValue("minPriceInput")
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    readStoredValue("maxPriceInput")
  );
  const [appliedMinPrice, setAppliedMinPrice] = useState(
    readStoredValue("appliedMinPrice")
  );
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(
    readStoredValue("appliedMaxPrice")
  );

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.set("page", page);

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }

      if (selectedCategory !== "all") {
        params.set("category", selectedCategory);
      }

      if (sortOption !== "default") {
        params.set("sort", sortOption);
      }

      if (appliedMinPrice !== "") {
        params.set("min_price", appliedMinPrice);
      }

      if (appliedMaxPrice !== "") {
        params.set("max_price", appliedMaxPrice);
      }

      const response = await api.get(`products/?${params.toString()}`);
      const normalizedProducts = normalizeProductsPayload(response.data);

      setProducts(normalizedProducts);
      setTotalItems(normalizedProducts.count);
      setTotalPages(Math.ceil(normalizedProducts.count / productsPerPage));
    } catch (err) {
      console.log(err.response?.data || err.message);
      setError("Unable to load products right now. Please try again.");
      setProducts(response.data);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("category/");
      setCategories(toList(response.data));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all" || categories.length === 0) {
      return;
    }

    const selectedCategoryExists = categories.some(
      (category) => String(category.id) === String(selectedCategory)
    );

    if (!selectedCategoryExists) {
      setSelectedCategory("all");
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [
    currentPage,
    searchTerm,
    selectedCategory,
    sortOption,
    appliedMinPrice,
    appliedMaxPrice,
  ]);

  useEffect(() => {
    if (!loading && totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [loading, totalPages, currentPage]);

  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
    localStorage.setItem("sortOption", sortOption);
    localStorage.setItem("selectedCategory", selectedCategory);
    localStorage.setItem("minPriceInput", minPriceInput);
    localStorage.setItem("maxPriceInput", maxPriceInput);
    localStorage.setItem("appliedMinPrice", appliedMinPrice);
    localStorage.setItem("appliedMaxPrice", appliedMaxPrice);
  }, [
    searchTerm,
    sortOption,
    selectedCategory,
    minPriceInput,
    maxPriceInput,
    appliedMinPrice,
    appliedMaxPrice,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeaderImage((prev) => (prev + 1) % headerCarImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleProductClick = (productId) => navigate(`/product/${productId}`);

  const clearFilters = () => {
    setSearchTerm("");
    setSortOption("default");
    setSelectedCategory("all");
    setMinPriceInput("");
    setMaxPriceInput("");
    setAppliedMinPrice("");
    setAppliedMaxPrice("");
    setCurrentPage(1);
  };

  const applyBudgetFilter = () => {
    const { normalizedMin, normalizedMax } = normalizeBudgetValues(
      minPriceInput,
      maxPriceInput
    );

    setMinPriceInput(normalizedMin);
    setMaxPriceInput(normalizedMax);
    setAppliedMinPrice(normalizedMin);
    setAppliedMaxPrice(normalizedMax);
    setCurrentPage(1);
  };

  const applyQuickBudget = (range) => {
    const { normalizedMin, normalizedMax } = normalizeBudgetValues(
      range.min,
      range.max
    );

    setMinPriceInput(normalizedMin);
    setMaxPriceInput(normalizedMax);
    setAppliedMinPrice(normalizedMin);
    setAppliedMaxPrice(normalizedMax);
    setCurrentPage(1);
  };

  const onSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const onCategoryChange = (categoryId) => {
    setSelectedCategory(String(categoryId));
    setCurrentPage(1);
  };

  const onSortChange = (sortValue) => {
    setSortOption(sortValue);
    setCurrentPage(1);
  };

  const onBudgetInputChange = (setter) => (event) => {
    const nextValue = event.target.value.replace(/[^\d]/g, "");
    setter(nextValue);
  };

  const pageStart =
    totalItems === 0 ? 0 : (currentPage - 1) * productsPerPage + 1;
  const pageEnd = Math.min(currentPage * productsPerPage, totalItems);
const filteredProducts = products?.results || [];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--surface-soft)] pb-14 pt-24 sm:pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(220,38,38,0.13),transparent_35%),radial-gradient(circle_at_90%_85%,rgba(17,24,39,0.18),transparent_38%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200/80 bg-white/75 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="relative mb-7 overflow-hidden rounded-3xl border border-zinc-200 sm:mb-8">
            <div className="absolute inset-0">
              {headerCarImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt="Performance car"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                    index === activeHeaderImage ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-red-950/70" />

            <header className="relative px-5 py-10 text-center sm:px-8 sm:py-12">
              
              <h1 className="font-display mt-3 text-5xl uppercase leading-none text-white sm:text-6xl">
                Performance Market
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-200 sm:text-base">
                Browse premium parts and curated accessories built for speed,
                reliability, and daily driving confidence.
              </p>

              <div className="mt-5 flex items-center justify-center gap-2">
                {headerCarImages.map((_, index) => (
                  <button
                    key={`header-dot-${index}`}
                    onClick={() => setActiveHeaderImage(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeHeaderImage
                        ? "w-8 bg-white"
                        : "w-3 bg-white/50"
                    }`}
                    aria-label={`Show header image ${index + 1}`}
                  />
                ))}
              </div>
            </header>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
            <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-700">
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-red-700 hover:text-red-600"
                >
                  Clear All
                </button>
              </div>

              <section className="border-b border-zinc-200 py-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Search
                </h3>
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchTerm}
                  onChange={onSearchChange}
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition-all focus:border-zinc-500 focus:bg-white"
                />
              </section>

              <section className="border-b border-zinc-200 py-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Category
                </h3>
                <ul className="space-y-2">
                  <li>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                      <input
                        type="radio"
                        name="category-filter"
                        checked={selectedCategory === "all"}
                        onChange={() => onCategoryChange("all")}
                        className="h-4 w-4 accent-zinc-900"
                      />
                      All Categories
                    </label>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                        <input
                          type="radio"
                          name="category-filter"
                          checked={String(selectedCategory) === String(category.id)}
                          onChange={() => onCategoryChange(category.id)}
                          className="h-4 w-4 accent-zinc-900"
                        />
                        {category.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="border-b border-zinc-200 py-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Budget
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={onBudgetInputChange(setMinPriceInput)}
                    className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition-all focus:border-zinc-500 focus:bg-white"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={onBudgetInputChange(setMaxPriceInput)}
                    className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition-all focus:border-zinc-500 focus:bg-white"
                  />
                </div>

                <button
                  onClick={applyBudgetFilter}
                  className="mt-2 h-10 w-full rounded-lg bg-zinc-900 text-sm font-semibold text-white transition-colors hover:bg-black"
                >
                  Apply Budget
                </button>

                <ul className="mt-3 space-y-1.5">
                  {QUICK_BUDGETS.map((range) => (
                    <li key={range.label}>
                      <button
                        onClick={() => applyQuickBudget(range)}
                        className="w-full rounded-md bg-zinc-50 px-2 py-1.5 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                      >
                        {range.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="pt-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Sort By
                </h3>
                <ul className="space-y-2">
                  {SORT_OPTIONS.map((option) => (
                    <li key={option.value}>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                        <input
                          type="radio"
                          name="sort-filter"
                          checked={sortOption === option.value}
                          onChange={() => onSortChange(option.value)}
                          className="h-4 w-4 accent-zinc-900"
                        />
                        {option.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>

            <div>
              <div className="mb-5 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 sm:text-sm">
                    {loading
                      ? "Loading products"
                      : `Showing ${pageStart}-${pageEnd} of ${totalItems} products`}
                  </p>

                  {(appliedMinPrice !== "" || appliedMaxPrice !== "") && (
                    <p className="text-xs font-semibold text-zinc-700 sm:text-sm">
                      Budget: {appliedMinPrice === "" ? "0" : appliedMinPrice} - {" "}
                      {appliedMaxPrice === "" ? "Any" : appliedMaxPrice}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {loading &&
                  Array.from({ length: productsPerPage }).map((_, index) => (
                    <div
                      key={`product-skeleton-${index}`}
                      className="animate-pulse overflow-hidden rounded-3xl border border-zinc-200 bg-white p-4"
                    >
                      <div className="h-48 rounded-2xl bg-zinc-200" />
                      <div className="mt-4 h-4 w-3/4 rounded bg-zinc-200" />
                      <div className="mt-3 h-4 w-2/5 rounded bg-zinc-200" />
                      <div className="mt-4 h-9 rounded-xl bg-zinc-200" />
                    </div>
                  ))}

                {!loading && error && (
                  <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                {!loading && !error && products?.results?.length === 0 && (
                  <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-10 text-center">
                    <h2 className="font-display text-3xl uppercase text-zinc-900">
                      No Matches 
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500">
                      Try changing category, sort, or budget range to see more products.
                    </p>
                  </div>
                )}

                {!loading &&
                  !error &&
                  filteredProducts.map((product) => {
                    const isWishlisted = wish.some(
                      (item) => Number(item.product) === Number(product.id)
                    );

                    return (
                      <article
                        key={product.id}
                        className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <button
                          onClick={() => handleProductClick(product.id)}
                          className="block w-full text-left"
                        >
                          <div className="relative h-52 overflow-hidden bg-zinc-100">
                            <img
                              src={product.images?.[0]?.image || fallbackImage}
                              alt={product.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                              {product.is_active ? "In Stock" : "Out Of Stock"}
                            </span>

                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                addtowish(product);
                              }}
                              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow transition-transform hover:scale-105"
                              aria-label="Toggle wishlist"
                            >
                              {isWishlisted ? (
                                <svg
                                  className="h-5 w-5 text-red-600"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                              ) : (
                                <svg
                                  className="h-5 w-5 text-zinc-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>

                          <div className="p-4">
                            <h3 className="line-clamp-2 text-lg font-bold leading-tight text-zinc-900">
                              {product.name}
                            </h3>
                            <p className="mt-2 text-sm font-semibold text-red-700">
                              {formatPrice(product.price)}
                            </p>
                            <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                              Premium workshop-grade quality for daily drivers and
                              performance builds.
                            </p>

                            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-zinc-800">
                              View Details
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                            </div>
                          </div>
                        </button>
                      </article>
                    );
                  })}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                      currentPage === 1
                        ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400"
                        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition-colors ${
                          currentPage === number
                            ? "bg-zinc-900 text-white"
                            : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        {number}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                      currentPage === totalPages
                        ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400"
                        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
