-- ============================================================
-- EPMOC Website Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- EVENTS TABLE
-- ============================================================
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  date date not null,
  image_url text,
  category text not null default 'cultural',
  highlight boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TEAM MEMBERS TABLE
-- ============================================================
create table if not exists team_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  roll_number text not null,
  position text not null,
  department text,
  image_url text,
  batch text not null default '2024',
  order_index integer not null default 99,
  created_at timestamptz not null default now()
);

-- ============================================================
-- GALLERY TABLE
-- ============================================================
create table if not exists gallery (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  image_url text not null,
  event_id uuid references events(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- CONTACT MESSAGES TABLE
-- ============================================================
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS
alter table events enable row level security;
alter table team_members enable row level security;
alter table gallery enable row level security;
alter table contact_messages enable row level security;

-- Public read access for public tables
create policy "Public can read events"
  on events for select to anon using (true);

create policy "Public can read team_members"
  on team_members for select to anon using (true);

create policy "Public can read gallery"
  on gallery for select to anon using (true);

-- Public can insert contact messages
create policy "Public can insert contact_messages"
  on contact_messages for insert to anon with check (true);

-- Authenticated users (admin) have full access
create policy "Authenticated full access events"
  on events for all to authenticated using (true) with check (true);

create policy "Authenticated full access team_members"
  on team_members for all to authenticated using (true) with check (true);

create policy "Authenticated full access gallery"
  on gallery for all to authenticated using (true) with check (true);

create policy "Authenticated full access contact_messages"
  on contact_messages for all to authenticated using (true) with check (true);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Create storage buckets (run separately if needed)
insert into storage.buckets (id, name, public) values ('events', 'events', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('team', 'team', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true) on conflict do nothing;

-- Storage policies - public read
create policy "Public read events bucket"
  on storage.objects for select to anon using (bucket_id = 'events');

create policy "Public read team bucket"
  on storage.objects for select to anon using (bucket_id = 'team');

create policy "Public read gallery bucket"
  on storage.objects for select to anon using (bucket_id = 'gallery');

-- Authenticated upload
create policy "Auth upload to events"
  on storage.objects for insert to authenticated with check (bucket_id = 'events');

create policy "Auth upload to team"
  on storage.objects for insert to authenticated with check (bucket_id = 'team');

create policy "Auth upload to gallery"
  on storage.objects for insert to authenticated with check (bucket_id = 'gallery');

create policy "Auth delete from events"
  on storage.objects for delete to authenticated using (bucket_id = 'events');

create policy "Auth delete from team"
  on storage.objects for delete to authenticated using (bucket_id = 'team');

create policy "Auth delete from gallery"
  on storage.objects for delete to authenticated using (bucket_id = 'gallery');

-- ============================================================
-- SEED DATA - Position Holders
-- ============================================================

insert into team_members (name, roll_number, position, batch, order_index) values
  ('Chirag Jain', '23218', 'President', '2023', 1),
  ('Tarsem Gulab', '23158', 'Vice President', '2023', 2),
  ('Pushparaj Dubey', '23145', 'Treasurer', '2023', 3),
  ('Pulkit', '24147', 'General Secretary', '2024', 4),
  ('Ujjaldeep Singh', '24424', 'Joint Secretary', '2024', 5),
  ('Rahul', '23149', 'Joint Secretary', '2023', 6),
  ('Shristi', '24122', 'Core Advisor', '2024', 7),
  ('Arvind Bhokal', '24310', 'Core Advisor', '2024', 8),
  ('Tanu', '24423', 'Design Head', '2024', 9),
  ('Shourya Seth', '24163', 'Public Relations Head', '2024', 10),
  ('Ankush Sharma', '24214', 'Social Media Head', '2024', 11),
  ('Kapil Shekhawat', '24126', 'Volunteering Head', '2024', 12),
  ('Riyansh Raj', '24417', 'Content Head', '2024', 13),
  ('Daksh Kumar', '24118', 'Coverage Head', '2024', 14),
  ('Sujal', '24422', 'Decoration Head', '2024', 15),
  ('Shray Chaudhary', '24164', 'Video Editing Head', '2024', 16),
  ('Rahul Chadak', '24516', 'PS & Marketing Head', '2024', 17),
  ('Aditya Pandey', '24305', 'PS & Marketing Head', '2024', 18),
  ('Moshish Chaudhary', '24341', 'Technical Head', '2024', 19);

-- Seed events
insert into events (title, description, date, category, highlight) values
  ('Mridang 2k25', 'The annual cultural extravaganza of IIIT Una — a vibrant celebration of music, dance, drama, and art bringing together talent from across the region. Mridang 2k25 was bigger and bolder than ever, packed with stellar performances and unforgettable memories.', '2025-03-15', 'cultural', true),
  ('Awaaz-e-Janata', 'The voice of the students — IIIT Una''s annual student election event organized by EPMOC. A landmark democratic exercise where students exercised their right to choose their representatives in a lively, transparent, and festive atmosphere.', '2025-02-10', 'governance', true),
  ('Treasure Hunt', 'An adrenaline-pumping campus-wide treasure hunt that tested teams'' wit, speed, and teamwork. Clue-chasing across every corner of IIIT Una, with some wild twists along the way.', '2024-11-20', 'fun', false);
