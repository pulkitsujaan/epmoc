export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          image_url: string | null;
          category: string;
          highlight: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          image_url?: string | null;
          category?: string;
          highlight?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          date?: string;
          image_url?: string | null;
          category?: string;
          highlight?: boolean;
        };
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          roll_number: string;
          position: string;
          department: string | null;
          image_url: string | null;
          batch: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          roll_number: string;
          position: string;
          department?: string | null;
          image_url?: string | null;
          batch?: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          roll_number?: string;
          position?: string;
          department?: string | null;
          image_url?: string | null;
          batch?: string;
          order_index?: number;
        };
        Relationships: [];
      };
      gallery: {
        Row: {
          id: string;
          title: string;
          image_url: string;
          event_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          image_url: string;
          event_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          image_url?: string;
          event_id?: string | null;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          read?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Event = Database["public"]["Tables"]["events"]["Row"];
export type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];
export type GalleryItem = Database["public"]["Tables"]["gallery"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
