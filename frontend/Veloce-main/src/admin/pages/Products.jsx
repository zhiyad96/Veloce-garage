import React, { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  Search,
  Filter,
  Package,
  Star,
  Eye,
  ChevronRight,
  Tag,
  Box,
} from "lucide-react";
import { api } from "../../service/api";
import toast from "react-hot-toast";
import Sidebar from "../components/side";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    images: [{ image: "" }],
    category: "",
    description: "",
    is_active: true,
    stock: "",
  });
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("searchTerm") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [category, setcategory] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState(localStorage.getItem("sortOption") || "default",);
  const [totalPages, settotalpage] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [totalproducts,settotalproducts]=useState(0)
  const [inventry,setinventry]=useState(0)
  const [stockcount, setstockcount]=useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
    fetchcatagories();
  }, [debouncedSearch, selectedCategory, sortOption]);

  const images = editProduct?.images || [];
  const img = images[currentImageIndex];

  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
    localStorage.setItem("sortOption", sortOption);
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [searchTerm, sortOption, selectedCategory]);

console.log(totalproducts)
  
  // Fetch Products
  const fetchProducts = async (page = 1) => {
    try {
      const res = await api.get(
        `products/?page=${page}&search=${debouncedSearch}&category=${selectedCategory}&sort=${sortOption}`,
      );
      setProducts(res.data.results);
      const total = res.data.count;
       settotalproducts(res.data.total_products)
       setinventry(res.data.total_value)
       setstockcount(res.data.is_active)
  settotalpage(Math.ceil(total / 8));
     setCurrentPage(page)
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
    }
  };


  const nextPage = () => {
    if (currentPage < totalPages){
      const next=currentPage+1
      setCurrentPage(next)
      fetchProducts(next)
    }
  };
  const prevPage = () => {
    if (currentPage > 1){
      const pre =currentPage-1
      setCurrentPage(pre)
      fetchProducts(pre)
    }
  };


  const goToPage = (pageNumber) =>{
    setCurrentPage(pageNumber)
    fetchProducts(pageNumber)
  }

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);


  
  const fetchcatagories = async () => {
    try {
      const res = await api.get("category/");
      setcategory(res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add Product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Name and price are required!");
      return;
    }
    try {
      const res = await api.post("products/", newProduct);
      setProducts([res.data, ...products]);
      toast.success("Product added successfully!");
      setNewProduct({
        name: "",
        price: "",
        images: [{ image: "" }],
        category: "",
        description: "",
        stock: "",
        is_active: "",
      });
      setShowAddModal(false);
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  // Edit Product
  const handleSaveEdit = async () => {
    if (!editProduct.name || !editProduct.price) {
      toast.error("Name and price are required!");
      return;
    }

    try {
      const res = await api.patch(`products/${editProduct.id}/`, editProduct);
      setProducts(
        products.map((p) => (p.id === editProduct.id ? res.data : p)),
      );
      toast.success("Product updated successfully!");
      setEditProduct(null);
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  // Delete Product
  const handleDelete = async () => {
    try {
      await api.delete(`products/${productToDelete.id}/`);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      toast.success("Product deleted successfully!");
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  // Stats
  // const totalProducts = products.length;
  const totalValue = inventry;
  const inStockCount = stockcount

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Product Catalog
              </h1>
              <p className="text-gray-600 mt-2">
                {totalproducts} products in your inventory
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              <span className="font-semibold">Add New Product</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {totalproducts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Inventory Value
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    ₹{totalValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Box className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">In Stock</p>
                  <p className="text-xl font-bold text-gray-900">
                    {inStockCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search products by name, brand, or description..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg   text-gray-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <Filter
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800"
                    size={16}
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg  text-gray-800 appearance-none"
                  >
                    <option value="all">All Categories</option>
                    {category.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 rotate-90"
                    size={16}
                  />
                </div>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg   text-gray-800"
                >
                  <option value="newest">All</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="name-a-z">Name: A to Z</option>
                  <option value="name-z-a">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Results info */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>
                of{" "}
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>{" "}
                products
              </p>
            </div>
          </div>
        </div>

        {/* Products List */}
        {products.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or add a new product
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Add First Product
            </button>
          </div>
        ) : (
          // List View Only
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* List Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="col-span-5 font-medium text-sm text-gray-700">
                Product
              </div>
              <div className="col-span-2 font-medium text-sm text-gray-700">
                Category
              </div>
              <div className="col-span-2 font-medium text-sm text-gray-700">
                Status
              </div>
              <div className="col-span-3 font-medium text-sm text-gray-700 text-right">
                Actions
              </div>
            </div>

            {/* List Items */}
            <div className="divide-y divide-gray-100">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Desktop View */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center">
                    <div className="col-span-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={product.images[0]?.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {product.description || "No description"}
                              </p>
                              {product.stock && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Stock: {product.stock}
                                </p>
                              )}
                            </div>
                            <span className="text-lg font-bold text-gray-900 ml-4">
                              ₹{product.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      {product.category ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          <Tag size={12} />
                          {product.category}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Uncategorized
                        </span>
                      )}
                    </div>

                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          product.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <Box size={12} />
                        {product.is_active ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <div className="col-span-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditProduct(product)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(product);
                            setShowDeleteModal(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.images[0]?.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {product.description || "No description"}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            ₹{product.price}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-3 mb-3">
                          {product.category && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                              <Tag size={10} />
                              {product.category}
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              product.stock
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <Box size={10} />
                            {product.stock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => setEditProduct(product)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setProductToDelete(product);
                              setShowDeleteModal(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}




              {totalPages > 1 && (
					<div className="flex flex-col sm:flex-row items-center justify-center  space-y-4 sm:space-y-0">
						<div className="flex items-center space-x-2">
							<button
								onClick={prevPage}
								disabled={currentPage === 1}
								className={`px-4 h-7 rounded-lg border ${
									currentPage === 1
										? 'bg-gray-100 text-gray-400 cursor-not-allowed'
										: 'bg-gray-600/90 text-white '
								}`}
							>
								Previous
							</button>

							<div className="flex items-center space-x-1">
								{pageNumbers.map((number) => (
									<button
										key={number}
										onClick={() => goToPage(number)}
										className={`w-5 h-7 rounded-lg ${
											currentPage === number
												? 'bg-gray-600/90 text-white'
												: 'bg-gray-600/90 text-white'
										}`}
									>
										{number}
									</button>
								))}
							</div>

							<button
								onClick={nextPage}
								disabled={currentPage === totalPages}
								className={`px-4 h-7 rounded-lg border ${
									currentPage === totalPages
										? 'bg-gray-400 text-black cursor-not-allowed'
										: 'bg-gray-600/90 text-black'
								}`}
							>
								Next
							</button>
						</div>
					</div>
				)}



            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Product
                </h2>
                <button
                  onClick={() => setEditProduct(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg  text-black transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-gray-800"
                      value={editProduct.name}
                      onChange={(e) =>
                        setEditProduct({ ...editProduct, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-gray-800"
                      value={editProduct.price}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>

                  <div className="flex flex-col gap-2">
                    {img && (
                      <img
                        src={img.image}
                        className="w-16 h-16 object-cover rounded"
                        alt=""
                      />
                    )}

                    <input
                      type="text"
                      value={img?.image || ""}
                      onChange={(e) => {
                        const updatedImages = [...images];
                        updatedImages[currentImageIndex].image = e.target.value;

                        setEditProduct({
                          ...editProduct,
                          images: updatedImages,
                        });
                      }}
                      className="w-full px-3 py-2 border rounded text-gray-800"
                    />

                    <div className="flex justify-between">
                      <button
                        disabled={currentImageIndex === 0}
                        onClick={() => setCurrentImageIndex((prev) => prev - 1)}
                        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                      >
                        Prev
                      </button>

                      <button
                        disabled={currentImageIndex === images.length - 1}
                        onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                        className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                      value={editProduct.category}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          category: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-gray-800 resize-none"
                    value={editProduct.description}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={editProduct.in_stock}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        in_stock: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="inStock" className="text-sm text-gray-700">
                    In Stock
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setEditProduct(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/30 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Product
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {Object.keys(newProduct)
                  .filter((key) => key !== "in_stock" && key !== "images")
                  .map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key.replace("_", " ")}
                      </label>
                      <input
                        type={key === "price" ? "number" : "text"}
                        placeholder={`Enter product ${key.replace("_", " ")}`}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-gray-800"
                        value={newProduct[key]}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            [key]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>

                  <div className="flex flex-col gap-2">
                    {newProduct.images?.map((img, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        {/* Preview */}
                        {img.image && (
                          <img
                            src={img.image}
                            className="w-12 h-12 object-cover rounded"
                            alt=""
                          />
                        )}

                        {/* INPUT (IMPORTANT 🔥) */}
                        <input
                          type="text"
                          placeholder="Enter image URL"
                          value={img.image}
                          onChange={(e) => {
                            const updatedImages = [...newProduct.images];
                            updatedImages[index].image = e.target.value;

                            setNewProduct({
                              ...newProduct,
                              images: updatedImages,
                            });
                          }}
                          className="flex-1 px-3 py-2 border rounded text-gray-800"
                        />

                        {/* DELETE */}
                        <button
                          onClick={() => {
                            const updatedImages = newProduct.images.filter(
                              (_, i) => i !== index,
                            );

                            setNewProduct({
                              ...newProduct,
                              images: updatedImages.length
                                ? updatedImages
                                : [{ image: "" }],
                            });
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          X
                        </button>
                      </div>
                    ))}

                    {/* ADD BUTTON */}
                    <button
                      onClick={() =>
                        setNewProduct({
                          ...newProduct,
                          images: [...newProduct.images, { image: "" }],
                        })
                      }
                      className="px-3 py-2 bg-green-600 text-white rounded"
                    >
                      + Add Image
                    </button>
                  </div>
                </div>




                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="newInStock"
                    checked={newProduct.is_active}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        is_active: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="newInStock" className="text-sm text-gray-700">
                    is_active
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 font-medium"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && productToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Delete Product
                </h2>
                <p className="text-gray-600 mb-2">
                  Are you sure you want to delete{" "}
                  <strong className="text-gray-900">
                    "{productToDelete.name}"
                  </strong>
                  ?
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  This action cannot be undone.
                </p>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setProductToDelete(null);
                    }}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/30 font-medium"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
