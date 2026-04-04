"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Users, Images, MessageSquare, ArrowRight, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface Stats {
  events: number;
  team: number;
  gallery: number;
  messages: number;
  unread: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ events: 0, team: 0, gallery: 0, messages: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("team_members").select("id", { count: "exact", head: true }),
      supabase.from("gallery").select("id", { count: "exact", head: true }),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false),
    ]).then(([events, team, gallery, messages, unread]) => {
      setStats({
        events: events.count || 0,
        team: team.count || 0,
        gallery: gallery.count || 0,
        messages: messages.count || 0,
        unread: unread.count || 0,
      });
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: "Events", value: stats.events, icon: Calendar, href: "/admin/events", color: "text-orange", bg: "bg-orange/10" },
    { label: "Team Members", value: stats.team, icon: Users, href: "/admin/team", color: "text-lime", bg: "bg-lime/10" },
    { label: "Gallery Items", value: stats.gallery, icon: Images, href: "/admin/gallery", color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, href: "/admin/messages", color: "text-purple-400", bg: "bg-purple-500/10", badge: stats.unread },
  ];

  const quickLinks = [
    { label: "Add new event", href: "/admin/events", desc: "Create and publish a new event" },
    { label: "Add team member", href: "/admin/team", desc: "Add someone to the team roster" },
    { label: "Upload gallery photos", href: "/admin/gallery", desc: "Add photos from recent events" },
    { label: "Check messages", href: "/admin/messages", desc: `${stats.unread} unread message${stats.unread !== 1 ? "s" : ""}` },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome */}
      <div>
        <h1 className="font-syne font-800 text-2xl text-white mb-1" style={{ fontWeight: 800 }}>
          Good to see you 👋
        </h1>
        <p className="text-muted text-sm">Here&apos;s a quick overview of your EPMOC website.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}
            className="glass-card glass-card-hover rounded-2xl p-5 group relative">
            {card.badge ? (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange text-bg text-[10px] font-syne font-700 flex items-center justify-center" style={{ fontWeight: 700 }}>
                {card.badge}
              </span>
            ) : null}
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-4`}>
              <card.icon size={18} className={card.color} />
            </div>
            <p className={`font-syne font-800 text-3xl ${card.color} mb-1`} style={{ fontWeight: 800 }}>
              {loading ? "—" : card.value}
            </p>
            <p className="text-muted text-xs">{card.label}</p>
            <ArrowRight size={14} className="absolute bottom-4 right-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p className="font-syne font-700 text-white text-sm mb-4 tracking-wide uppercase" style={{ fontWeight: 700 }}>
          Quick actions
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link key={link.label} href={link.href}
              className="glass-card glass-card-hover rounded-xl px-5 py-4 flex items-center justify-between group">
              <div>
                <p className="font-syne font-600 text-white text-sm" style={{ fontWeight: 600 }}>{link.label}</p>
                <p className="text-muted text-xs mt-0.5">{link.desc}</p>
              </div>
              <ArrowRight size={15} className="text-muted group-hover:text-orange group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-lime/5 border border-lime/20">
        <CheckCircle size={18} className="text-lime mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-lime text-sm font-syne font-600" style={{ fontWeight: 600 }}>Website is live</p>
          <p className="text-muted text-xs mt-0.5">All changes you make here update the public website in real time.</p>
        </div>
      </div>
    </div>
  );
}
