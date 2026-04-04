"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/90 backdrop-blur-xl border-b border-border py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 relative overflow-hidden rounded-lg">
            <Image
              src="/epmoc-logo.png"
              alt="EPMOC"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <span
              className="font-syne font-800 text-lg text-white tracking-widest"
              style={{ fontWeight: 800 }}
            >
              EPMOC
            </span>
            <p className="text-muted text-[10px] tracking-widest uppercase leading-none">
              Together we manage
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-dm font-medium rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "text-orange"
                    : "text-white-dim hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange rounded-full" />
                )}
                <span className="absolute inset-0 rounded-lg bg-orange/0 group-hover:bg-orange/5 transition-colors" />
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="px-5 py-2 bg-orange text-bg text-sm font-syne font-700 rounded-lg hover:bg-orange-dim transition-all duration-200 hover:shadow-lg hover:shadow-orange/20"
            style={{ fontWeight: 700 }}
          >
            Get in touch →
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={20} className="text-white" />
          ) : (
            <Menu size={20} className="text-white" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-orange/10 text-orange"
                      : "text-white-dim hover:text-white hover:bg-surface"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="mt-2 px-4 py-3 bg-orange text-bg text-sm font-syne font-700 rounded-lg text-center"
              style={{ fontWeight: 700 }}
            >
              Get in touch →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
