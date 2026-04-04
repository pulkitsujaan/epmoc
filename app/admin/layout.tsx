"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Calendar, Users, Images, MessageSquare,
  LogOut, Menu, X, ChevronRight
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email || "");
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Logged out.");
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") return <>{children}</>;

  const Sidebar = () => (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 relative">
            <Image src="/epmoc-logo.png" alt="EPMOC" fill className="object-contain" />
          </div>
          <div>
            <p className="font-syne font-800 text-white text-sm tracking-widest" style={{ fontWeight: 800 }}>EPMOC</p>
            <p className="text-muted text-[10px]">Admin Panel</p>
          </div>
        </Link>
        <button className="md:hidden text-muted hover:text-white" onClick={() => setSidebarOpen(false)}>
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-dm transition-all group ${
                isActive ? "bg-orange/15 text-orange border-l-2 border-orange" : "text-muted hover:text-white hover:bg-surface-2"
              }`}>
              <Icon size={17} />
              <span>{label}</span>
              {isActive && <ChevronRight size={13} className="ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-border">
        <div className="px-3 py-2 mb-2">
          <p className="text-white-dim text-xs font-dm truncate">{userEmail}</p>
          <p className="text-muted-2 text-xs">Administrator</p>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-white hover:bg-red-500/10 transition-all">
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border flex-shrink-0 bg-surface/50">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="w-60 bg-surface border-r border-border flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1 bg-bg/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar */}
        <header className="border-b border-border bg-surface/30 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button className="md:hidden text-muted hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <p className="font-syne font-700 text-white text-sm capitalize" style={{ fontWeight: 700 }}>
              {NAV.find((n) => n.href === pathname)?.label ?? "Admin"}
            </p>
          </div>
          <a href="/" target="_blank" className="text-muted text-xs hover:text-orange transition-colors">
            View site →
          </a>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
