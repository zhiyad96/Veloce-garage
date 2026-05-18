import React, { useState, useRef, useEffect, useContext } from "react";
import logo from "../assets/logo.jpg";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaRegHeart, FaBars, FaTimes } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Authcontext } from "../Context/Authcontext";
import { Cartcontext } from "../Context/Cartcontext";
import { Wishcontext } from "../Context/Wishlistcontext";
import ProfileModal from "../NonAuth/profile/profileview";

export default function Navbar() {
  const { user, logout } = useContext(Authcontext);
  const { cart } = useContext(Cartcontext);
  const { wish } = useContext(Wishcontext);

  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const quantity = cart.reduce((total, item) => total + item.quantity, 0);

  const navClass = ({ isActive }) =>
    `text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${
      isActive ? "text-red-700" : "text-zinc-700 hover:text-red-700"
    }`;

  const closeMobileMenu = () => setMobileMenu(false);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3">
            <img
              src={logo}
              alt="Veloce Garage"
              className="h-11 w-11 rounded-xl object-cover shadow-md ring-1 ring-black/5"
            />
            <span className="hidden text-lg font-extrabold tracking-wide text-zinc-900 sm:block">
              VELOCE GARAGE
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
            <NavLink to="/product" className={navClass}>
              Shop
            </NavLink>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="relative rounded-lg p-2 transition-colors hover:bg-zinc-100">
              <FaRegHeart size={20} className="text-zinc-800" />
              {wish.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-700 text-xs font-semibold text-white">
                  {wish.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative rounded-lg p-2 transition-colors hover:bg-zinc-100">
              <FaShoppingCart size={20} className="text-zinc-800" />
              {quantity > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                  {quantity}
                </span>
              )}
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  setOpen((prev) => !prev);
                }}
                className="rounded-lg p-2 transition-colors hover:bg-zinc-100"
                aria-label="Profile menu"
              >
                {user ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold uppercase text-white">
                    {user.username?.charAt(0)?.toUpperCase()}
                  </div>
                ) : (
                  <CgProfile size={20} className="text-zinc-700" />
                )}
              </button>

              {open && user && (
                <div className="absolute right-0 mt-3 w-52 rounded-xl border border-zinc-700 bg-zinc-900 p-2 shadow-2xl">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowProfile(true);
                    }}
                    className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/OrederHistory");
                    }}
                    className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    Order History
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/20"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            <button
              className="rounded-lg p-2 transition-colors hover:bg-zinc-100 md:hidden"
              onClick={() => setMobileMenu((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenu ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm md:hidden">
            <div className="flex flex-col gap-3">
              <NavLink to="/" className={navClass} onClick={closeMobileMenu}>
                Home
              </NavLink>
              <NavLink to="/about" className={navClass} onClick={closeMobileMenu}>
                About
              </NavLink>
              <NavLink to="/product" className={navClass} onClick={closeMobileMenu}>
                Shop
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} user={user} />
    </>
  );
}
