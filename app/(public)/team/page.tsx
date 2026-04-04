"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { TeamMember } from "@/types/database";

const FALLBACK_TEAM: TeamMember[] = [
  { id: "1", name: "Chirag Jain", roll_number: "23218", position: "President", department: null, image_url: null, batch: "2023", order_index: 1, created_at: "" },
  { id: "2", name: "Tarsem Gulab", roll_number: "23158", position: "Vice President", department: null, image_url: null, batch: "2023", order_index: 2, created_at: "" },
  { id: "3", name: "Pushparaj Dubey", roll_number: "23145", position: "Treasurer", department: null, image_url: null, batch: "2023", order_index: 3, created_at: "" },
  { id: "4", name: "Pulkit", roll_number: "24147", position: "General Secretary", department: null, image_url: null, batch: "2024", order_index: 4, created_at: "" },
  { id: "5", name: "Ujjaldeep Singh", roll_number: "24424", position: "Joint Secretary", department: null, image_url: null, batch: "2024", order_index: 5, created_at: "" },
  { id: "6", name: "Rahul", roll_number: "23149", position: "Joint Secretary", department: null, image_url: null, batch: "2023", order_index: 6, created_at: "" },
  { id: "7", name: "Shristi", roll_number: "24122", position: "Core Advisor", department: null, image_url: null, batch: "2024", order_index: 7, created_at: "" },
  { id: "8", name: "Arvind Bhokal", roll_number: "24310", position: "Core Advisor", department: null, image_url: null, batch: "2024", order_index: 8, created_at: "" },
  { id: "9", name: "Tanu", roll_number: "24423", position: "Design Head", department: null, image_url: null, batch: "2024", order_index: 9, created_at: "" },
  { id: "10", name: "Shourya Seth", roll_number: "24163", position: "Public Relations Head", department: null, image_url: null, batch: "2024", order_index: 10, created_at: "" },
  { id: "11", name: "Ankush Sharma", roll_number: "24214", position: "Social Media Head", department: null, image_url: null, batch: "2024", order_index: 11, created_at: "" },
  { id: "12", name: "Kapil Shekhawat", roll_number: "24126", position: "Volunteering Head", department: null, image_url: null, batch: "2024", order_index: 12, created_at: "" },
  { id: "13", name: "Riyansh Raj", roll_number: "24417", position: "Content Head", department: null, image_url: null, batch: "2024", order_index: 13, created_at: "" },
  { id: "14", name: "Daksh Kumar", roll_number: "24118", position: "Coverage Head", department: null, image_url: null, batch: "2024", order_index: 14, created_at: "" },
  { id: "15", name: "Sujal", roll_number: "24422", position: "Decoration Head", department: null, image_url: null, batch: "2024", order_index: 15, created_at: "" },
  { id: "16", name: "Shray Chaudhary", roll_number: "24164", position: "Video Editing Head", department: null, image_url: null, batch: "2024", order_index: 16, created_at: "" },
  { id: "17", name: "Rahul Chadak", roll_number: "24516", position: "PS & Marketing Head", department: null, image_url: null, batch: "2024", order_index: 17, created_at: "" },
  { id: "18", name: "Aditya Pandey", roll_number: "24305", position: "PS & Marketing Head", department: null, image_url: null, batch: "2024", order_index: 18, created_at: "" },
  { id: "19", name: "Moshish Chaudhary", roll_number: "24341", position: "Technical Head", department: null, image_url: null, batch: "2024", order_index: 19, created_at: "" },
];

const LEADERSHIP_POSITIONS = ["President", "Vice President", "Treasurer", "General Secretary", "Joint Secretary", "Core Advisor"];

// Generate a color based on first char of name
function getAvatarColor(name: string) {
  const colors = [
    "from-orange/40 to-orange/20",
    "from-lime/40 to-lime/20",
    "from-blue-500/40 to-blue-500/20",
    "from-purple-500/40 to-purple-500/20",
    "from-pink-500/40 to-pink-500/20",
    "from-yellow-500/40 to-yellow-500/20",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(FALLBACK_TEAM);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      try {
        const { data } = await supabase
          .from("team_members")
          .select("*")
          .order("order_index", { ascending: true });
        if (data && data.length > 0) setTeam(data);
      } catch { /* use fallback */ } finally {
        setLoading(false);
      }
    })();
  }, []);

  const leadership = team.filter((m) => LEADERSHIP_POSITIONS.includes(m.position));
  const heads = team.filter((m) => !LEADERSHIP_POSITIONS.includes(m.position));

  return (
    <div className="min-h-screen pt-24 grid-bg">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/3 w-[400px] h-[200px] bg-lime/4 blur-[80px] rounded-full" />
        </div>
        <div className="relative z-10">
          <p className="text-lime text-sm font-syne font-600 tracking-widest uppercase mb-3" style={{ fontWeight: 600 }}>
            The people
          </p>
          <h1 className="font-syne font-800 text-4xl md:text-6xl text-white mb-4" style={{ fontWeight: 800 }}>
            Meet the <span className="gradient-text">Team</span>
          </h1>
          <p className="text-muted text-lg max-w-xl">
            19 passionate humans. One mission. Here&apos;s the crew that makes EPMOC tick.
          </p>
        </div>
      </section>

      {/* Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-px bg-orange" />
          <p className="font-syne font-700 text-orange text-sm tracking-widest uppercase" style={{ fontWeight: 700 }}>
            Leadership
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-surface-2 mx-auto mb-3" />
                <div className="h-3 bg-surface-2 rounded w-3/4 mx-auto mb-2" />
                <div className="h-2 bg-surface-2 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {leadership.map((m) => (
              <MemberCard key={m.id} member={m} featured />
            ))}
          </div>
        )}
      </section>

      {/* Department Heads */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-px bg-lime" />
          <p className="font-syne font-700 text-lime text-sm tracking-widest uppercase" style={{ fontWeight: 700 }}>
            Department Heads
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-surface-2 mx-auto mb-3" />
                <div className="h-3 bg-surface-2 rounded w-3/4 mx-auto mb-2" />
                <div className="h-2 bg-surface-2 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {heads.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MemberCard({ member, featured = false }: { member: TeamMember; featured?: boolean }) {
  const gradientClass = getAvatarColor(member.name);

  return (
    <div className={`glass-card glass-card-hover rounded-2xl p-5 text-center group transition-all ${featured ? "border-orange/15" : ""}`}>
      {/* Avatar */}
      <div className={`${featured ? "w-16 h-16" : "w-14 h-14"} relative rounded-full mx-auto mb-3 overflow-hidden`}>
        {member.image_url ? (
          <Image src={member.image_url} alt={member.name} fill className="object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <span className="font-syne font-800 text-white text-xl" style={{ fontWeight: 800 }}>
              {member.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <p className={`font-syne font-700 text-white ${featured ? "text-sm" : "text-sm"} leading-tight`} style={{ fontWeight: 700 }}>
        {member.name}
      </p>
      <p className={`${featured ? "text-orange" : "text-lime"} text-xs mt-1 font-dm leading-tight`}>
        {member.position}
      </p>
      <p className="text-muted-2 text-xs mt-1">#{member.roll_number}</p>
    </div>
  );
}
