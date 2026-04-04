"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Calendar, Star, Upload, Loader2 } from "lucide-react";
import { createClient, createUntypedClient } from "@/lib/supabase";
import type { Event } from "@/types/database";
import toast from "react-hot-toast";

const CATEGORIES = ["cultural", "governance", "fun", "academic", "sports"];

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  category: "cultural",
  highlight: false,
  image_url: "",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const fetchEvents = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setModalOpen(true);
  };

  const openEdit = (ev: Event) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      description: ev.description,
      date: ev.date,
      category: ev.category,
      highlight: ev.highlight,
      image_url: ev.image_url || "",
    });
    setImageFile(null);
    setImagePreview(ev.image_url || "");
    setModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return form.image_url || null;
    setUploading(true);
    const supabase = createUntypedClient();
    const ext = imageFile.name.split(".").pop();
    const filename = `event-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("events").upload(filename, imageFile);
    setUploading(false);
    if (error) { toast.error("Image upload failed."); return null; }
    const { data } = supabase.storage.from("events").getPublicUrl(filename);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.date) {
      toast.error("Title, description, and date are required.");
      return;
    }
    setSaving(true);
    try {
      const imageUrl = await uploadImage();
      const supabase = createUntypedClient();
      const payload = {
        title: form.title,
        description: form.description,
        date: form.date,
        category: form.category,
        highlight: form.highlight,
        image_url: imageUrl,
      };

      if (editingId) {
        const { error } = await supabase.from("events").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Event updated!");
      } else {
        const { error } = await supabase.from("events").insert(payload);
        if (error) throw error;
        toast.success("Event created!");
      }

      setModalOpen(false);
      fetchEvents();
    } catch {
      toast.error("Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    setDeleting(id);
    const supabase = createUntypedClient();
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error("Delete failed.");
    else { toast.success("Event deleted."); fetchEvents(); }
    setDeleting(null);
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-800 text-2xl text-white" style={{ fontWeight: 800 }}>Events</h1>
          <p className="text-muted text-sm mt-0.5">{events.length} event{events.length !== 1 ? "s" : ""} total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-orange text-bg px-4 py-2.5 rounded-xl font-syne font-700 text-sm hover:bg-orange-dim transition-colors" style={{ fontWeight: 700 }}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card rounded-xl p-4 animate-pulse flex gap-4">
              <div className="w-20 h-16 bg-surface-2 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-2 rounded w-1/3" />
                <div className="h-3 bg-surface-2 rounded w-2/3" />
                <div className="h-3 bg-surface-2 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Calendar size={40} className="text-muted mx-auto mb-3" />
          <p className="text-white font-syne font-700" style={{ fontWeight: 700 }}>No events yet</p>
          <p className="text-muted text-sm mt-1">Create your first event to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="glass-card rounded-xl p-4 flex items-center gap-4 group">
              {/* Thumbnail */}
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                {ev.image_url ? (
                  <Image src={ev.image_url} alt={ev.title} width={80} height={64} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-orange/20 text-2xl font-syne font-800" style={{ fontWeight: 800 }}>
                    {ev.title.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-syne font-700 text-white text-sm" style={{ fontWeight: 700 }}>{ev.title}</p>
                  {ev.highlight && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-lime/10 text-lime text-[10px] font-syne font-700" style={{ fontWeight: 700 }}>
                      <Star size={9} className="fill-lime" /> Featured
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-surface-2 text-muted text-[10px] capitalize">{ev.category}</span>
                </div>
                <p className="text-muted text-xs mt-0.5 truncate">{ev.description.substring(0, 80)}...</p>
                <p className="text-muted-2 text-xs mt-1 flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(ev)}
                  className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface-2 transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(ev.id)} disabled={deleting === ev.id}
                  className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  {deleting === ev.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-bg/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl my-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <p className="font-syne font-700 text-white" style={{ fontWeight: 700 }}>
                {editingId ? "Edit Event" : "New Event"}
              </p>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-white-dim text-sm mb-1.5">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Event name"
                  className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-muted focus:outline-none focus:border-orange/50 transition-colors" />
              </div>

              <div>
                <label className="block text-white-dim text-sm mb-1.5">Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="What's this event about?" rows={4}
                  className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-muted focus:outline-none focus:border-orange/50 transition-colors resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white-dim text-sm mb-1.5">Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-white-dim text-sm mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange/50 transition-colors">
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-surface capitalize">{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-white-dim text-sm mb-1.5">Event Image</label>
                <div className="border border-dashed border-border rounded-xl p-4 text-center hover:border-orange/40 transition-colors">
                  {imagePreview ? (
                    <div className="relative">
                      <Image src={imagePreview} alt="preview" width={400} height={200} className="w-full h-36 object-cover rounded-lg" />
                      <button onClick={() => { setImagePreview(""); setImageFile(null); setForm({ ...form, image_url: "" }); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-bg/80 rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors">
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload size={20} className="text-muted mx-auto mb-2" />
                      <p className="text-muted text-xs">Click to upload image</p>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Featured toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setForm({ ...form, highlight: !form.highlight })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${form.highlight ? "bg-orange" : "bg-surface-2 border border-border"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${form.highlight ? "right-0.5" : "left-0.5"}`} />
                </div>
                <span className="text-white-dim text-sm">Mark as Featured</span>
              </label>
            </div>

            {/* Modal footer */}
            <div className="p-5 border-t border-border flex items-center justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-muted text-sm hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || uploading}
                className="flex items-center gap-2 bg-orange text-bg px-5 py-2.5 rounded-xl font-syne font-700 text-sm hover:bg-orange-dim disabled:opacity-60 transition-colors" style={{ fontWeight: 700 }}>
                {(saving || uploading) ? <Loader2 size={15} className="animate-spin" /> : null}
                {editingId ? "Update Event" : "Create Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
