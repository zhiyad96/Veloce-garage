import React, { useEffect, useState } from "react";
import Sidebar from "../components/side";
import { api } from "../../service/api";
import {
  Trash2,
  Filter,
  TrendingUp,
  Package,
  CheckCircle,
  Clock,
  Truck,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Area,
  Cell,
} from "recharts";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("week");
  const [totalrevenue, settotalrevenue] = useState([]);
  const [monthlyrevenue, setmonthlyrevenue] = useState(0);
  const [avg, setavg] = useState(0);


  useEffect(() => {
    const fetchproduct = async () => {
      api.get("adminorderview/").then((res) => {
        setOrders(res.data);
      });
    };
    fetchproduct();
  }, []);

  useEffect(() => {
    const fetchAvg = async () => {
      try {
        const res = await api.get("avg/");
        setavg(res.data.avg_order_value);
      } catch (err) {
        console.error("Avg fetch failed:", err);
      }
    };

    fetchAvg();
  }, []);

  useEffect(() => {
    const fetchrevenue = async () => {
      try {
        const res = await api.get("monthly-revenue/");
        setmonthlyrevenue(res.data);
        const total = res.data.reduce((sum, m) => sum + m.revenue, 0);

        settotalrevenue(total);
      } catch (err) {
        console.error("revenue fetch failed:", err.message);
      }
    };
    fetchrevenue();
  }, []);

  const handleRemoveOrder = async (orderId) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;
      const userRes = await api.get(`/users/${order.userId}`);
      const user = userRes.data;
      const updatedOrders = user.orders.filter((o) => o.id !== orderId);
      await api.put(`/users/${order.userId}`, {
        ...user,
        orders: updatedOrders,
      });
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success("Order cancelled successfully!");
    } catch {
      toast.error("Failed to remove order");
    }
  };




 const handleStatusChange = async (orderId, newStatus) => {


  try {
    await api.patch(`orders/${orderId}/cancel/`, {
      status: newStatus,
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );

    toast.success(`Order status updated to ${newStatus}`);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update status");
  }
};




  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const totalOrders = orders.length;
  // const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  // const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const conversionRate =
    totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;


  // Get time-based data
  const getTimeBasedData = () => {
  const dataMap = {};

  orders.forEach((order) => {
    const orderDate = new Date(order.created_at);
    let key;

    if (timeFilter === "week") {
      key = orderDate.toLocaleDateString("en-US", { weekday: "short" });
    } 
    
    else if (timeFilter === "month") {
      const week = Math.ceil(orderDate.getDate() / 7);
      key = `Week ${week}`;
    } 
    
    else if (timeFilter === "quarter") {
      key = orderDate.toLocaleDateString("en-US", { month: "short" });
    }

    if (!dataMap[key]) {
      dataMap[key] = {
        date: key,
        orders: 0,
        revenue: 0,
      };
    }

    dataMap[key].orders += 1;
    dataMap[key].revenue += Number(order.total_price) || 0;
  });

  return Object.values(dataMap).map((item) => ({
    ...item,
    avgValue: item.orders > 0 ? item.revenue / item.orders : 0,
  }));
};

  const timeData = getTimeBasedData();

  // Status data for bar chart
  const statusData = [
    { status: "Pending", count: pendingOrders, color: "#F59E0B", icon: Clock },
    {
      status: "Confirmed",
      count: orders.filter((o) => o.status === "Confirmed").length,
      color: "#3B82F6",
      icon: CheckCircle,
    },
    {
      status: "Shipping",
      count: orders.filter((o) => o.status === "Shipping").length,
      color: "#8B5CF6",
      icon: Truck,
    },
    {
      status: "Delivered",
      count: completedOrders,
      color: "#10B981",
      icon: CheckCircle,
    },
  ];

  // Product performance data
  const getProductPerformance = () => {
    const productMap = {};
    orders.forEach((order) => {
      order.items?.forEach((product) => {
        const key = product.name || product.id;
        if (!productMap[key]) {
          productMap[key] = {
            name: product.product_name,
            quantity: 0,
            revenue: 0,
            orders: 0,
          };
        }
        productMap[key].quantity += product.quantity || 1;
        productMap[key].revenue +=
          (product.price || 0) * (product.quantity || 1);
        productMap[key].orders += 1;
      });
    });
    return Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };



  const topProducts = getProductPerformance();

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={16} className="text-yellow-600" />;
      case "Confirmed":
        return <CheckCircle size={16} className="text-blue-600" />;
      case "Shipping":
        return <Truck size={16} className="text-indigo-600" />;
      case "Delivered":
        return <CheckCircle size={16} className="text-green-600" />;
      case "cancelled":
        return <CheckCircle size={16} className="text-red-500" />;
      default:
        return <Package size={16} />;
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}:</span>
              </div>
              <span className="font-medium">
                {entry.name === "Revenue" || entry.name === "avgValue"
                  ? `$${entry?.value}`
                  : entry?.value}
              </span>
              {console.log(payload)}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };





  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 bg-gray-800/90 bg-clip-text text-transparent">
            Orders Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Real-time order analytics and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            {
              title: "Total Orders",
              value: totalOrders,
              change: "+12.5%",
              icon: ShoppingBag,
              color: "blue",
              gradient: "from-blue-500 to-blue-600",
            },
            {
              title: "Total Revenue",
              value: totalrevenue,
              change: "+15.2%",
              icon: DollarSign,
              color: "green",
              gradient: "from-green-500 to-emerald-600",
            },
            {
              title: "Avg Order Value",
              value: avg.toFixed(1),
              change: "+8.3%",
              icon: TrendingUp,
              color: "purple",
              gradient: "from-purple-500 to-indigo-600",
            },
            {
              title: "Conversion Rate",
              value: `${conversionRate.toFixed(1)}%`,
              change: "+5.7%",
              icon: CheckCircle,
              color: "emerald",
              gradient: "from-emerald-500 to-teal-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs font-medium text-green-600">
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">
                      from last month
                    </span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Time Series Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                  Order Trends
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Performance over time
                </p>
              </div>
              <div className="flex gap-2 mt-3 sm:mt-0">
                {["week", "month", "quarter"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      timeFilter === period
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={timeData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorOrders"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#10B981"
                    fill="url(#colorOrders)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#1D4ED8" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-purple-600" />
                  Order Status Distribution
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Current order status overview
                </p>
              </div>
              <div className="text-sm text-gray-600">
                <Calendar className="w-5 h-5 inline mr-2" />
                Real-time
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="status"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    formatter={(value, name) => [
                      value,
                      name === "count" ? "Orders" : name,
                    ]}
                  />
                  <Bar
                    dataKey="count"
                    name="Orders"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {statusData.map((status, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {status.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">
                      {status.count}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({((status.count / totalOrders) * 100 || 0).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products & Orders Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Products */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Top Performing Products
            </h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Sold: {product.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${product.revenue.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.orders} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and track all orders
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                  <Filter size={16} className="text-gray-600" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-sm focus:outline-none text-gray-700"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  {filteredOrders.length} of {orders.length} orders
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 mt-2">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  No orders found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Address Name
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.slice(0, 8).map((order) => {
                      const totalQty = order.products?.reduce(
                        (sum, p) => sum + (p.quantity || 0),
                        0,
                      );
                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.id.toString().slice(-6)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-medium text-gray-900">
                              {order.address.full_name}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-900">
                                {/* {order.item} items */}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-bold text-gray-900">
                              ${order.total_price}
                              {console.log(order)}
                            </p>
                          </td>
                          <td className="py-4 px-4">

                            
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleStatusChange(order.id, e.target.value)
                                }
                                className={`text-sm px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 ${
                                  order.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800 focus:ring-yellow-500"
                                    : order.status === "Confirmed"
                                    ? "bg-blue-100 text-blue-800 focus:ring-blue-500"
                                    : order.status === "Shipping"
                                    ? "bg-indigo-100 text-indigo-800 focus:ring-indigo-500"
                                    :order.status ==="Delivered"
                                    ?"bg-green-100 text-green-800 focus:ring-green-500"
                                    :order.status==="cancelled" 
                                    ?"bg-red-100 text-red-800 focus:ring-red-500"
                                    : null
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipping">Shipping</option>
                                <option value="Delivered">Delivered</option>
                                <option value="cancelled">Canclled</option>
                              </select>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleRemoveOrder(order.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel Order"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
