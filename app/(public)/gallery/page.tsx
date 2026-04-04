"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Images } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { GalleryItem } from "@/types/database";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      try {
        const { data } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setItems(data);
      } catch { /* empty */ } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen pt-24 grid-bg">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-orange text-sm font-syne font-600 tracking-widest uppercase mb-3" style={{ fontWeight: 600 }}>
          Captured moments
        </p>
        <h1 className="font-syne font-800 text-4xl md:text-6xl text-white mb-4" style={{ fontWeight: 800 }}>
          Our <span className="gradient-text">Gallery</span>
        </h1>
        <p className="text-muted text-lg max-w-xl">
          A visual archive of all the chaos, colour, and community that EPMOC events bring to life.
        </p>
      </section>

      {/* Gallery grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
        {loading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-surface-2 rounded-xl mb-4"
                style={{ height: `${180 + (i % 3) * 60}px` }}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-32">
            <Images size={48} className="text-muted mx-auto mb-4" />
            <p className="text-muted text-lg font-syne">No photos yet.</p>
            <p className="text-muted-2 text-sm mt-2">Check back after our next event!</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative mb-4 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setLightbox(item)}
              >
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-white text-xs font-syne font-700 truncate" style={{ fontWeight: 700 }}>
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-white hover:bg-orange/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>
          <div
            className="relative max-w-4xl w-full max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.image_url}
              alt={lightbox.title}
              width={1200}
              height={800}
              className="object-contain max-h-[80vh] rounded-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-bg/90 to-transparent rounded-b-xl">
              <p className="text-white font-syne font-700" style={{ fontWeight: 700 }}>
                {lightbox.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
