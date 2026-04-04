"use client";

import { Target, Heart, Zap, Users, Star, Award } from "lucide-react";

const VALUES = [
  {
    icon: Zap,
    title: "Energy",
    desc: "We bring relentless enthusiasm to every event we touch — from the first planning session to the last cleanup shift.",
    color: "text-orange",
    bg: "bg-orange/10",
  },
  {
    icon: Heart,
    title: "Passion",
    desc: "Events aren't just tasks for us. They're our craft, our pride, and our way of creating something bigger than ourselves.",
    color: "text-lime",
    bg: "bg-lime/10",
  },
  {
    icon: Users,
    title: "Teamwork",
    desc: "19 minds, one mission. We disagree, debate, and then deliver — because the best ideas come from the messiest brainstorms.",
    color: "text-orange",
    bg: "bg-orange/10",
  },
  {
    icon: Target,
    title: "Precision",
    desc: "Behind every seamless event is a wall of sticky notes, spreadsheets, and late-night planning. We sweat the details so you don't have to.",
    color: "text-lime",
    bg: "bg-lime/10",
  },
];

const TIMELINE = [
  {
    year: "2022",
    title: "EPMOC Founded",
    desc: "A small group of passionate students decided IIIT Una deserved better events. EPMOC was born.",
  },
  {
    year: "2023",
    title: "First Big Fest",
    desc: "Organized the inaugural large-scale cultural event, setting a benchmark for campus celebrations.",
  },
  {
    year: "2024",
    title: "Expanded Operations",
    desc: "Grew the team, diversified event types, and handled student elections for the first time.",
  },
  {
    year: "2025",
    title: "Mridang 2k25",
    desc: "Pulled off the biggest cultural fest in IIIT Una history. 500+ attendees. Zero regrets.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 grid-bg">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-orange/5 blur-[100px] rounded-full" />
        </div>
        <div className="relative z-10">
          <p className="text-orange text-sm font-syne font-600 tracking-widest uppercase mb-4" style={{ fontWeight: 600 }}>
            Our story
          </p>
          <h1 className="font-syne font-800 text-4xl md:text-6xl text-white mb-6 leading-tight" style={{ fontWeight: 800 }}>
            Not just a club.{" "}
            <span className="gradient-text">A movement.</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            EPMOC — Event Planning and Management Organizing Council — is the official event management
            body of IIIT Una. We exist to make campus life unforgettable.
          </p>
        </div>
      </section>

      {/* What we do */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-orange text-sm font-syne tracking-widest uppercase mb-3" style={{ fontWeight: 600 }}>
              What we do
            </p>
            <h2 className="font-syne font-800 text-3xl md:text-4xl text-white mb-6 leading-snug" style={{ fontWeight: 800 }}>
              We turn ideas into{" "}
              <span className="gradient-text">experiences</span>
            </h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                From the chaos of student elections to the spectacle of cultural fests,
                EPMOC handles it all. We plan, organize, promote, decorate, document, and
                deliver — end to end.
              </p>
              <p>
                Our team spans every department: design, public relations, social media,
                content, coverage, decoration, video editing, and technical execution.
                We&apos;re not just coordinators — we&apos;re creators.
              </p>
              <p>
                Based at IIIT Una, Himachal Pradesh, we&apos;re a batch of students who
                believe the best college memories aren&apos;t made in classrooms —
                they&apos;re made on stages, fields, and event venues.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Star, value: "5+", label: "Events per year", color: "text-orange" },
              { icon: Users, value: "500+", label: "Total attendees", color: "text-lime" },
              { icon: Award, value: "19", label: "Core team members", color: "text-orange" },
              { icon: Heart, value: "3+", label: "Years of passion", color: "text-lime" },
            ].map((item) => (
              <div key={item.label} className="glass-card rounded-2xl p-6 text-center">
                <item.icon size={24} className={`${item.color} mx-auto mb-3`} />
                <p className={`font-syne font-800 text-3xl ${item.color} mb-1`} style={{ fontWeight: 800 }}>
                  {item.value}
                </p>
                <p className="text-muted text-xs">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-14">
          <p className="text-lime text-sm font-syne tracking-widest uppercase mb-3" style={{ fontWeight: 600 }}>
            What drives us
          </p>
          <h2 className="font-syne font-800 text-3xl md:text-4xl text-white" style={{ fontWeight: 800 }}>
            Our Values
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="glass-card glass-card-hover rounded-2xl p-7 group">
              <div className={`w-12 h-12 ${v.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <v.icon size={22} className={v.color} />
              </div>
              <h3 className={`font-syne font-700 text-lg ${v.color} mb-3`} style={{ fontWeight: 700 }}>
                {v.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-32">
        <div className="text-center mb-14">
          <p className="text-orange text-sm font-syne tracking-widest uppercase mb-3" style={{ fontWeight: 600 }}>
            How we got here
          </p>
          <h2 className="font-syne font-800 text-3xl md:text-4xl text-white" style={{ fontWeight: 800 }}>
            Our Journey
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-orange via-lime to-transparent" />
          <div className="space-y-10 pl-20">
            {TIMELINE.map((item) => (
              <div key={item.year} className="relative">
                <div className="absolute -left-[3.3rem] top-1.5 w-4 h-4 rounded-full border-2 border-orange bg-bg" />
                <div className="glass-card glass-card-hover rounded-2xl p-6">
                  <span className="px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-syne font-700 inline-block mb-2" style={{ fontWeight: 700 }}>
                    {item.year}
                  </span>
                  <h3 className="font-syne font-700 text-white text-lg mb-1" style={{ fontWeight: 700 }}>
                    {item.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
