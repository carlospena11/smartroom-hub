import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProvisionRequest {
  codigoHotel: string;
  codigoHabitacion: string;
  deviceInfo?: {
    model?: string;
    version?: string;
    mac?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { codigoHotel, codigoHabitacion, deviceInfo }: ProvisionRequest = await req.json();

    if (!codigoHotel || !codigoHabitacion) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: codigoHotel, codigoHabitacion' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find hotel by codigo_hotel
    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .select(`
        *,
        tenant:tenants(*)
      `)
      .eq('codigo_hotel', codigoHotel)
      .single();

    if (hotelError || !hotel) {
      console.log('Hotel not found:', codigoHotel);
      return new Response(
        JSON.stringify({ error: 'Hotel not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find room by codigo_habitacion
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('hotel_id', hotel.id)
      .eq('codigo_habitacion', codigoHabitacion)
      .single();

    if (roomError || !room) {
      console.log('Room not found:', codigoHabitacion);
      return new Response(
        JSON.stringify({ error: 'Room not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get menu items for the hotel
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select(`
        *,
        icono_asset:media_assets(*)
      `)
      .eq('hotel_id', hotel.id)
      .order('orden');

    if (menuError) {
      console.error('Error fetching menu items:', menuError);
    }

    // Get media assets for the hotel
    const { data: assets, error: assetsError } = await supabase
      .from('media_assets')
      .select('*')
      .eq('tenant_id', hotel.tenant_id)
      .limit(10);

    if (assetsError) {
      console.error('Error fetching assets:', assetsError);
    }

    // Log audit event
    await supabase
      .from('audit_logs')
      .insert({
        tenant_id: hotel.tenant_id,
        accion: 'provision_request',
        entidad: 'device',
        entidad_id: null,
        diff: {
          hotel: codigoHotel,
          room: codigoHabitacion,
          device_info: deviceInfo
        },
        metadata: {
          ip: req.headers.get('x-forwarded-for') || 'unknown',
          user_agent: req.headers.get('user-agent') || 'unknown'
        }
      });

    const response = {
      hotel: {
        id: hotel.id,
        nombre: hotel.nombre,
        codigo: hotel.codigo_hotel,
        branding: hotel.branding,
        theme: hotel.theme,
        timezone: hotel.timezone
      },
      habitacion: {
        id: room.id,
        codigo: room.codigo_habitacion,
        tipo: room.tipo,
        estado: room.estado,
        overrides: room.overrides
      },
      menuTV: menuItems || [],
      assets: assets || [],
      refreshTTL: 300, // 5 minutes
      tenant: {
        nombre: hotel.tenant.nombre,
        slug: hotel.tenant.slug
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        } 
      }
    );

  } catch (error) {
    console.error('Provision error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});