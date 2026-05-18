import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Wrench } from "lucide-react";

const services = [
  "Engine Diagnostics",
  "Performance Tuning",
  "Brake and Suspension",
  "Ceramic Detailing",
  "Wheel and Tyre Setup",
  "Pre-Track Inspection",
];

const links = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/product" },
  { label: "About", to: "/about" },
  { label: "Wishlist", to: "/wishlist" },
];

const socials = [
  { label: "Facebook", icon: Facebook },
  { label: "Instagram", icon: Instagram },
  { label: "LinkedIn", icon: Linkedin },
];

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-zinc-950 text-zinc-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(185,28,28,0.22),transparent_33%),radial-gradient(circle_at_85%_90%,rgba(120,53,15,0.28),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">
              <Wrench size={14} />
              Veloce Garage
            </div>
            <h3 className="font-display text-4xl uppercase text-white">Driven By Craft</h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              We combine workshop precision with premium customer care to keep every machine at
              peak form. Walk-ins, scheduled diagnostics, and fast dispatch are available all week.
            </p>

            <div className="mt-6 space-y-3 text-sm text-zinc-300">
              <p className="flex items-center gap-3">
                <MapPin size={16} className="text-red-400" />
                14/2 Performance Street, Bangalore
              </p>
              <p className="flex items-center gap-3">
                <Phone size={16} className="text-red-400" />
                +91 98765 43210
              </p>
              <p className="flex items-center gap-3">
                <Mail size={16} className="text-red-400" />
                support@velocegarage.com
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">Services</h4>
            <div className="mt-4 space-y-2">
              {services.map((service) => (
                <p key={service} className="text-sm text-zinc-400">
                  {service}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">Quick Links</h4>
            <div className="mt-4 space-y-2">
              {links.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Follow Us</p>
              <div className="mt-3 flex gap-3">
                {socials.map((social) => (
                  <button
                    key={social.label}
                    aria-label={social.label}
                    className="rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-zinc-300 transition-colors hover:border-red-500/50 hover:text-white"
                  >
                    <social.icon size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-5 text-xs text-zinc-500 sm:flex sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} Veloce Garage. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built for enthusiasts, trusted by professionals.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
