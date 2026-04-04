"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, X, Images, Upload, Loader2 } from "lucide-react";
import { createClient, createUntypedClient } from "@/lib/supabase";
import type { GalleryItem, Event } from "@/types/database";
import toast from "react-hot-toast";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [eventId, setEventId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = async () => {
    const supabase = createClient();
    const [galleryRes, eventsRes] = await Promise.all([
      supabase.from("gallery").select("*").order("created_at", { ascending: false }),
      supabase.from("events").select("id, title").order("date", { ascending: false }),
    ]);
    if (galleryRes.data) setItems(galleryRes.data);
    if (eventsRes.data) setEvents(eventsRes.data as Event[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = () => {
    setTitle("");
    setEventId("");
    setImageFile(null);
    setImagePreview("");
    setModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!title || !imageFile) {
      toast.error("Title and image are required.");
      return;
    }
    setSaving(true);
    try {
      const supabase = createUntypedClient();
      const ext = imageFile.name.split(".").pop();
      const filename = `gallery-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("gallery").upload(filename, imageFile);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(filename);
      const { error: insertError } = await supabase.from("gallery").insert({
        title,
        image_url: urlData.publicUrl,
        event_id: eventId || null,
      });
      if (insertError) throw insertError;

      toast.success("Photo added!");
      setModalOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to upload photo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm("Delete this photo?")) return;
    setDeleting(item.id);
    const supabase = createUntypedClient();
    // Extract filename from URL
    const filename = item.image_url.split("/").pop();
    if (filename) await supabase.storage.from("gallery").remove([filename]);
    const { error } = await supabase.from("gallery").delete().eq("id", item.id);
    if (error) toast.error("Delete failed.");
    else { toast.success("Photo deleted."); fetchData(); }
    setDeleting(null);
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-800 text-2xl text-white" style={{ fontWeight: 800 }}>Gallery</h1>
          <p className="text-muted text-sm mt-0.5">{items.length} photo{items.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openModal}
          className="flex items-center gap-2 bg-orange text-bg px-4 py-2.5 rounded-xl font-syne font-700 text-sm hover:bg-orange-dim transition-colors" style={{ fontWeight: 700 }}>
          <Plus size={16} /> Upload Photo
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="aspect-square bg-surface-2 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Images size={40} className="text-muted mx-auto mb-3" />
          <p className="text-white font-syne font-700" style={{ fontWeight: 700 }}>No photos yet</p>
          <p className="text-muted text-sm mt-1">Upload photos from your events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden aspect-square bg-surface-2">
              <Image src={item.image_url} alt={item.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-bg/0 group-hover:bg-bg/60 transition-colors flex items-end">
                <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-xs font-syne font-700 truncate" style={{ fontWeight: 700 }}>{item.title}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(item)} disabled={deleting === item.id}
                className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-bg/80 flex items-center justify-center text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                {deleting === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <p className="font-syne font-700 text-white" style={{ fontWeight: 700 }}>Upload Photo</p>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-4">
              {/* Image dropzone */}
              <div className="border border-dashed border-border rounded-xl overflow-hidden hover:border-orange/40 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <Image src={imagePreview} alt="preview" width={400} height={240} className="w-full h-48 object-cover" />
                    <button onClick={() => { setImagePreview(""); setImageFile(null); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-bg/80 rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer p-8 flex flex-col items-center gap-2">
                    <Upload size={24} className="text-muted" />
                    <p className="text-muted text-sm">Click to select image</p>
                    <p className="text-muted-2 text-xs">JPG, PNG, WEBP supported</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-white-dim text-sm mb-1.5">Photo Title *</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Mridang 2k25 — Opening Night"
                  className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-muted focus:outline-none focus:border-orange/50 transition-colors" />
              </div>

              <div>
                <label className="block text-white-dim text-sm mb-1.5">Link to Event (optional)</label>
                <select value={eventId} onChange={e => setEventId(e.target.value)}
                  className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange/50 transition-colors">
                  <option value="" className="bg-surface">No event</option>
                  {events.map(ev => <option key={ev.id} value={ev.id} className="bg-surface">{ev.title}</option>)}
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-border flex items-center justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-muted text-sm hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-orange text-bg px-5 py-2.5 rounded-xl font-syne font-700 text-sm hover:bg-orange-dim disabled:opacity-60 transition-colors" style={{ fontWeight: 700 }}>
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                Upload Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
