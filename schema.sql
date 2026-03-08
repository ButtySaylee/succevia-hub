-- ============================================================
-- Gbana Market – Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Drop table if re-running
drop table if exists listings;

-- Create the listings table
create table listings (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  title           text not null,
  description     text not null,
  price           text not null,
  category        text not null check (category in ('Electronics', 'Vehicles', 'Fashion', 'Property', 'Home', 'Other')),
  image_urls      text[] not null,
  seller_whatsapp text not null,
  seller_pin_hash text not null,
  is_approved     boolean default false,
  payment_status  text default 'pending'
);

-- Index for fast homepage queries (only approved)
create index listings_approved_idx on listings (is_approved, created_at desc);

-- Row Level Security
alter table listings enable row level security;

-- Policy: anyone can read approved listings
create policy "Public can view approved listings"
  on listings for select
  using (is_approved = true);

-- Policy: anyone can insert (sellers submit listings)
create policy "Anyone can insert listings"
  on listings for insert
  with check (true);

-- Policy: service role (admin) can update/delete
-- (Use the service_role key from the server / admin page)
create policy "Service role can update listings"
  on listings for update
  using (true);

create policy "Service role can delete listings"
  on listings for delete
  using (true);
