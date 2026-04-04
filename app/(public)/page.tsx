"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Users, Zap, Star, X } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { Event } from "@/types/database";

const STATS = [
  { value: "5+", label: "Events/Year" },
  { value: "500+", label: "Attendees" },
  { value: "19", label: "Core Members" },
  { value: "∞", label: "Memories" },
];

const MARQUEE_TEXT = [
  "MRIDANG 2K25",
  "AWAAZ-E-JANATA",
  "TREASURE HUNT",
  "CULTURAL FEST",
  "STUDENT ELECTIONS",
  "TOGETHER WE MANAGE",
];

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("events")
      .select("*")
      .eq("highlight", true)
      .order("date", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setEvents(data);
      });
  }, []);

  return (
    <div className="grid-bg min-h-screen">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 overflow-hidden"
      >
        {/* Background glow blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-orange/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-lime/3 blur-[100px]" />
        </div>

        {/* Badge */}
        <div className="relative z-10 mb-8 flex items-center gap-2 px-4 py-2 rounded-full border border-orange/30 bg-orange/5 text-orange text-xs font-dm font-medium tracking-widest uppercase">
          <Zap size={12} className="fill-orange" />
          IIIT Una&apos;s Official Event Management Council
        </div>

        {/* Hero heading */}
        <h1 className="relative z-10 text-center font-syne font-800 leading-none mb-4" style={{ fontWeight: 800 }}>
          <span className="block text-[clamp(4rem,12vw,9rem)] text-white text-glow-orange tracking-tight">
            EP
            <span className="gradient-text">MOC</span>
          </span>
          <span className="block text-[clamp(1rem,3vw,1.8rem)] text-white-dim font-dm font-light tracking-[0.3em] uppercase mt-2">
            Event Planning & Management Organizing Council
          </span>
        </h1>

        {/* Tagline */}
        <p className="relative z-10 mt-6 text-center text-muted text-lg max-w-xl leading-relaxed">
          We don&apos;t just plan events — we craft experiences that the entire IIIT Una family will remember.
        </p>

        {/* CTA buttons */}
        <div className="relative z-10 mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/events"
            className="group flex items-center gap-2 px-7 py-3.5 bg-orange text-bg font-syne font-700 rounded-xl hover:bg-orange-dim transition-all duration-200 hover:shadow-xl hover:shadow-orange/25 hover:-translate-y-0.5"
            style={{ fontWeight: 700 }}
          >
            Explore Events
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/team"
            className="flex items-center gap-2 px-7 py-3.5 border border-border text-white-dim font-dm rounded-xl hover:border-orange/40 hover:text-white transition-all duration-200"
          >
            Meet the Team
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted text-xs tracking-widest uppercase animate-bounce">
          <span>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted to-transparent" />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="relative overflow-hidden border-y border-border py-4 bg-surface/30">
        <div className="marquee-content text-xs font-syne font-700 tracking-[0.4em] uppercase text-muted" style={{ fontWeight: 700 }}>
          {[...MARQUEE_TEXT, ...MARQUEE_TEXT].map((text, i) => (
            <span key={i} className="inline-block mx-8">
              <span className="text-orange">✦</span> {text}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="glass-card glass-card-hover rounded-2xl p-6 text-center"
            >
              <p className="font-syne text-4xl font-800 gradient-text-orange mb-1" style={{ fontWeight: 800 }}>
                {stat.value}
              </p>
              <p className="text-muted text-sm font-dm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HIGHLIGHT EVENTS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-orange text-sm font-syne font-600 tracking-widest uppercase mb-2" style={{ fontWeight: 600 }}>
              What we&apos;ve been up to
            </p>
            <h2 className="font-syne font-800 text-3xl md:text-4xl text-white" style={{ fontWeight: 800 }}>
              Highlight Events
            </h2>
          </div>
          <Link
            href="/events"
            className="hidden sm:flex items-center gap-2 text-orange text-sm font-dm hover:gap-3 transition-all"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {events.length === 0 ? (
          // Placeholder cards while loading / no data
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Mridang 2k25",
                category: "Cultural Fest",
                desc: "The annual cultural extravaganza — music, dance, drama and pure chaos.",
                date: "March 2025",
              },
              {
                title: "Awaaz-e-Janata",
                category: "Student Elections",
                desc: "The voice of the students. Democratic. Festive. Loud.",
                date: "February 2025",
              },
              {
                title: "Treasure Hunt",
                category: "Fun Event",
                desc: "Campus-wide adventure testing wit, speed, and teamwork.",
                date: "November 2024",
              },
            ].map((ev) => (
              <EventCard key={ev.title} event={ev} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((ev) => (
              <EventCard
                key={ev.id}
                event={{
                  title: ev.title,
                  category: ev.category,
                  desc: ev.description.substring(0, 100) + "...",
                  date: new Date(ev.date).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  }),
                  imageUrl: ev.image_url || undefined,
                }}
                onClick={() => setSelectedEvent(ev)}
              />
            ))}
          </div>
        )}
      </section>

      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-3xl rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
              <div>
                <p className="text-muted text-xs uppercase tracking-[0.3em] mb-2">Event details</p>
                <h2 className="text-2xl font-syne font-800 text-white" style={{ fontWeight: 800 }}>
                  {selectedEvent.title}
                </h2>
                <p className="text-muted text-sm mt-1">
                  {new Date(selectedEvent.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="rounded-full p-2 text-muted transition-colors hover:text-white"
                aria-label="Close event details"
              >
                <X size={20} />
              </button>
            </div>
            {selectedEvent.image_url ? (
              <div className="relative h-64 w-full bg-surface-2">
                <Image
                  src={selectedEvent.image_url}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center bg-surface-2 text-orange/20">
                <span className="text-[5rem] font-syne font-800" style={{ fontWeight: 800 }}>
                  {selectedEvent.title.charAt(0)}
                </span>
              </div>
            )}
            <div className="p-6 space-y-5">
              <p className="text-muted leading-relaxed text-sm">
                {selectedEvent.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── ABOUT TEASER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl gradient-border p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-radial from-orange/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <p className="text-orange text-sm font-syne tracking-widest uppercase mb-4" style={{ fontWeight: 600 }}>
              Who are we?
            </p>
            <h2 className="font-syne font-800 text-3xl md:text-5xl text-white mb-6 leading-tight" style={{ fontWeight: 800 }}>
              Together We{" "}
              <span className="gradient-text">Manage</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              EPMOC is the heartbeat of IIIT Una&apos;s campus life. From mammoth cultural fests to intimate competitions, 
              we make it happen — with a team of 19 passionate humans who live for the stage.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-dm rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              Learn more about us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TEAM TEASER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-lime text-sm font-syne font-600 tracking-widest uppercase mb-2" style={{ fontWeight: 600 }}>
              The people behind it all
            </p>
            <h2 className="font-syne font-800 text-3xl md:text-4xl text-white" style={{ fontWeight: 800 }}>
              Core Team
            </h2>
          </div>
          <Link
            href="/team"
            className="hidden sm:flex items-center gap-2 text-lime text-sm hover:gap-3 transition-all"
          >
            Full team <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            { name: "Chirag Jain", role: "President", rollNo: "23218" },
            { name: "Tarsem Gulab", role: "Vice President", rollNo: "23158" },
            { name: "Pushparaj Dubey", role: "Treasurer", rollNo: "23145" },
            { name: "Pulkit", role: "General Secretary", rollNo: "24147" },
          ].map((member) => (
            <div
              key={member.rollNo}
              className="glass-card glass-card-hover rounded-2xl p-5 text-center group"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange/20 to-lime/20 mx-auto mb-3 flex items-center justify-center text-xl font-syne font-800" style={{ fontWeight: 800 }}>
                {member.name.charAt(0)}
              </div>
              <p className="font-syne font-700 text-white text-sm" style={{ fontWeight: 700 }}>
                {member.name}
              </p>
              <p className="text-orange text-xs mt-0.5 font-dm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function EventCard({
  event,
  onClick,
}: {
  event: {
    title: string;
    category: string;
    desc: string;
    date: string;
    imageUrl?: string;
  };
  onClick?: () => void;
}) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      } : undefined}
      className={`glass-card glass-card-hover rounded-2xl overflow-hidden group flex flex-col ${onClick ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange/40" : "cursor-default"}`}
    >
      {/* Image placeholder / actual image */}
      <div className="relative h-44 bg-gradient-to-br from-surface-2 to-surface overflow-hidden">
        {event.imageUrl ? (
          <Image src={event.imageUrl} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Star size={32} className="text-orange/20" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full bg-orange/90 text-bg text-xs font-syne font-700" style={{ fontWeight: 700 }}>
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-muted text-xs mb-2">
          <Calendar size={12} />
          <span>{event.date}</span>
        </div>
        <h3 className="font-syne font-700 text-white text-lg mb-2" style={{ fontWeight: 700 }}>
          {event.title}
        </h3>
        <p className="text-muted text-sm leading-relaxed">{event.desc}</p>
      </div>
    </div>
  );
}
