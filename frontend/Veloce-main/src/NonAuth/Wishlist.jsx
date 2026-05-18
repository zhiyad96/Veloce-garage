import React, { useContext } from "react";
import { Wishcontext } from "../Context/Wishlistcontext";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const navigate = useNavigate();
  const { wish, addtowish } = useContext(Wishcontext);
  console.log(wish)

  if (!wish) return null;
  	const handleProductClick = (productId) => navigate(`/product/${productId}`);


  return (
    <div className="pt-25 min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900  bg-clip-text text-transparent mb-4">
            Your Wishlist
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {wish.length === 0
              ? "Your wishlist is empty. Start adding items you love!"
              : `You have ${wish.length} item${wish.length > 1 ? "s" : ""} in your wishlist`}
          </p>
        </div>

        {/* Wishlist Items */}
        {wish.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wish.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                
              >
                <div className="relative overflow-hidden h-60" 
                onClick={()=>handleProductClick(product.product)}>
                  <img
                    src={product.image}
                    alt={product.product_name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                  {/* Remove Button */}

                  {product.price && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-gradient-to-r from-gray-600  text-white px-3 rounded-2xl font-bold text-sm shadow-lg">
                        ₹{product.price}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className=" font-bold text-gray-900 mb-3 line-clamp-2">
                    {product.product_name}
                  </h2>
                 
                  <button
                    onClick={() => addtowish({ id: product.product })}
                    className="mt-auto self-end text-sm font-semibold text-red-600 hover:text-red-700 transition"
                  >
                    Remove
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          null
        )}
      </div>
    </div>
  );
}

export default Wishlist;
