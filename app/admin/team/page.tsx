"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Users, Upload, Loader2 } from "lucide-react";
import { createClient, createUntypedClient } from "@/lib/supabase";
import type { TeamMember } from "@/types/database";
import toast from "react-hot-toast";

const POSITIONS = [
  "President", "Vice President", "Treasurer", "General Secretary",
  "Joint Secretary", "Core Advisor", "Design Head", "Public Relations Head",
  "Social Media Head", "Volunteering Head", "Content Head", "Coverage Head",
  "Decoration Head", "Video Editing Head", "PS & Marketing Head", "Technical Head", "Member",
];

const EMPTY_FORM = {
  name: "", roll_number: "", position: "Member",
  department: "", batch: "2024", order_index: 99, image_url: "",
};

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchTeam = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("team_members").select("*").order("order_index");
    if (data) setTeam(data);
    setLoading(false);
  };

  useEffect(() => { fetchTeam(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setModalOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setForm({
      name: m.name, roll_number: m.roll_number, position: m.position,
      department: m.department || "", batch: m.batch,
      order_index: m.order_index, image_url: m.image_url || "",
    });
    setImageFile(null);
    setImagePreview(m.image_url || "");
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
    const filename = `member-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("team").upload(filename, imageFile);
    setUploading(false);
    if (error) { toast.error("Image upload failed."); return null; }
    const { data } = supabase.storage.from("team").getPublicUrl(filename);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.name || !form.roll_number || !form.position) {
      toast.error("Name, roll number, and position are required.");
      return;
    }
    setSaving(true);
    try {
      const imageUrl = await uploadImage();
      const supabase = createUntypedClient();
      const payload = {
        name: form.name, roll_number: form.roll_number, position: form.position,
        department: form.department || null, batch: form.batch,
        order_index: Number(form.order_index), image_url: imageUrl,
      };

      if (editingId) {
        const { error } = await supabase.from("team_members").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Member updated!");
      } else {
        const { error } = await supabase.from("team_members").insert(payload);
        if (error) throw error;
        toast.success("Member added!");
      }
      setModalOpen(false);
      fetchTeam();
    } catch {
      toast.error("Failed to save member.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this team member?")) return;
    setDeleting(id);
    const supabase = createUntypedClient();
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) toast.error("Delete failed.");
    else { toast.success("Member removed."); fetchTeam(); }
    setDeleting(null);
  };

  function getAvatarGradient(name: string) {
    const gradients = ["from-orange/40 to-orange/20", "from-lime/40 to-lime/20", "from-blue-500/40 to-blue-500/20", "from-purple-500/40 to-purple-500/20"];
    return gradients[name.charCodeAt(0) % gradients.length];
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-800 text-2xl text-white" style={{ fontWeight: 800 }}>Team</h1>
          <p className="text-muted text-sm mt-0.5">{team.length} member{team.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-orange text-bg px-4 py-2.5 rounded-xl font-syne font-700 text-sm hover:bg-orange-dim transition-colors" style={{ fontWeight: 700 }}>
          <Plus size={16} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="glass-card rounded-xl p-4 animate-pulse flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-surface-2" />
              <div className="h-3 bg-surface-2 rounded w-3/4" />
              <div className="h-2 bg-surface-2 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : team.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Users size={40} className="text-muted mx-auto mb-3" />
          <p className="text-white font-syne font-700" style={{ fontWeight: 700 }}>No team members yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {team.map((m) => (
            <div key={m.id} className="glass-card rounded-xl p-4 text-center group relative">
              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(m)} className="w-7 h-7 rounded-lg bg-surface-2 flex items-center justify-center text-muted hover:text-white transition-colors">
                  <Pencil size={12} />
                </button>
                <button onClick={() => handleDelete(m.id)} disabled={deleting === m.id}
                  className="w-7 h-7 rounded-lg bg-surface-2 flex items-center justify-center text-muted hover:text-red-400 transition-colors">
                  {deleting === m.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                </button>
              </div>

              <div className="w-14 h-14 rounded-full mx-auto mb-2 overflow-hidden">
                {m.image_url ? (
                  <Image src={m.image_url} alt={m.name} width={56} height={56} className="object-cover w-full h-full" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getAvatarGradient(m.name)} flex items-center justify-center`}>
                    <span className="font-syne font-800 text-white text-lg" style={{ fontWeight: 800 }}>{m.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <p className="font-syne font-700 text-white text-sm leading-tight" style={{ fontWeight: 700 }}>{m.name}</p>
              <p className="text-orange text-xs mt-0.5">{m.position}</p>
              <p className="text-muted-2 text-xs">#{m.roll_number}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-bg/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl my-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <p className="font-syne font-700 text-white" style={{ fontWeight: 700 }}>
                {editingId ? "Edit Member" : "Add Member"}
              </p>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-4">
              {/* Avatar upload */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-2 flex-shrink-0">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="preview" width={64} height={64} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted text-2xl font-syne" style={{ fontWeight: 800 }}>
                      {form.name.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-muted text-sm hover:border-orange/40 hover:text-white transition-colors">
                    <Upload size={14} /> Upload photo
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {imagePreview && (
                    <button onClick={() => { setImagePreview(""); setImageFile(null); setForm({ ...form, image_url: "" }); }}
                      className="mt-1 text-xs text-muted hover:text-red-400 transition-colors">Remove photo</button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white-dim text-sm mb-1.5">Full Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-muted focus:outline-none focus:border-orange/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-white-dim text-sm mb-1.5">Roll Number *</label>
                  <input type="text" value={form.roll_number} onChange={e => setForm({ ...form, roll_number: e.target.value })}
                    placeholder="e.g. 24147"
                    className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-muted focus:outline-none focus:border-orange/50 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-white-dim text-sm mb-1.5">Position *</label>
                <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
                  className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange/50 transition-colors">
                  {POSITIONS.map(p => <option key={p} value={p} className="bg-surface">{p}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white-dim text-sm mb-1.5">Batch</label>
                  <input type="text" value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value })}
                    placeholder="2024"
                    className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-muted focus:outline-none focus:border-orange/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-white-dim text-sm mb-1.5">Display Order</label>
                  <input type="number" value={form.order_index} onChange={e => setForm({ ...form, order_index: Number(e.target.value) })}
                    className="w-full bg-surface-2 border border-border text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange/50 transition-colors" />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-border flex items-center justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-muted text-sm hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || uploading}
                className="flex items-center gap-2 bg-orange text-bg px-5 py-2.5 rounded-xl font-syne font-700 text-sm hover:bg-orange-dim disabled:opacity-60 transition-colors" style={{ fontWeight: 700 }}>
                {(saving || uploading) ? <Loader2 size={15} className="animate-spin" /> : null}
                {editingId ? "Update Member" : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
