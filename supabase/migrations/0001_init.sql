-- Extension buat UUID
create extension if not exists "pgcrypto";

-- ===== PRODUCTS =====
create table products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean default true,
  deleted_at timestamptz,

  normal_price numeric not null default 0,
  discount_price numeric,
  cost_price numeric,
  sku text,

  digital_type text not null default 'link' check (digital_type in ('file','link','text')),
  digital_file_url text,
  digital_link_url text,
  digital_text_content text,
  access_restricted boolean default false,

  auto_slide_images boolean default false,
  utm_enabled boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  sort_order int default 0
);

create table order_bumps (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  bump_product_id uuid not null references products(id),
  auto_checked boolean default false,
  sort_order int default 0
);

create table order_form_fields (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  key text not null,
  label text not null,
  required boolean default false,
  enabled boolean default true,
  sort_order int default 0
);

-- ===== CHECKOUT BUILDER =====
create table checkout_components (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references products(id) on delete cascade,
  header jsonb not null default '{}',
  content jsonb not null default '{}',
  footer jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- ===== ORDERS =====
create table orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id),
  order_number text not null unique,

  buyer_name text not null,
  buyer_phone text not null,
  buyer_email text,
  quantity int default 1,
  note text,

  status text not null default 'created' check (status in
    ('created','pending','confirmed','processing','ready_to_ship','shipped','completed','rts','canceled','refund')),
  payment_status text not null default 'belum_dibayar' check (payment_status in ('belum_dibayar','terbayar')),
  payment_method text,

  subtotal numeric default 0,
  bump_total numeric default 0,
  admin_fee numeric default 0,
  ppn numeric default 0,
  total numeric default 0,

  assignee_id uuid,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_orders_product_id on orders(product_id);
create index idx_orders_status on orders(status);
create index idx_orders_created_at on orders(created_at);

-- ===== PIXELS =====
create table pixels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  platform text not null check (platform in ('facebook','tiktok','google_ads','gtm','snack_video')),
  pixel_id text not null,
  pixel_name text not null,
  server_side_enabled boolean default false,
  access_token text,
  trigger_condition text,
  event_value_field text,
  test_event_code text,
  apply_to_all_products boolean default true,
  created_at timestamptz default now()
);

create table product_pixel_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  pixel_id uuid not null references pixels(id) on delete cascade,
  event_name text not null,
  trigger_mode text not null default 'every' check (trigger_mode in ('every','once'))
);

-- ===== MEMBERS & PERMISSIONS =====
create table members (
  id uuid primary key references auth.users(id),
  owner_id uuid not null references auth.users(id),
  name text not null,
  email text not null,
  phone text,
  role text not null default 'Staff',
  order_access_scope text not null default 'semua' check (order_access_scope in ('semua','hanya_diassign','hanya_produk_diassign')),
  permissions jsonb not null default '[]',
  created_at timestamptz default now()
);

-- ===== NOTIFIKASI & FOLLOW UP =====
create table notification_templates (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  scenario text not null check (scenario in ('order_masuk','reminder_belum_bayar','pembayaran_berhasil','produk_terkirim')),
  content text not null default '',
  updated_at timestamptz default now(),
  unique (owner_id, scenario)
);

create table follow_up_rules (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  scenario text not null,
  template_id uuid references notification_templates(id),
  delay_minutes int default 0,
  is_active boolean default false,
  unique (owner_id, scenario)
);

create table notification_settings (
  owner_id uuid primary key references auth.users(id),
  telegram_bot_token text,
  telegram_chat_id text,
  telegram_enabled boolean default false
);

-- ===== RLS =====
alter table products enable row level security;
alter table orders enable row level security;
alter table pixels enable row level security;
alter table members enable row level security;
alter table checkout_components enable row level security;

-- Produk: owner bisa CRUD produk miliknya sendiri
create policy "owner_manage_products" on products
  for all using (auth.uid() = owner_id);

-- Produk aktif bisa dibaca publik (buat landing page/checkout)
create policy "public_read_active_products" on products
  for select using (is_active = true);

-- Order: owner bisa lihat order dari produknya sendiri
create policy "owner_manage_orders" on orders
  for all using (
    exists (select 1 from products where products.id = orders.product_id and products.owner_id = auth.uid())
  );

-- Order: siapapun (buyer, belum login) bisa insert order baru
create policy "public_insert_orders" on orders
  for insert with check (true);

create policy "owner_manage_pixels" on pixels
  for all using (auth.uid() = owner_id);

create policy "owner_manage_checkout_components" on checkout_components
  for all using (
    exists (select 1 from products where products.id = checkout_components.product_id and products.owner_id = auth.uid())
  );

create policy "owner_manage_members" on members
  for all using (auth.uid() = owner_id or auth.uid() = id);