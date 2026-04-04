"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { toast.error(error.message); return; }
      toast.success("Welcome back, admin!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg grid-bg flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange/5 blur-[100px] rounded-full" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 relative mx-auto mb-4">
            <Image src="/epmoc-logo.png" alt="EPMOC" fill className="object-contain" />
          </div>
          <p className="font-syne font-800 text-white text-2xl tracking-widest" style={{ fontWeight: 800 }}>EPMOC</p>
          <p className="text-muted text-sm mt-1">Admin Portal</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center">
              <ShieldCheck size={20} className="text-orange" />
            </div>
            <div>
              <p className="font-syne font-700 text-white" style={{ fontWeight: 700 }}>Admin Sign In</p>
              <p className="text-muted text-xs">Restricted access only</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white-dim text-sm mb-2">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@epmoc.in"
                  className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl pl-10 pr-4 py-3 placeholder:text-muted focus:outline-none focus:border-orange/50 transition-colors" required />
              </div>
            </div>
            <div>
              <label className="block text-white-dim text-sm mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl pl-10 pr-10 py-3 placeholder:text-muted focus:outline-none focus:border-orange/50 transition-colors" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange text-bg font-syne font-700 py-3.5 rounded-xl hover:bg-orange-dim transition-all duration-200 disabled:opacity-60 mt-2" style={{ fontWeight: 700 }}>
              {loading ? <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" /> : "Sign In"}
            </button>
          </form>
          <p className="text-center text-muted-2 text-xs mt-6">This portal is restricted to EPMOC admins only.</p>
        </div>
        <p className="text-center mt-6">
          <a href="/" className="text-muted text-sm hover:text-orange transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  );
}
