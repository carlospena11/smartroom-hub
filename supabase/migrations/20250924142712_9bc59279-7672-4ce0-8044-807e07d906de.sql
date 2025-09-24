-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create custom types
CREATE TYPE public.app_role AS ENUM ('superuser', 'none');
CREATE TYPE public.tenant_role AS ENUM ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops');
CREATE TYPE public.room_status AS ENUM ('libre', 'ocupada', 'mantenimiento');
CREATE TYPE public.device_type AS ENUM ('totem', 'ads', 'events');
CREATE TYPE public.business_type AS ENUM ('totem', 'ads', 'events');
CREATE TYPE public.media_type AS ENUM ('image', 'video', 'svg');
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.content_block_type AS ENUM ('text', 'image', 'video', 'html', 'markdown', 'widget');
CREATE TYPE public.enrollment_status AS ENUM ('pending', 'active', 'revoked');
CREATE TYPE public.command_status AS ENUM ('queued', 'sent', 'ack', 'failed', 'expired');
CREATE TYPE public.command_type AS ENUM ('refresh_config', 'reboot_app', 'reboot_device', 'force_update', 'show_message', 'set_volume', 'set_input', 'capture_diag');
CREATE TYPE public.receipt_status AS ENUM ('received', 'ack', 'error');
CREATE TYPE public.platform_type AS ENUM ('ott', 'music', 'video', 'utility');
CREATE TYPE public.install_source AS ENUM ('playstore', 'sideload', 'mdm', 'unknown');
CREATE TYPE public.subscription_status AS ENUM ('none', 'trial', 'active', 'expired', 'suspended');
CREATE TYPE public.credential_scope AS ENUM ('tenant', 'hotel', 'device');
CREATE TYPE public.app_type AS ENUM ('android_tv', 'totem', 'ads', 'events', 'webapp', 'native');
CREATE TYPE public.scope_type AS ENUM ('tenant', 'hotel', 'business');
CREATE TYPE public.event_source_type AS ENUM ('ics', 'gcal', 'csv');
CREATE TYPE public.analytics_source AS ENUM ('tv', 'webapp', 'totem', 'ads');

-- Multi-tenant core tables
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    codigo_hotel TEXT UNIQUE NOT NULL,
    branding JSONB,
    theme JSONB,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    codigo_habitacion TEXT NOT NULL,
    tipo TEXT,
    estado public.room_status DEFAULT 'libre',
    overrides JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(hotel_id, codigo_habitacion)
);

-- Business and devices
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    tipo public.business_type NOT NULL,
    nombre TEXT NOT NULL,
    ubicacion TEXT,
    branding JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    codigo TEXT NOT NULL,
    tipo public.device_type NOT NULL,
    layout JSONB,
    widgets JSONB,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(business_id, codigo)
);

-- Media and menu
CREATE TABLE public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    tipo public.media_type NOT NULL,
    width INTEGER,
    height INTEGER,
    size_bytes BIGINT,
    tags JSONB,
    hash TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    icono_asset_id UUID REFERENCES public.media_assets(id),
    destino TEXT,
    orden INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Advertising and events
CREATE TABLE public.ad_playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.ad_playlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES public.ad_playlists(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES public.media_assets(id),
    duracion_seg INTEGER,
    orden INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.ad_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    prioridad INTEGER,
    reglas JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.event_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    tipo public.event_source_type NOT NULL,
    config JSONB,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Security, users and audit
CREATE TABLE public.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    nombre TEXT,
    platform_role public.app_role DEFAULT 'none',
    tenant_role public.tenant_role DEFAULT 'viewer',
    mfa_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    token_hash TEXT,
    scopes JSONB,
    last_rotated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    evento TEXT,
    endpoint_url TEXT,
    secreto TEXT,
    retry_policy JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id),
    actor_id UUID,
    accion TEXT,
    entidad TEXT,
    entidad_id UUID,
    diff JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- App repository
CREATE TABLE public.app_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_type public.app_type NOT NULL,
    hotel_slug TEXT,
    version TEXT NOT NULL,
    storage_path TEXT,
    checksum_sha256 TEXT,
    size_bytes BIGINT,
    published_at TIMESTAMPTZ,
    notes TEXT,
    is_latest BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(app_type, hotel_slug, version)
);

-- CMS for existing apps
CREATE TABLE public.apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    tipo public.app_type NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    repo_url TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.app_bindings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
    scope_type public.scope_type NOT NULL,
    scope_id UUID NOT NULL,
    UNIQUE(app_id, scope_type, scope_id)
);

CREATE TABLE public.content_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    titulo TEXT NOT NULL,
    estado public.content_status DEFAULT 'draft',
    orden INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(app_id, slug)
);

CREATE TABLE public.content_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES public.content_pages(id) ON DELETE CASCADE,
    tipo public.content_block_type NOT NULL,
    contenido JSONB,
    orden INTEGER,
    visibilidad JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES public.content_pages(id) ON DELETE CASCADE,
    numero INTEGER,
    diff JSONB,
    published_at TIMESTAMPTZ,
    published_by UUID,
    is_current BOOLEAN DEFAULT false
);

CREATE TABLE public.i18n_strings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    namespace TEXT NOT NULL,
    key TEXT NOT NULL,
    value JSONB,
    UNIQUE(tenant_id, namespace, key)
);

-- Device management, enrollment, impersonation
CREATE TABLE public.device_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    hotel_id UUID REFERENCES public.hotels(id),
    business_id UUID REFERENCES public.businesses(id),
    status public.enrollment_status DEFAULT 'pending',
    reason TEXT,
    enrolled_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ
);

CREATE TABLE public.device_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    app_version TEXT,
    network JSONB,
    last_seen_at TIMESTAMPTZ,
    power_state TEXT,
    notes TEXT
);

CREATE TABLE public.users_hotels (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    UNIQUE(user_id, hotel_id)
);

CREATE TABLE public.impersonation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES auth.users(id),
    impersonated_user_id UUID NOT NULL REFERENCES auth.users(id),
    reason TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    revoked BOOLEAN DEFAULT false
);

-- Analytics and aggregates (fixed idx_day)
CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    hotel_id UUID REFERENCES public.hotels(id),
    device_id UUID REFERENCES public.devices(id),
    user_id UUID REFERENCES auth.users(id),
    source public.analytics_source NOT NULL,
    event_type TEXT,
    payload JSONB,
    occurred_at TIMESTAMPTZ DEFAULT now(),
    received_at TIMESTAMPTZ DEFAULT now(),
    idx_day DATE
);

CREATE TABLE public.analytics_aggregates_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    hotel_id UUID REFERENCES public.hotels(id),
    metric TEXT NOT NULL,
    value NUMERIC,
    day DATE
);

-- Messaging/Commands to devices
CREATE TABLE public.device_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    command public.command_type NOT NULL,
    params JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    not_before TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    priority INTEGER DEFAULT 0,
    status public.command_status DEFAULT 'queued'
);

CREATE TABLE public.device_command_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID NOT NULL REFERENCES public.device_commands(id) ON DELETE CASCADE,
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    status public.receipt_status NOT NULL,
    details JSONB,
    received_at TIMESTAMPTZ DEFAULT now()
);

-- Digital platforms (OTT/streaming) and optional credentials
CREATE TABLE public.platform_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tipo public.platform_type NOT NULL,
    homepage TEXT,
    terms_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.device_platform_installs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.platform_providers(id) ON DELETE CASCADE,
    installed BOOLEAN DEFAULT false,
    install_source public.install_source DEFAULT 'playstore',
    subscription_status public.subscription_status DEFAULT 'none',
    subscription_expires_at TIMESTAMPTZ,
    account_alias TEXT,
    last_checked_at TIMESTAMPTZ,
    UNIQUE(device_id, provider_id)
);

CREATE TABLE public.platform_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.platform_providers(id) ON DELETE CASCADE,
    scope public.credential_scope DEFAULT 'tenant',
    scope_id UUID,
    username TEXT,
    secret_ciphertext BYTEA,
    secret_algo TEXT DEFAULT 'aes-gcm',
    rotation_due_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID
);

CREATE TABLE public.credential_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credential_id UUID NOT NULL REFERENCES public.platform_credentials(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id),
    device_id UUID REFERENCES public.devices(id),
    purpose TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB
);

-- Create recommended indexes
CREATE INDEX idx_hotels_codigo_hotel ON public.hotels(codigo_hotel);
CREATE INDEX idx_rooms_hotel_codigo ON public.rooms(hotel_id, codigo_habitacion);
CREATE INDEX idx_devices_business_codigo ON public.devices(business_id, codigo);
CREATE INDEX idx_media_assets_hash ON public.media_assets(hash);
CREATE INDEX idx_audit_logs_tenant_created ON public.audit_logs(tenant_id, created_at);
CREATE INDEX idx_app_releases_type_slug_latest ON public.app_releases(app_type, hotel_slug, is_latest);
CREATE INDEX idx_analytics_events_tenant_day ON public.analytics_events(tenant_id, idx_day);
CREATE INDEX idx_device_commands_device_status ON public.device_commands(device_id, status);

-- Create unique index for analytics_aggregates_daily with COALESCE
CREATE UNIQUE INDEX idx_analytics_aggregates_daily_unique 
ON public.analytics_aggregates_daily(tenant_id, COALESCE(hotel_id, '00000000-0000-0000-0000-000000000000'::uuid), metric, day);

-- Create trigger to automatically set idx_day on analytics_events
CREATE OR REPLACE FUNCTION set_analytics_idx_day()
RETURNS TRIGGER AS $$
BEGIN
    NEW.idx_day := DATE(NEW.occurred_at);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_analytics_idx_day
    BEFORE INSERT OR UPDATE ON public.analytics_events
    FOR EACH ROW
    EXECUTE FUNCTION set_analytics_idx_day();

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_bindings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.i18n_strings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impersonation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_aggregates_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_command_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_platform_installs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credential_access_logs ENABLE ROW LEVEL SECURITY;