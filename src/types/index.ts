// SmartRoom CMS Data Types - Based on hwocuptv_smartroom database structure

export interface Tenant {
  id: string;
  nombre: string;
  slug: string;
  plan: 'basic' | 'premium' | 'enterprise';
  activo: boolean;
}

export interface Hotel {
  id: string;
  tenant_id: string;
  nombre: string;
  codigo_hotel: string; // UNIQUE
  branding: {
    logo?: string;
    colores?: {
      primario: string;
      secundario: string;
    };
    fuentes?: {
      primaria: string;
      secundaria: string;
    };
  };
  theme: {
    layout: string;
    widgets: string[];
  };
}

export interface Room {
  id: string;
  hotel_id: string;
  codigo_habitacion: string;
  tipo: 'standard' | 'suite' | 'premium' | 'deluxe';
  estado: 'libre' | 'ocupada' | 'mantenimiento';
  overrides_contenido: {
    widgets?: string[];
    configuracion?: Record<string, any>;
  };
}

export interface Business {
  id: string;
  tenant_id: string;
  tipo: 'totem' | 'ads' | 'events';
  nombre: string;
  ubicacion: string;
  branding: {
    logo?: string;
    colores?: {
      primario: string;
      secundario: string;
    };
  };
}

export interface Device {
  id: string;
  business_id: string;
  codigo: string;
  tipo: 'totem' | 'ads' | 'events';
  layout: {
    template: string;
    configuracion: Record<string, any>;
  };
  widgets: {
    activos: string[];
    configuracion: Record<string, any>;
  };
  timezone: string;
}

export interface MediaAsset {
  id: string;
  tenant_id: string;
  url: string;
  tipo: 'image' | 'video' | 'svg';
  width: number;
  height: number;
  size_bytes: number;
  tags: string[];
  hash: string;
}

export interface MenuItem {
  id: string;
  hotel_id: string;
  titulo: string;
  icono_asset_id?: string;
  destino: string;
  orden: number;
}

export interface AdPlaylist {
  id: string;
  business_id: string;
  nombre: string;
}

export interface AdPlaylistItem {
  id: string;
  playlist_id: string;
  asset_id: string;
  duracion_seg: number;
  orden: number;
}

export interface AdCampaign {
  id: string;
  business_id: string;
  nombre: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  prioridad: number;
  reglas: {
    horarios?: string[];
    ubicaciones?: string[];
    condiciones?: Record<string, any>;
  };
}

export interface EventSource {
  id: string;
  business_id: string;
  tipo: 'ics' | 'gcal' | 'csv';
  config: {
    url?: string;
    credenciales?: Record<string, any>;
    mapeo_campos?: Record<string, string>;
  };
  activo: boolean;
}

export interface User {
  id: string;
  tenant_id: string;
  nombre: string;
  email: string;
  password?: string; // Only for creation/updates
  rol: 'admin' | 'editor' | 'viewer';
  two_factor_secret?: string;
}

export interface ApiKey {
  id: string;
  tenant_id: string;
  nombre: string;
  token_hash: string;
  scopes: string[];
  last_rotated_at: Date;
}

export interface Webhook {
  id: string;
  tenant_id: string;
  evento: string;
  endpoint_url: string;
  secreto: string;
  retry_policy: {
    max_attempts: number;
    backoff_multiplier: number;
  };
}

export interface AuditLog {
  id: string;
  tenant_id: string;
  actor_id: string;
  accion: string;
  entidad: string;
  entidad_id: string;
  diff: {
    antes?: Record<string, any>;
    despues?: Record<string, any>;
  };
  created_at: Date;
}

export interface AppRelease {
  id: string;
  app_type: 'android_tv' | 'totem' | 'ads' | 'events';
  hotel_slug: string;
  version: string;
  path: string;
  checksum_sha256: string;
  size_bytes: number;
  published_at: Date;
  notes: string;
  is_latest: boolean;
}