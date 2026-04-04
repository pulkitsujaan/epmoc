import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 relative rounded-lg overflow-hidden">
                <Image src="/epmoc-logo.png" alt="EPMOC" fill className="object-contain" />
              </div>
              <div>
                <p className="font-syne font-800 text-white tracking-widest" style={{ fontWeight: 800 }}>
                  EPMOC
                </p>
                <p className="text-muted text-xs tracking-widest uppercase">Together we manage</p>
              </div>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              The official Event Planning and Management Organizing Council of IIIT Una, Himachal Pradesh.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted hover:text-orange hover:border-orange transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="mailto:epmoc@iiituna.ac.in"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted hover:text-orange hover:border-orange transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-syne font-700 text-white mb-5 tracking-wide text-sm uppercase" style={{ fontWeight: 700 }}>
              Quick links
            </p>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/events", label: "Events" },
                { href: "/team", label: "Our Team" },
                { href: "/gallery", label: "Gallery" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted text-sm hover:text-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <p className="font-syne font-700 text-white mb-5 tracking-wide text-sm uppercase" style={{ fontWeight: 700 }}>
              Find us
            </p>
            <div className="flex items-start gap-3 text-muted text-sm">
              <MapPin size={16} className="mt-0.5 text-orange flex-shrink-0" />
              <p className="leading-relaxed">
                Indian Institute of Information Technology Una<br />
                Saloh, Una<br />
                Himachal Pradesh — 174301
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-muted text-sm">
              <Mail size={16} className="text-orange flex-shrink-0" />
              <a href="mailto:epmoc@iiituna.ac.in" className="hover:text-orange transition-colors">
                epmoc@iiituna.ac.in
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">
            © {year} EPMOC — IIIT Una. All rights reserved.
          </p>
          <p className="text-muted-2 text-xs">
            Made with ❤️ by EPMOC Technical Team
          </p>
        </div>
      </div>
    </footer>
  );
}
