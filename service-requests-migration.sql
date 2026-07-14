-- ============================================================
-- Succevia Hub – Service Requests Table
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Create the service_requests table
create table if not exists service_requests (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  title           text not null,
  description     text not null,
  category        text not null,
  budget          text,
  country         text default 'Liberia',
  county          text,
  city            text,
  service_mode    text default 'both' check (service_mode in ('online', 'in_person', 'both')),
  urgency         text default 'medium' check (urgency in ('low', 'medium', 'high', 'urgent')),
  whatsapp        text not null,
  name            text,
  status          text default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  image_urls      text[] default '{}',
  is_visible      boolean default true
);

-- Index for fast queries
create index if not exists service_requests_status_idx on service_requests (status, created_at desc);
create index if not exists service_requests_category_idx on service_requests (category);

-- Row Level Security
alter table service_requests enable row level security;

-- Policy: anyone can read visible/open service requests
create policy "Public can view open service requests"
  on service_requests for select
  using (is_visible = true);

-- Policy: anyone can insert (users submit requests)
create policy "Anyone can submit service requests"
  on service_requests for insert
  with check (true);

-- Policy: service role (admin) can update/delete
create policy "Service role can update service requests"
  on service_requests for update
  using (true);

create policy "Service role can delete service requests"
  on service_requests for delete
  using (true);