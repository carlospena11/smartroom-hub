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
    const appType = url.searchParams.get('app_type');
    const hotelSlug = url.searchParams.get('hotel_slug');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    if (!appType) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: app_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Build query
    let query = supabase
      .from('app_releases')
      .select('*')
      .eq('app_type', appType)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by hotel_slug if provided
    if (hotelSlug) {
      query = query.eq('hotel_slug', hotelSlug);
    } else {
      query = query.is('hotel_slug', null);
    }

    const { data: releases, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch releases' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('app_releases')
      .select('*', { count: 'exact', head: true })
      .eq('app_type', appType);

    if (hotelSlug) {
      countQuery = countQuery.eq('hotel_slug', hotelSlug);
    } else {
      countQuery = countQuery.is('hotel_slug', null);
    }

    const { count: totalCount } = await countQuery;

    const response = {
      releases: releases || [],
      pagination: {
        total: totalCount || 0,
        offset,
        limit,
        hasMore: (totalCount || 0) > offset + limit
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=30'
        } 
      }
    );

  } catch (error) {
    console.error('App releases list error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});