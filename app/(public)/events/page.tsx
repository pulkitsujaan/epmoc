"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Tag, Star, Search } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { Event } from "@/types/database";

const CATEGORIES = ["All", "cultural", "governance", "fun", "academic", "sports"];

const FALLBACK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Mridang 2k25",
    description:
      "The annual cultural extravaganza of IIIT Una — a vibrant celebration of music, dance, drama, and art bringing together talent from across the region. Mridang 2k25 was bigger and bolder than ever, packed with stellar performances and unforgettable memories.",
    date: "2025-03-15",
    image_url: null,
    category: "cultural",
    highlight: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Awaaz-e-Janata",
    description:
      "The voice of the students — IIIT Una's annual student election event organized by EPMOC. A landmark democratic exercise where students exercised their right to choose their representatives in a lively, transparent, and festive atmosphere.",
    date: "2025-02-10",
    image_url: null,
    category: "governance",
    highlight: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Treasure Hunt",
    description:
      "An adrenaline-pumping campus-wide treasure hunt that tested teams' wit, speed, and teamwork. Clue-chasing across every corner of IIIT Una, with some wild twists along the way.",
    date: "2024-11-20",
    image_url: null,
    category: "fun",
    highlight: false,
    created_at: new Date().toISOString(),
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  cultural: "bg-orange/20 text-orange border-orange/30",
  governance: "bg-lime/20 text-lime border-lime/30",
  fun: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  academic: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  sports: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(FALLBACK_EVENTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      try {
        const { data } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: false });
        if (data && data.length > 0) setEvents(data);
      } catch { /* use fallback */ } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = events.filter((ev) => {
    const matchesCat = activeCategory === "All" || ev.category === activeCategory;
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 grid-bg">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-orange/5 blur-[80px] rounded-full" />
        </div>
        <div className="relative z-10">
          <p className="text-orange text-sm font-syne font-600 tracking-widest uppercase mb-3" style={{ fontWeight: 600 }}>
            What we&apos;ve done
          </p>
          <h1 className="font-syne font-800 text-4xl md:text-6xl text-white mb-4" style={{ fontWeight: 800 }}>
            Our <span className="gradient-text">Events</span>
          </h1>
          <p className="text-muted text-lg max-w-xl">
            Every event we run has a story. Here&apos;s the archive — big fests, elections, fun competitions, and everything in between.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-dm capitalize transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-orange text-bg"
                    : "border border-border text-muted hover:border-orange/40 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border text-white text-sm rounded-lg pl-9 pr-4 py-2.5 placeholder:text-muted focus:outline-none focus:border-orange/50 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-surface-2" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-surface-2 rounded w-1/3" />
                  <div className="h-5 bg-surface-2 rounded w-3/4" />
                  <div className="h-3 bg-surface-2 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Star size={40} className="text-muted mx-auto mb-4" />
            <p className="text-muted text-lg">No events found.</p>
            <button onClick={() => { setActiveCategory("All"); setSearch(""); }} className="mt-4 text-orange text-sm hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const catStyle = CATEGORY_COLORS[event.category] || "bg-surface-2 text-muted border-border";
  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden group flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-surface-2 to-surface overflow-hidden flex-shrink-0">
        {event.image_url ? (
          <Image src={event.image_url} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl font-syne font-800 text-orange/10 select-none" style={{ fontWeight: 800 }}>
              {event.title.charAt(0)}
            </div>
          </div>
        )}
        {event.highlight && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-lime/90 text-bg text-xs font-syne font-700" style={{ fontWeight: 700 }}>
              <Star size={10} className="fill-bg" /> Featured
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full border text-xs font-dm capitalize ${catStyle}`}>
            {event.category}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-muted text-xs mb-3">
          <Calendar size={12} />
          <span>{formattedDate}</span>
        </div>
        <h3 className="font-syne font-700 text-white text-xl mb-2" style={{ fontWeight: 700 }}>
          {event.title}
        </h3>
        <p className="text-muted text-sm leading-relaxed flex-1">
          {event.description.length > 120 ? event.description.substring(0, 120) + "..." : event.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted">
          <Tag size={11} />
          <span className="capitalize">{event.category}</span>
        </div>
      </div>
    </div>
  );
}
