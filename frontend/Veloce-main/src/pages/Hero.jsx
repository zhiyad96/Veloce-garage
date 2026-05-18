import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1800&q=80",
    label: "Precision Diagnostics",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80",
    label: "Track-Tested Performance",
  },
  {
    image:
      "https://images.unsplash.com/photo-1616788494672-ec7ca25ff5a6?auto=format&fit=crop&w=1800&q=80",
    label: "Premium Detailing",
  },
];

const highlights = [
  { name: "Happy Drivers", value: "12K+" },
  { name: "Service Score", value: "4.9/5" },
  { name: "Cities Served", value: "22" },
];

export default function Hero() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.label}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[1300ms] ${
              index === activeSlide ? "scale-100 opacity-100" : "scale-110 opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-red-950/70" />
      <div className="bg-grid-dark absolute inset-0 opacity-50" />

      <div className="relative z-10 mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-4 pb-10 pt-28 sm:px-6 lg:grid-cols-2 lg:pt-32">
        <div className="hero-reveal max-w-2xl">
          <div className="mb-5 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-100">
            {slides[activeSlide].label}
          </div>

          <h1 className="font-display text-5xl uppercase leading-[0.95] text-white sm:text-6xl lg:text-8xl">
            Built For Road
            <br />
            Built For Speed
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-200 sm:text-lg">
            Veloce Garage delivers diagnostics, restoration, and performance upgrades for people
            who treat driving as a craft. Every machine leaves sharper, faster, and cleaner.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/product")}
              className="rounded-xl bg-red-700 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-600"
            >
              Explore Collection
            </button>
            <button
              onClick={() => navigate("/about")}
              className="rounded-xl border border-white/40 bg-black/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-white/10"
            >
              Meet The Garage
            </button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {highlights.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-white/20 bg-black/35 p-3 backdrop-blur-sm"
              >
                <p className="font-display text-3xl leading-none text-white">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-zinc-300">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-reveal-delay">
          <div className="rounded-3xl border border-white/20 bg-zinc-950/65 p-6 shadow-2xl backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-3xl uppercase text-white">Service Window</h2>
              <span className="rounded-full bg-red-700/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-100">
                Open Today
              </span>
            </div>

            <div className="space-y-4 text-sm text-zinc-200">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Quick Turnaround</p>
                <p className="mt-1 font-semibold text-white">Most maintenance jobs in under 4 hours</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Performance Lab</p>
                <p className="mt-1 font-semibold text-white">Dyno tuning, ECU remaps, suspension setup</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Pickup Slot</p>
                <p className="mt-1 font-semibold text-white">Next available dispatch in 30 minutes</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.label}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeSlide ? "w-8 bg-white" : "w-3 bg-white/35"
                  }`}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
