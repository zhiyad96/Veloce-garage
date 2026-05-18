import React, { useState, useContext, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart2,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "../../Context/Authcontext";
import { api } from "../../service/api";

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [admin, setAdmin] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(Authcontext);

  const menu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    { name: "Orders", icon: <ShoppingBag size={20} />, path: "/orders" },
    { name: "Users", icon: <Users size={20} />, path: "/users" },
    { name: "Products", icon: <BarChart2 size={20} />, path: "/products" },
  ];

  useEffect(() => {
    const fetch = async () => {
      try {
        const ress = await api.get("me/");
        setAdmin(ress.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-600/90 text-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-600 to-white flex items-center justify-center">
            <span className="text-sm font-bold">
              {admin?.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-semibold">{admin?.username}</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 rounded-md transition"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 h-screen bg-gray-800/90 text-white transition-all duration-500 ease-in-out shadow-2xl flex flex-col backdrop-blur-xl border-r border-white/5 z-40
          ${isHovered ? "w-72" : "w-20"} 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
        `}
      >
        <div className="relative flex items-center justify-center h-20 border-b border-white/10 mt-12 lg:mt-0">
          <div
            className={`transition-all duration-500 ${
              isHovered ? "scale-100 opacity-100" : "scale-90 opacity-80"
            }`}
          >
            {isHovered ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-black to-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-lg font-black">
                    {admin?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {admin?.username}
                  </h1>
                  <p className="text-xs text-gray-400">Management</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-black to-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-lg font-black">
                  {admin?.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-8 flex-1 px-3 space-y-2 overflow-y-auto">
          {menu.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  setIsOpen(false);
                  if (item.path) navigate(item.path);
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateX(4px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateX(0)")
                }
                className={`group relative flex items-center w-full ${
                  isHovered ? "gap-4 px-4" : "justify-center px-0"
                } py-3.5 rounded-xl text-gray-300 transition-all duration-300 ease-out ${
                  isActive
                    ? "bg-gradient-to-r  shadow-lg shadow-blue-500/10 border border-blue-500/20"
                    : "hover:bg-white/5 hover:text-white hover:scale-105"
                }`}
                title={!isHovered ? item.name : ""}
              >
                {isActive && isHovered && (
                  <div className="absolute left-0 w-1 h-8 bg-gradient-to-b " />
                )}

                <div
                  className={`transition-all duration-300 ${
                    !isActive
                      ? "group-hover:scale-110 group-hover:text-blue-400"
                      : ""
                  }`}
                >
                  {item.icon}
                </div>

                {isHovered && (
                  <span className="font-medium flex-1 text-left transition-all duration-300">
                    {item.name}
                  </span>
                )}

                {isHovered && (
                  <ChevronRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div
          className={`relative p-4 border-t border-white/10 transition-all duration-300`}
        >
          {isHovered ? (
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r  bg-gray-800  transition-all duration-300 group shadow-lg shadow-gray-500/10"
            >
              <LogOut
                size={18}
                className="group-hover:rotate-12 transition-transform duration-300"
              />
              <span className="font-medium">Logout</span>
            </button>
          ) : (
            <button
              onClick={logout}
              className="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r bg-gray-800  transition-all duration-300 group shadow-lg shadow-gray-500/10"
              title="Logout"
            >
              <LogOut
                size={18}
                className="group-hover:rotate-12 transition-transform duration-300"
              />
            </button>
          )}
          <p className="text-xs text-gray-500 font-mono text-center mt-3">
            v1.0.0
          </p>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
}
