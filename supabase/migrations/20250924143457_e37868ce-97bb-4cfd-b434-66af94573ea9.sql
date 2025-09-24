-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('media', 'media', false),
  ('projects', 'projects', false);

-- Create storage policies for media bucket
CREATE POLICY "Media bucket access for authenticated users" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'media' AND
    auth.role() = 'authenticated'
  );

-- Create storage policies for projects bucket  
CREATE POLICY "Projects bucket access for authenticated users" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'projects' AND
    auth.role() = 'authenticated'
  );

-- Seed data - Create demo tenant and superuser
-- Insert demo tenant
INSERT INTO public.tenants (id, nombre, slug, plan, activo)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Demo Tenant',
  'demo',
  'premium',
  true
);

-- Note: Superuser will be created via Edge Function since we can't directly insert into auth.users
-- The Edge Function will handle creating superadmin@smartroom.local with platform_role='superuser'

-- Insert demo hotel
INSERT INTO public.hotels (id, tenant_id, nombre, codigo_hotel, branding, theme, timezone)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Hotel Hilton Madrid',
  'HILTON_MAD',
  '{"logo": "/media/demo/hilton-logo.png", "colors": {"primary": "#1e40af", "secondary": "#f59e0b"}}',
  '{"darkMode": false, "fontSize": "medium"}',
  'Europe/Madrid'
);

-- Insert demo rooms
INSERT INTO public.rooms (hotel_id, codigo_habitacion, tipo, estado)
VALUES 
  ('22222222-2222-2222-2222-222222222222', '0815', 'Suite', 'libre'),
  ('22222222-2222-2222-2222-222222222222', '0816', 'Deluxe', 'ocupada'),
  ('22222222-2222-2222-2222-222222222222', '0901', 'Standard', 'libre');

-- Insert demo businesses (one per type)
INSERT INTO public.businesses (id, tenant_id, tipo, nombre, ubicacion, branding)
VALUES 
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'totem', 'Lobby Totem', 'Hotel Lobby', '{"theme": "dark"}'),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'ads', 'Digital Signage', 'Elevator Area', '{"autoplay": true}'),
  ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'events', 'Event Display', 'Conference Room', '{"layout": "calendar"}');

-- Insert demo devices (one per business)
INSERT INTO public.devices (id, business_id, codigo, tipo, layout, widgets, timezone)
VALUES 
  ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'TOTEM_001', 'totem', '{"columns": 2}', '{"weather": true, "news": true}', 'Europe/Madrid'),
  ('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'ADS_001', 'ads', '{"orientation": "landscape"}', '{"transitions": "fade"}', 'Europe/Madrid'),
  ('88888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555', 'EVENT_001', 'events', '{"view": "week"}', '{"reminders": true}', 'Europe/Madrid');

-- Insert demo media assets
INSERT INTO public.media_assets (id, tenant_id, url, tipo, width, height, size_bytes, tags, hash)
VALUES 
  ('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', '/media/demo/hotel-welcome.jpg', 'image', 1920, 1080, 245760, '["welcome", "hotel", "lobby"]', 'abc123def456'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '/media/demo/promo-video.mp4', 'video', 1280, 720, 15728640, '["promo", "hotel", "services"]', 'def456ghi789');

-- Insert demo app release
INSERT INTO public.app_releases (id, app_type, hotel_slug, version, storage_path, checksum_sha256, size_bytes, published_at, notes, is_latest)
VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'android_tv',
  'HILTON_MAD',
  'v1.0.0',
  '/projects/android_tv/HILTON_MAD/v1.0.0/smartroom-tv.apk',
  'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  12582912,
  now(),
  'Initial release for Hilton Madrid',
  true
);

-- Insert demo app
INSERT INTO public.apps (id, tenant_id, slug, tipo, nombre, descripcion, repo_url, metadata)
VALUES (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  'smartroom-tv',
  'android_tv',
  'SmartRoom TV App',
  'Android TV application for hotel room entertainment',
  'https://github.com/smartroom/tv-app',
  '{"version": "1.0.0", "minSdk": 21}'
);

-- Insert demo content pages
INSERT INTO public.content_pages (id, app_id, slug, titulo, estado, orden)
VALUES (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'welcome',
  'Página de Bienvenida',
  'published',
  1
);

-- Insert demo content blocks
INSERT INTO public.content_blocks (id, page_id, tipo, contenido, orden, visibilidad)
VALUES (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'text',
  '{"title": "Bienvenido al Hotel", "body": "Disfrute de su estancia en nuestro hotel de lujo."}',
  1,
  '{"roles": ["guest", "member"]}'
);

-- Insert demo i18n strings
INSERT INTO public.i18n_strings (tenant_id, namespace, key, value)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'tv_app', 'welcome_message', '{"es": "Bienvenido", "en": "Welcome", "fr": "Bienvenue"}'),
  ('11111111-1111-1111-1111-111111111111', 'tv_app', 'menu_services', '{"es": "Servicios", "en": "Services", "fr": "Services"}');

-- Insert demo platform providers (OTT)
INSERT INTO public.platform_providers (id, tenant_id, nombre, slug, tipo, homepage, terms_url, notes)
VALUES 
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'Netflix', 'netflix', 'ott', 'https://netflix.com', 'https://netflix.com/terms', 'Popular streaming service'),
  ('10101010-1010-1010-1010-101010101010', '11111111-1111-1111-1111-111111111111', 'Disney+', 'disney-plus', 'ott', 'https://disneyplus.com', 'https://disneyplus.com/terms', 'Disney streaming platform');

-- Insert demo device platform installations
INSERT INTO public.device_platform_installs (device_id, provider_id, installed, install_source, subscription_status, subscription_expires_at, account_alias, last_checked_at)
VALUES 
  ('66666666-6666-6666-6666-666666666666', 'ffffffff-ffff-ffff-ffff-ffffffffffff', true, 'playstore', 'active', now() + interval '30 days', 'hotel_account_netflix', now()),
  ('66666666-6666-6666-6666-666666666666', '10101010-1010-1010-1010-101010101010', true, 'playstore', 'trial', now() + interval '7 days', 'hotel_account_disney', now());

-- Insert demo platform credentials (encrypted simulation)
INSERT INTO public.platform_credentials (id, tenant_id, provider_id, scope, scope_id, username, secret_ciphertext, secret_algo, rotation_due_at, created_by)
VALUES (
  '12121212-1212-1212-1212-121212121212',
  '11111111-1111-1111-1111-111111111111',
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'tenant',
  '11111111-1111-1111-1111-111111111111',
  'hotel@example.com',
  decode('encrypted_password_simulation', 'escape'),
  'aes-gcm',
  now() + interval '60 days',
  null
);

-- Insert demo device commands
INSERT INTO public.device_commands (id, tenant_id, device_id, command, params, created_at, not_before, expires_at, priority, status)
VALUES 
  ('13131313-1313-1313-1313-131313131313', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'refresh_config', '{"force": true}', now(), null, now() + interval '1 hour', 1, 'queued'),
  ('14141414-1414-1414-1414-141414141414', '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 'show_message', '{"text": "Sistema actualizado correctamente", "duration": 5000}', now(), null, now() + interval '1 hour', 0, 'queued');

-- Insert demo analytics events
INSERT INTO public.analytics_events (tenant_id, hotel_id, device_id, source, event_type, payload, occurred_at, received_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'tv', 'app_launch', '{"version": "1.0.0", "room": "0815"}', now() - interval '1 hour', now() - interval '1 hour'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 'totem', 'interaction', '{"action": "menu_open", "section": "services"}', now() - interval '30 minutes', now() - interval '30 minutes');