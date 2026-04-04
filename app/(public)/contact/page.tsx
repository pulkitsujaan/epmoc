"use client";

import { useState } from "react";
import { Mail, MapPin, Instagram, Send, CheckCircle } from "lucide-react";
import { createUntypedClient } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createUntypedClient();
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name,
        email: form.email,
        message: form.message,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
    } catch {
      toast.error("Something went wrong. Try emailing us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 grid-bg">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-orange text-sm font-syne font-600 tracking-widest uppercase mb-3" style={{ fontWeight: 600 }}>
          Say hello
        </p>
        <h1 className="font-syne font-800 text-4xl md:text-6xl text-white mb-4" style={{ fontWeight: 800 }}>
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="text-muted text-lg max-w-xl">
          Have a question, suggestion, or just want to collaborate? We&apos;d love to hear from you.
        </p>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-syne font-700 text-white text-2xl mb-6" style={{ fontWeight: 700 }}>
                Find us here
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={18} className="text-orange" />
                  </div>
                  <div>
                    <p className="font-syne font-600 text-white text-sm mb-1" style={{ fontWeight: 600 }}>
                      Address
                    </p>
                    <p className="text-muted text-sm leading-relaxed">
                      IIIT Una, Saloh<br />
                      Una, Himachal Pradesh<br />
                      174301, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-orange" />
                  </div>
                  <div>
                    <p className="font-syne font-600 text-white text-sm mb-1" style={{ fontWeight: 600 }}>
                      Email
                    </p>
                    <a href="mailto:epmoc@iiituna.ac.in" className="text-muted text-sm hover:text-orange transition-colors">
                      epmoc@iiituna.ac.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center flex-shrink-0">
                    <Instagram size={18} className="text-orange" />
                  </div>
                  <div>
                    <p className="font-syne font-600 text-white text-sm mb-1" style={{ fontWeight: 600 }}>
                      Instagram
                    </p>
                    <a
                      href="https://instagram.com/epmoc_iiituna"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted text-sm hover:text-orange transition-colors"
                    >
                      @epmoc_iiituna
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Fun note */}
            <div className="glass-card rounded-2xl p-6 border-lime/20">
              <p className="text-lime text-xs font-syne tracking-widest uppercase mb-2" style={{ fontWeight: 600 }}>
                Quick note
              </p>
              <p className="text-muted text-sm leading-relaxed">
                We&apos;re students, so we might be in class, in the gym, or just vibing. But we do check our messages — we&apos;ll get back to you!
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card rounded-2xl p-8">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 gap-4">
                <CheckCircle size={48} className="text-lime" />
                <h3 className="font-syne font-700 text-white text-xl" style={{ fontWeight: 700 }}>
                  Message received!
                </h3>
                <p className="text-muted text-sm max-w-xs">
                  Thanks for reaching out. We&apos;ll reply as soon as we can.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}
                  className="mt-2 text-orange text-sm hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-white-dim text-sm mb-2 font-dm">
                    Your name
                  </label>
                  <input
                    type="text"
                    placeholder="What should we call you?"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-3 placeholder:text-muted focus:outline-none focus:border-orange/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white-dim text-sm mb-2 font-dm">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-3 placeholder:text-muted focus:outline-none focus:border-orange/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white-dim text-sm mb-2 font-dm">
                    Message
                  </label>
                  <textarea
                    placeholder="What's on your mind?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-3 placeholder:text-muted focus:outline-none focus:border-orange/50 transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-orange text-bg font-syne font-700 py-3.5 rounded-xl hover:bg-orange-dim transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-orange/20"
                  style={{ fontWeight: 700 }}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
