import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const hotel = url.searchParams.get('hotel');
    const room = url.searchParams.get('room');

    if (!hotel || !room) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: hotel, room' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get hotel and room configuration
    const { data: hotelData, error: hotelError } = await supabase
      .from('hotels')
      .select(`
        *,
        tenant:tenants(*),
        rooms!inner(*)
      `)
      .eq('codigo_hotel', hotel)
      .eq('rooms.codigo_habitacion', room)
      .single();

    if (hotelError || !hotelData) {
      return new Response(
        JSON.stringify({ error: 'Configuration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get menu items with assets
    const { data: menuItems } = await supabase
      .from('menu_items')
      .select(`
        *,
        icono_asset:media_assets(url, tipo, width, height)
      `)
      .eq('hotel_id', hotelData.id)
      .order('orden');

    // Get media assets with signed URLs
    const { data: assets } = await supabase
      .from('media_assets')
      .select('*')
      .eq('tenant_id', hotelData.tenant_id);

    // Generate ETag for caching
    const configHash = `${hotelData.updated_at || hotelData.created_at}-${hotel}-${room}`;
    const etag = `"${btoa(configHash).replace(/[^a-zA-Z0-9]/g, '')}"`;

    // Check if client has cached version
    const clientETag = req.headers.get('if-none-match');
    if (clientETag === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          ...corsHeaders,
          'ETag': etag,
          'Cache-Control': 'max-age=60'
        }
      });
    }

    const config = {
      hotel: {
        nombre: hotelData.nombre,
        codigo: hotelData.codigo_hotel,
        branding: hotelData.branding,
        theme: hotelData.theme,
        timezone: hotelData.timezone
      },
      room: hotelData.rooms[0],
      menu: menuItems || [],
      assets: assets || [],
      tenant: hotelData.tenant,
      lastUpdated: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(config),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'ETag': etag,
          'Cache-Control': 'max-age=60'
        } 
      }
    );

  } catch (error) {
    console.error('Config TV error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});