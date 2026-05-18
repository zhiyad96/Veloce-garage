import React, { useContext, useState, useEffect } from "react";
import { Cartcontext } from "../Context/Cartcontext";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../service/api";
import toast from "react-hot-toast";



function Cart() {
  const navigate = useNavigate();
  const { cart, removecart, increaseQty, decreaseQty } =
    useContext(Cartcontext);

  const total = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="text-lg text-gray-600">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <Link
                to="/product"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Explore Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:flex-1">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <div className="p-6 flex flex-col sm:flex-row gap-4">
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                      />
                      <div className="flex-grow flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.product_name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 mt-auto">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              className="px-4 text-gray-600"
                            >
                              -
                            </button>
                            <span className="px-4 py-2 text-gray-900 font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQty(item.id)}
                              className="px-4 text-gray-600"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-lg text-gray-600 font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            onClick={() => removecart(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ----------------Order Summary---------------- */}
            <div className="lg:w-80">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                <h2 className="text-xl text-black font-bold mb-4">
                  Order Summary
                </h2>

                <div className="flex justify-between text-black mb-2">
                  <span>Items</span>
                  <span>{cart.length}</span>
                </div>

                <div className="flex justify-between text-black mb-4">
                  <span>Total</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => navigate("/checkout", { state: { total } })}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
