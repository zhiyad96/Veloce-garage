import React, { useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Phone,
  Truck,
  UserRound,
  XCircle,
} from "lucide-react";
import { Authcontext } from "../../Context/Authcontext";
import { api } from "../../service/api";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Clock3,
  },
  paid: {
    label: "Paid",
    badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: CheckCircle2,
  },
  shipped: {
    label: "Shipped",
    badge: "bg-sky-100 text-sky-800 border-sky-200",
    icon: Truck,
  },
  shipping: {
    label: "Shipping",
    badge: "bg-sky-100 text-sky-800 border-sky-200",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    icon: XCircle,
  },
  default: {
    label: "Processing",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Package,
  },
};

const getStatusKey = (status) => String(status || "").toLowerCase();

const getStatusConfig = (status) => {
  const statusKey = getStatusKey(status);
  return STATUS_CONFIG[statusKey] || STATUS_CONFIG.default;
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Unknown date";

  const parsed = new Date(dateValue);

  if (Number.isNaN(parsed.getTime())) return "Unknown date";

  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
    parsed
  );
};

export default function OrderHistory() {
  const { user } = useContext(Authcontext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const socket = new WebSocket("ws://18.208.232.218:8000/ws/orders/");

    socket.onopen = () => {
      console.log("WebSocket Connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          Number(order.id) === Number(data.order_id)
            ? { ...order, status: data.status }
            : order
        )
      );
    };

    socket.onclose = () => {
      console.log("WebSocket Closed");
    };

    return () => {
      socket.close();
    };
  }, [user?.id]);

  const fetchOrders = async () => {
    if (!user?.id) return;

    setLoading(true);

    try {
      const { data } = await api.get("orders/");
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);

  const handleRemoveOrder = async (orderId) => {
    try {
      await api.patch(`orders/${orderId}/cancel/`);
      toast.success("Order canceled successfully!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    }
  };

  const summary = useMemo(() => {
    const deliveredOrders = orders.filter(
      (order) => getStatusKey(order.status) === "delivered"
    ).length;

    const activeOrders = orders.filter((order) =>
      ["pending", "paid", "shipping", "shipped"].includes(
        getStatusKey(order.status)
      )
    ).length;

    const totalItems = orders.reduce((orderTotal, order) => {
      const itemCount =
        order.items?.reduce(
          (itemTotal, item) => itemTotal + Number(item.quantity || 0),
          0
        ) || 0;

      return orderTotal + itemCount;
    }, 0);

    return { activeOrders, deliveredOrders, totalItems };
  }, [orders]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute top-24 right-0 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-20">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Order History
            </h1>
            
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2 backdrop-blur-sm">
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">
              <p className="text-xs text-slate-500">Orders</p>
              <p className="text-lg font-semibold text-slate-900">
                {orders.length}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">
              <p className="text-xs text-slate-500">Active</p>
              <p className="text-lg font-semibold text-slate-900">
                {summary.activeOrders}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">
              <p className="text-xs text-slate-500">Items</p>
              <p className="text-lg font-semibold text-slate-900">
                {summary.totalItems}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="mb-4 h-4 w-40 rounded bg-slate-200" />
                <div className="mb-3 h-3 w-64 rounded bg-slate-100" />
                <div className="h-3 w-52 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900">
              No orders found
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Once you place an order, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = getStatusConfig(order.status);
              const StatusIcon = status.icon;
              const statusKey = getStatusKey(order.status);
              const canCancel = ["pending", "paid"].includes(statusKey);

              return (
                <article
                  key={order.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500" />

                  <div className="space-y-5 p-5 md:p-6">
                    <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Order #{order.id}
                        </p>
                        <p className="inline-flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(order.created_at)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status.badge}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {status.label}
                      </span>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                      <section className="rounded-xl bg-slate-50 p-4">
                        <p className="mb-3 text-sm font-semibold text-slate-900">
                          Items
                        </p>

                        {order.items?.length ? (
                          <ul className="space-y-2">
                            {order.items.map((item) => (
                              <li
                                key={item.id}
                                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                              >
                                <span className="truncate pr-2">
                                  {item.product_name}
                                </span>
                                <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                                  x{item.quantity}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-500">
                            No items available for this order.
                          </p>
                        )}
                      </section>

                      <section className="rounded-xl bg-slate-50 p-4">
                        <p className="mb-3 text-sm font-semibold text-slate-900">
                          Shipping Address
                        </p>

                        <div className="space-y-1.5 text-sm text-slate-600">
                          <p className="flex items-center gap-2 font-medium text-slate-800">
                            <UserRound className="h-4 w-4 text-slate-500" />
                            {order.address?.full_name || "Not provided"}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-500" />
                            {order.address?.phone_number || "Not provided"}
                          </p>
                          <p className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
                            <span>
                              {order.address?.address_line_1 || "Address not provided"}
                              {order.address?.address_line_2
                                ? `, ${order.address.address_line_2}`
                                : ""}
                              {order.address?.city ? `, ${order.address.city}` : ""}
                              {order.address?.state ? `, ${order.address.state}` : ""}
                              {order.address?.country
                                ? `, ${order.address.country}`
                                : ""}
                              {order.address?.postal_code
                                ? ` - ${order.address.postal_code}`
                                : ""}
                            </span>
                          </p>
                        </div>
                      </section>
                    </div>

                    {canCancel && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRemoveOrder(order.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && summary.deliveredOrders > 0 && (
          <p className="mt-5 text-center text-xs text-slate-500">
            You have {summary.deliveredOrders} delivered order
            {summary.deliveredOrders > 1 ? "s" : ""}.
          </p>
        )}
      </div>
    </div>
  );
}
