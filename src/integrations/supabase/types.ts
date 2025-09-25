export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ad_campaigns: {
        Row: {
          business_id: string
          created_at: string | null
          fecha_fin: string | null
          fecha_inicio: string | null
          id: string
          nombre: string
          prioridad: number | null
          reglas: Json | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: string
          nombre: string
          prioridad?: number | null
          reglas?: Json | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: string
          nombre?: string
          prioridad?: number | null
          reglas?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_campaigns_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_playlist_items: {
        Row: {
          asset_id: string
          created_at: string | null
          duracion_seg: number | null
          id: string
          orden: number | null
          playlist_id: string
        }
        Insert: {
          asset_id: string
          created_at?: string | null
          duracion_seg?: number | null
          id?: string
          orden?: number | null
          playlist_id: string
        }
        Update: {
          asset_id?: string
          created_at?: string | null
          duracion_seg?: number | null
          id?: string
          orden?: number | null
          playlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_playlist_items_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_playlist_items_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "ad_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_playlists: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          nombre: string
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          nombre: string
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_playlists_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_aggregates_daily: {
        Row: {
          day: string | null
          hotel_id: string | null
          id: string
          metric: string
          tenant_id: string
          value: number | null
        }
        Insert: {
          day?: string | null
          hotel_id?: string | null
          id?: string
          metric: string
          tenant_id: string
          value?: number | null
        }
        Update: {
          day?: string | null
          hotel_id?: string | null
          id?: string
          metric?: string
          tenant_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_aggregates_daily_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_aggregates_daily_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          device_id: string | null
          event_type: string | null
          hotel_id: string | null
          id: string
          idx_day: string | null
          occurred_at: string | null
          payload: Json | null
          received_at: string | null
          source: Database["public"]["Enums"]["analytics_source"]
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          device_id?: string | null
          event_type?: string | null
          hotel_id?: string | null
          id?: string
          idx_day?: string | null
          occurred_at?: string | null
          payload?: Json | null
          received_at?: string | null
          source: Database["public"]["Enums"]["analytics_source"]
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          device_id?: string | null
          event_type?: string | null
          hotel_id?: string | null
          id?: string
          idx_day?: string | null
          occurred_at?: string | null
          payload?: Json | null
          received_at?: string | null
          source?: Database["public"]["Enums"]["analytics_source"]
          tenant_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          last_rotated_at: string | null
          nombre: string
          scopes: Json | null
          tenant_id: string
          token_hash: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_rotated_at?: string | null
          nombre: string
          scopes?: Json | null
          tenant_id: string
          token_hash?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_rotated_at?: string | null
          nombre?: string
          scopes?: Json | null
          tenant_id?: string
          token_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      app_bindings: {
        Row: {
          app_id: string
          id: string
          scope_id: string
          scope_type: Database["public"]["Enums"]["scope_type"]
        }
        Insert: {
          app_id: string
          id?: string
          scope_id: string
          scope_type: Database["public"]["Enums"]["scope_type"]
        }
        Update: {
          app_id?: string
          id?: string
          scope_id?: string
          scope_type?: Database["public"]["Enums"]["scope_type"]
        }
        Relationships: [
          {
            foreignKeyName: "app_bindings_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
      }
      app_releases: {
        Row: {
          app_type: Database["public"]["Enums"]["app_type"]
          checksum_sha256: string | null
          created_at: string | null
          hotel_slug: string | null
          id: string
          is_latest: boolean | null
          notes: string | null
          published_at: string | null
          size_bytes: number | null
          storage_path: string | null
          version: string
        }
        Insert: {
          app_type: Database["public"]["Enums"]["app_type"]
          checksum_sha256?: string | null
          created_at?: string | null
          hotel_slug?: string | null
          id?: string
          is_latest?: boolean | null
          notes?: string | null
          published_at?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          version: string
        }
        Update: {
          app_type?: Database["public"]["Enums"]["app_type"]
          checksum_sha256?: string | null
          created_at?: string | null
          hotel_slug?: string | null
          id?: string
          is_latest?: boolean | null
          notes?: string | null
          published_at?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          version?: string
        }
        Relationships: []
      }
      apps: {
        Row: {
          created_at: string | null
          descripcion: string | null
          id: string
          metadata: Json | null
          nombre: string
          repo_url: string | null
          slug: string
          tenant_id: string
          tipo: Database["public"]["Enums"]["app_type"]
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: string
          metadata?: Json | null
          nombre: string
          repo_url?: string | null
          slug: string
          tenant_id: string
          tipo: Database["public"]["Enums"]["app_type"]
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: string
          metadata?: Json | null
          nombre?: string
          repo_url?: string | null
          slug?: string
          tenant_id?: string
          tipo?: Database["public"]["Enums"]["app_type"]
        }
        Relationships: [
          {
            foreignKeyName: "apps_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          accion: string | null
          actor_id: string | null
          created_at: string | null
          diff: Json | null
          entidad: string | null
          entidad_id: string | null
          id: string
          metadata: Json | null
          tenant_id: string | null
        }
        Insert: {
          accion?: string | null
          actor_id?: string | null
          created_at?: string | null
          diff?: Json | null
          entidad?: string | null
          entidad_id?: string | null
          id?: string
          metadata?: Json | null
          tenant_id?: string | null
        }
        Update: {
          accion?: string | null
          actor_id?: string | null
          created_at?: string | null
          diff?: Json | null
          entidad?: string | null
          entidad_id?: string | null
          id?: string
          metadata?: Json | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          branding: Json | null
          created_at: string | null
          id: string
          nombre: string
          tenant_id: string
          tipo: Database["public"]["Enums"]["business_type"]
          ubicacion: string | null
        }
        Insert: {
          branding?: Json | null
          created_at?: string | null
          id?: string
          nombre: string
          tenant_id: string
          tipo: Database["public"]["Enums"]["business_type"]
          ubicacion?: string | null
        }
        Update: {
          branding?: Json | null
          created_at?: string | null
          id?: string
          nombre?: string
          tenant_id?: string
          tipo?: Database["public"]["Enums"]["business_type"]
          ubicacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          contenido: Json | null
          created_at: string | null
          id: string
          orden: number | null
          page_id: string
          tipo: Database["public"]["Enums"]["content_block_type"]
          visibilidad: Json | null
        }
        Insert: {
          contenido?: Json | null
          created_at?: string | null
          id?: string
          orden?: number | null
          page_id: string
          tipo: Database["public"]["Enums"]["content_block_type"]
          visibilidad?: Json | null
        }
        Update: {
          contenido?: Json | null
          created_at?: string | null
          id?: string
          orden?: number | null
          page_id?: string
          tipo?: Database["public"]["Enums"]["content_block_type"]
          visibilidad?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "content_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      content_pages: {
        Row: {
          app_id: string
          created_at: string | null
          estado: Database["public"]["Enums"]["content_status"] | null
          id: string
          orden: number | null
          slug: string
          titulo: string
        }
        Insert: {
          app_id: string
          created_at?: string | null
          estado?: Database["public"]["Enums"]["content_status"] | null
          id?: string
          orden?: number | null
          slug: string
          titulo: string
        }
        Update: {
          app_id?: string
          created_at?: string | null
          estado?: Database["public"]["Enums"]["content_status"] | null
          id?: string
          orden?: number | null
          slug?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_pages_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
      }
      content_versions: {
        Row: {
          diff: Json | null
          id: string
          is_current: boolean | null
          numero: number | null
          page_id: string
          published_at: string | null
          published_by: string | null
        }
        Insert: {
          diff?: Json | null
          id?: string
          is_current?: boolean | null
          numero?: number | null
          page_id: string
          published_at?: string | null
          published_by?: string | null
        }
        Update: {
          diff?: Json | null
          id?: string
          is_current?: boolean | null
          numero?: number | null
          page_id?: string
          published_at?: string | null
          published_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_versions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "content_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      credential_access_logs: {
        Row: {
          actor_id: string | null
          created_at: string | null
          credential_id: string
          device_id: string | null
          id: string
          metadata: Json | null
          purpose: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          credential_id: string
          device_id?: string | null
          id?: string
          metadata?: Json | null
          purpose?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          credential_id?: string
          device_id?: string | null
          id?: string
          metadata?: Json | null
          purpose?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credential_access_logs_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "platform_credentials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credential_access_logs_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_command_receipts: {
        Row: {
          command_id: string
          details: Json | null
          device_id: string
          id: string
          received_at: string | null
          status: Database["public"]["Enums"]["receipt_status"]
        }
        Insert: {
          command_id: string
          details?: Json | null
          device_id: string
          id?: string
          received_at?: string | null
          status: Database["public"]["Enums"]["receipt_status"]
        }
        Update: {
          command_id?: string
          details?: Json | null
          device_id?: string
          id?: string
          received_at?: string | null
          status?: Database["public"]["Enums"]["receipt_status"]
        }
        Relationships: [
          {
            foreignKeyName: "device_command_receipts_command_id_fkey"
            columns: ["command_id"]
            isOneToOne: false
            referencedRelation: "device_commands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_command_receipts_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_commands: {
        Row: {
          command: Database["public"]["Enums"]["command_type"]
          created_at: string | null
          device_id: string
          expires_at: string | null
          id: string
          not_before: string | null
          params: Json | null
          priority: number | null
          status: Database["public"]["Enums"]["command_status"] | null
          tenant_id: string
        }
        Insert: {
          command: Database["public"]["Enums"]["command_type"]
          created_at?: string | null
          device_id: string
          expires_at?: string | null
          id?: string
          not_before?: string | null
          params?: Json | null
          priority?: number | null
          status?: Database["public"]["Enums"]["command_status"] | null
          tenant_id: string
        }
        Update: {
          command?: Database["public"]["Enums"]["command_type"]
          created_at?: string | null
          device_id?: string
          expires_at?: string | null
          id?: string
          not_before?: string | null
          params?: Json | null
          priority?: number | null
          status?: Database["public"]["Enums"]["command_status"] | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_commands_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_commands_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      device_enrollments: {
        Row: {
          business_id: string | null
          device_id: string
          enrolled_at: string | null
          hotel_id: string | null
          id: string
          reason: string | null
          revoked_at: string | null
          status: Database["public"]["Enums"]["enrollment_status"] | null
        }
        Insert: {
          business_id?: string | null
          device_id: string
          enrolled_at?: string | null
          hotel_id?: string | null
          id?: string
          reason?: string | null
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
        }
        Update: {
          business_id?: string | null
          device_id?: string
          enrolled_at?: string | null
          hotel_id?: string | null
          id?: string
          reason?: string | null
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "device_enrollments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_enrollments_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_enrollments_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      device_platform_installs: {
        Row: {
          account_alias: string | null
          device_id: string
          id: string
          install_source: Database["public"]["Enums"]["install_source"] | null
          installed: boolean | null
          last_checked_at: string | null
          provider_id: string
          subscription_expires_at: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
        }
        Insert: {
          account_alias?: string | null
          device_id: string
          id?: string
          install_source?: Database["public"]["Enums"]["install_source"] | null
          installed?: boolean | null
          last_checked_at?: string | null
          provider_id: string
          subscription_expires_at?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
        }
        Update: {
          account_alias?: string | null
          device_id?: string
          id?: string
          install_source?: Database["public"]["Enums"]["install_source"] | null
          installed?: boolean | null
          last_checked_at?: string | null
          provider_id?: string
          subscription_expires_at?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "device_platform_installs_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_platform_installs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "platform_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      device_status: {
        Row: {
          app_version: string | null
          device_id: string
          id: string
          last_seen_at: string | null
          network: Json | null
          notes: string | null
          power_state: string | null
        }
        Insert: {
          app_version?: string | null
          device_id: string
          id?: string
          last_seen_at?: string | null
          network?: Json | null
          notes?: string | null
          power_state?: string | null
        }
        Update: {
          app_version?: string | null
          device_id?: string
          id?: string
          last_seen_at?: string | null
          network?: Json | null
          notes?: string | null
          power_state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_status_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          business_id: string
          codigo: string
          created_at: string | null
          id: string
          layout: Json | null
          timezone: string | null
          tipo: Database["public"]["Enums"]["device_type"]
          widgets: Json | null
        }
        Insert: {
          business_id: string
          codigo: string
          created_at?: string | null
          id?: string
          layout?: Json | null
          timezone?: string | null
          tipo: Database["public"]["Enums"]["device_type"]
          widgets?: Json | null
        }
        Update: {
          business_id?: string
          codigo?: string
          created_at?: string | null
          id?: string
          layout?: Json | null
          timezone?: string | null
          tipo?: Database["public"]["Enums"]["device_type"]
          widgets?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      event_sources: {
        Row: {
          activo: boolean | null
          business_id: string
          config: Json | null
          created_at: string | null
          id: string
          tipo: Database["public"]["Enums"]["event_source_type"]
        }
        Insert: {
          activo?: boolean | null
          business_id: string
          config?: Json | null
          created_at?: string | null
          id?: string
          tipo: Database["public"]["Enums"]["event_source_type"]
        }
        Update: {
          activo?: boolean | null
          business_id?: string
          config?: Json | null
          created_at?: string | null
          id?: string
          tipo?: Database["public"]["Enums"]["event_source_type"]
        }
        Relationships: [
          {
            foreignKeyName: "event_sources_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          branding: Json | null
          codigo_hotel: string
          created_at: string | null
          id: string
          nombre: string
          tenant_id: string
          theme: Json | null
          timezone: string | null
        }
        Insert: {
          branding?: Json | null
          codigo_hotel: string
          created_at?: string | null
          id?: string
          nombre: string
          tenant_id: string
          theme?: Json | null
          timezone?: string | null
        }
        Update: {
          branding?: Json | null
          codigo_hotel?: string
          created_at?: string | null
          id?: string
          nombre?: string
          tenant_id?: string
          theme?: Json | null
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotels_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      i18n_strings: {
        Row: {
          id: string
          key: string
          namespace: string
          tenant_id: string
          value: Json | null
        }
        Insert: {
          id?: string
          key: string
          namespace: string
          tenant_id: string
          value?: Json | null
        }
        Update: {
          id?: string
          key?: string
          namespace?: string
          tenant_id?: string
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "i18n_strings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      impersonation_sessions: {
        Row: {
          actor_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          impersonated_user_id: string
          reason: string | null
          revoked: boolean | null
        }
        Insert: {
          actor_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          impersonated_user_id: string
          reason?: string | null
          revoked?: boolean | null
        }
        Update: {
          actor_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          impersonated_user_id?: string
          reason?: string | null
          revoked?: boolean | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          created_at: string | null
          hash: string | null
          height: number | null
          id: string
          size_bytes: number | null
          tags: Json | null
          tenant_id: string
          tipo: Database["public"]["Enums"]["media_type"]
          url: string
          width: number | null
        }
        Insert: {
          created_at?: string | null
          hash?: string | null
          height?: number | null
          id?: string
          size_bytes?: number | null
          tags?: Json | null
          tenant_id: string
          tipo: Database["public"]["Enums"]["media_type"]
          url: string
          width?: number | null
        }
        Update: {
          created_at?: string | null
          hash?: string | null
          height?: number | null
          id?: string
          size_bytes?: number | null
          tags?: Json | null
          tenant_id?: string
          tipo?: Database["public"]["Enums"]["media_type"]
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          created_at: string | null
          destino: string | null
          hotel_id: string
          icono_asset_id: string | null
          id: string
          orden: number | null
          titulo: string
        }
        Insert: {
          created_at?: string | null
          destino?: string | null
          hotel_id: string
          icono_asset_id?: string | null
          id?: string
          orden?: number | null
          titulo: string
        }
        Update: {
          created_at?: string | null
          destino?: string | null
          hotel_id?: string
          icono_asset_id?: string | null
          id?: string
          orden?: number | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_icono_asset_id_fkey"
            columns: ["icono_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_credentials: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          provider_id: string
          rotation_due_at: string | null
          scope: Database["public"]["Enums"]["credential_scope"] | null
          scope_id: string | null
          secret_algo: string | null
          secret_ciphertext: string | null
          tenant_id: string
          username: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          provider_id: string
          rotation_due_at?: string | null
          scope?: Database["public"]["Enums"]["credential_scope"] | null
          scope_id?: string | null
          secret_algo?: string | null
          secret_ciphertext?: string | null
          tenant_id: string
          username?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          provider_id?: string
          rotation_due_at?: string | null
          scope?: Database["public"]["Enums"]["credential_scope"] | null
          scope_id?: string | null
          secret_algo?: string | null
          secret_ciphertext?: string | null
          tenant_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_credentials_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "platform_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_credentials_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_providers: {
        Row: {
          created_at: string | null
          homepage: string | null
          id: string
          nombre: string
          notes: string | null
          slug: string
          tenant_id: string
          terms_url: string | null
          tipo: Database["public"]["Enums"]["platform_type"]
        }
        Insert: {
          created_at?: string | null
          homepage?: string | null
          id?: string
          nombre: string
          notes?: string | null
          slug: string
          tenant_id: string
          terms_url?: string | null
          tipo: Database["public"]["Enums"]["platform_type"]
        }
        Update: {
          created_at?: string | null
          homepage?: string | null
          id?: string
          nombre?: string
          notes?: string | null
          slug?: string
          tenant_id?: string
          terms_url?: string | null
          tipo?: Database["public"]["Enums"]["platform_type"]
        }
        Relationships: [
          {
            foreignKeyName: "platform_providers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          mfa_enabled: boolean | null
          nombre: string | null
          platform_role: Database["public"]["Enums"]["app_role"] | null
          tenant_id: string | null
          tenant_role: Database["public"]["Enums"]["tenant_role"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          mfa_enabled?: boolean | null
          nombre?: string | null
          platform_role?: Database["public"]["Enums"]["app_role"] | null
          tenant_id?: string | null
          tenant_role?: Database["public"]["Enums"]["tenant_role"] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          mfa_enabled?: boolean | null
          nombre?: string | null
          platform_role?: Database["public"]["Enums"]["app_role"] | null
          tenant_id?: string | null
          tenant_role?: Database["public"]["Enums"]["tenant_role"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      project_templates: {
        Row: {
          background_image: string | null
          created_at: string
          created_by: string | null
          description: string | null
          elements: Json
          id: string
          is_public: boolean | null
          name: string
          tags: string[] | null
          tenant_id: string
          thumbnail_url: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          background_image?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          elements?: Json
          id?: string
          is_public?: boolean | null
          name: string
          tags?: string[] | null
          tenant_id: string
          thumbnail_url?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          background_image?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          elements?: Json
          id?: string
          is_public?: boolean | null
          name?: string
          tags?: string[] | null
          tenant_id?: string
          thumbnail_url?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          codigo_habitacion: string
          created_at: string | null
          estado: Database["public"]["Enums"]["room_status"] | null
          hotel_id: string
          id: string
          overrides: Json | null
          tipo: string | null
        }
        Insert: {
          codigo_habitacion: string
          created_at?: string | null
          estado?: Database["public"]["Enums"]["room_status"] | null
          hotel_id: string
          id?: string
          overrides?: Json | null
          tipo?: string | null
        }
        Update: {
          codigo_habitacion?: string
          created_at?: string | null
          estado?: Database["public"]["Enums"]["room_status"] | null
          hotel_id?: string
          id?: string
          overrides?: Json | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          activo: boolean | null
          created_at: string | null
          id: string
          nombre: string
          plan: string | null
          slug: string
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          nombre: string
          plan?: string | null
          slug: string
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          nombre?: string
          plan?: string | null
          slug?: string
        }
        Relationships: []
      }
      users_hotels: {
        Row: {
          hotel_id: string
          user_id: string
        }
        Insert: {
          hotel_id: string
          user_id: string
        }
        Update: {
          hotel_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_hotels_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string | null
          endpoint_url: string | null
          evento: string | null
          id: string
          retry_policy: Json | null
          secreto: string | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          endpoint_url?: string | null
          evento?: string | null
          id?: string
          retry_policy?: Json | null
          secreto?: string | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          endpoint_url?: string | null
          evento?: string | null
          id?: string
          retry_policy?: Json | null
          secreto?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_platform_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["tenant_role"]
      }
      get_user_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_has_hotel_access: {
        Args: { hotel_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      analytics_source: "tv" | "webapp" | "totem" | "ads"
      app_role: "superuser" | "none"
      app_type: "android_tv" | "totem" | "ads" | "events" | "webapp" | "native"
      business_type: "totem" | "ads" | "events"
      command_status: "queued" | "sent" | "ack" | "failed" | "expired"
      command_type:
        | "refresh_config"
        | "reboot_app"
        | "reboot_device"
        | "force_update"
        | "show_message"
        | "set_volume"
        | "set_input"
        | "capture_diag"
      content_block_type:
        | "text"
        | "image"
        | "video"
        | "html"
        | "markdown"
        | "widget"
      content_status: "draft" | "published" | "archived"
      credential_scope: "tenant" | "hotel" | "device"
      device_type: "totem" | "ads" | "events"
      enrollment_status: "pending" | "active" | "revoked"
      event_source_type: "ics" | "gcal" | "csv"
      install_source: "playstore" | "sideload" | "mdm" | "unknown"
      media_type: "image" | "video" | "svg"
      platform_type: "ott" | "music" | "video" | "utility"
      receipt_status: "received" | "ack" | "error"
      room_status: "libre" | "ocupada" | "mantenimiento"
      scope_type: "tenant" | "hotel" | "business"
      subscription_status: "none" | "trial" | "active" | "expired" | "suspended"
      tenant_role: "tenant_admin" | "hotel_admin" | "editor" | "viewer" | "ops"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      analytics_source: ["tv", "webapp", "totem", "ads"],
      app_role: ["superuser", "none"],
      app_type: ["android_tv", "totem", "ads", "events", "webapp", "native"],
      business_type: ["totem", "ads", "events"],
      command_status: ["queued", "sent", "ack", "failed", "expired"],
      command_type: [
        "refresh_config",
        "reboot_app",
        "reboot_device",
        "force_update",
        "show_message",
        "set_volume",
        "set_input",
        "capture_diag",
      ],
      content_block_type: [
        "text",
        "image",
        "video",
        "html",
        "markdown",
        "widget",
      ],
      content_status: ["draft", "published", "archived"],
      credential_scope: ["tenant", "hotel", "device"],
      device_type: ["totem", "ads", "events"],
      enrollment_status: ["pending", "active", "revoked"],
      event_source_type: ["ics", "gcal", "csv"],
      install_source: ["playstore", "sideload", "mdm", "unknown"],
      media_type: ["image", "video", "svg"],
      platform_type: ["ott", "music", "video", "utility"],
      receipt_status: ["received", "ack", "error"],
      room_status: ["libre", "ocupada", "mantenimiento"],
      scope_type: ["tenant", "hotel", "business"],
      subscription_status: ["none", "trial", "active", "expired", "suspended"],
      tenant_role: ["tenant_admin", "hotel_admin", "editor", "viewer", "ops"],
    },
  },
} as const
