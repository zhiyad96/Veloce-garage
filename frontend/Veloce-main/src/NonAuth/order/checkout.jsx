import React, { useContext, useState, useEffect } from "react";
import { Cartcontext } from "../../Context/Cartcontext";
import { api } from "../../service/api";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

function Checkout() {
  const { handleCheckout } = useContext(Cartcontext);
  const location = useLocation();
  const buyNowProduct = location.state?.product || null;
  const total = Number(location.state?.total ?? buyNowProduct?.price ?? 0);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    full_name: "",
    phone_number: "",
    address_line_1: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  });



         // ==============================address fetching =================================
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await api.get("address/");
        setAddresses(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAddresses();
  }, []);

  
      // ========================================== add address ================================

  const handleAddAddress = async () => {
    try {
      const { data } = await api.post("address/", addressForm);

      toast.success("Address added");

      setAddresses([...addresses, data]);

      setSelectedAddressId(data.id);

      setShowAddressForm(false);

      setAddressForm({
        full_name: "",
        phone_number: "",
        address_line_1: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to add address");
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="lg:w-96">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <label className="block mb-2 font-semibold text-gray-600">
            Shipping Address
          </label>
          {showAddressForm && (
            <div className="border p-3 rounded mb-4 border-black">
              <input
                placeholder="Full Name"
                className="border border-black p-2 w-full text-black mb-2"
                value={addressForm.full_name}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, full_name: e.target.value })
                }
              />


              <input
                placeholder="Phone Number"
                className="border border-black p-2 w-full text-black mb-2"
                value={addressForm.phone_number}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    phone_number: e.target.value,
                  })
                }
              />


              <input
                placeholder="Address Line"
                className="border border-black p-2 w-full mb-2"
                value={addressForm.address_line_1}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    address_line_1: e.target.value,
                  })
                }
              />


              <input
                placeholder="City"
                className="border border-black p-2 w-full mb-2"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
              />


              <input
                placeholder="State"
                className="border border-black p-2 w-full mb-2"
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
              />


              <input
                placeholder="Country"
                className="border border-black p-2 w-full mb-2"
                value={addressForm.country}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, country: e.target.value })
                }
              />


              <input
                placeholder="Postal Code"
                className="border border-black p-2 w-full mb-2"
                value={addressForm.postal_code}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    postal_code: e.target.value,
                  })
                }
              />

              <button
                onClick={handleAddAddress}
                className="bg-gray-600 text-white px-3 py-2 rounded w-full"
              >
                Save Address
              </button>
            </div>
          )}


          <select
            value={selectedAddressId || ""}
            onChange={(e) => setSelectedAddressId(Number(e.target.value))}
            className="border border-black p-2 w-full text-black rounded mb-3"
          >
            <option value="">Select Address</option>

            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.full_name} - {addr.city}
              </option>
            ))}
          </select>


          <button
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="text-gray-800 text-sm mb-4"
          >
            + Add New Address
          </button>

          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total</span>

            <span className="text-lg font-semibold text-gray-900">
              ${total.toFixed(2)}
            </span>
          </div>
          <button
            disabled={!selectedAddressId || total <= 0}
            onClick={() => handleCheckout(total, selectedAddressId, buyNowProduct)}
            className={`w-full py-3 rounded-lg font-semibold
            
              ${
                !selectedAddressId || total <= 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-600 text-white"
              }
            `}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
