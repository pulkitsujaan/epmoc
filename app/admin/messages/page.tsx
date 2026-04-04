"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Mail, Check, Trash2, Loader2 } from "lucide-react";
import { createClient, createUntypedClient } from "@/lib/supabase";
import type { ContactMessage } from "@/types/database";
import toast from "react-hot-toast";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMessages = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id: string) => {
    const supabase = createUntypedClient();
    await supabase.from("contact_messages").update({ read: true }).eq("id", id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    setDeleting(id);
    const supabase = createUntypedClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) toast.error("Delete failed.");
    else { toast.success("Message deleted."); fetchMessages(); }
    setDeleting(null);
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-800 text-2xl text-white" style={{ fontWeight: 800 }}>Messages</h1>
          <p className="text-muted text-sm mt-0.5">
            {messages.length} total · <span className="text-orange">{unread} unread</span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card rounded-xl p-5 animate-pulse space-y-3">
              <div className="h-3 bg-surface-2 rounded w-1/4" />
              <div className="h-3 bg-surface-2 rounded w-1/3" />
              <div className="h-3 bg-surface-2 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <MessageSquare size={40} className="text-muted mx-auto mb-3" />
          <p className="text-white font-syne font-700" style={{ fontWeight: 700 }}>No messages yet</p>
          <p className="text-muted text-sm mt-1">Messages from your Contact page will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id}
              className={`glass-card rounded-xl p-5 border transition-colors ${!msg.read ? "border-orange/20" : "border-border"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Unread dot */}
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${msg.read ? "bg-muted-2" : "bg-orange"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-syne font-700 text-white text-sm" style={{ fontWeight: 700 }}>
                        {msg.name}
                      </p>
                      {!msg.read && (
                        <span className="px-2 py-0.5 rounded-full bg-orange/10 text-orange text-[10px] font-syne font-700" style={{ fontWeight: 700 }}>
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-muted text-xs mb-3">
                      <Mail size={11} />
                      <a href={`mailto:${msg.email}`} className="hover:text-orange transition-colors">{msg.email}</a>
                    </div>
                    <p className="text-white-dim text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-muted-2 text-xs mt-2">
                      {new Date(msg.created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {!msg.read && (
                    <button onClick={() => markRead(msg.id)}
                      className="p-2 rounded-lg text-muted hover:text-lime hover:bg-lime/10 transition-colors" title="Mark as read">
                      <Check size={15} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(msg.id)} disabled={deleting === msg.id}
                    className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                    {deleting === msg.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </div>

              {/* Quick reply link */}
              <div className="mt-3 pt-3 border-t border-border">
                <a href={`mailto:${msg.email}?subject=Re: Your message to EPMOC`}
                  className="text-orange text-xs hover:underline font-dm flex items-center gap-1">
                  <Mail size={11} /> Reply via email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
