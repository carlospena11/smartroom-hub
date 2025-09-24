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
    const releaseId = url.searchParams.get('release_id');

    if (!releaseId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: release_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get JWT token from request for permission check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify user and get profile
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has permission to access releases
    const hasPermission = profile.platform_role === 'superuser' || 
                         ['tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops'].includes(profile.tenant_role);

    if (!hasPermission) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get release details
    const { data: release, error: releaseError } = await supabase
      .from('app_releases')
      .select('*')
      .eq('id', releaseId)
      .single();

    if (releaseError || !release) {
      return new Response(
        JSON.stringify({ error: 'Release not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate signed URL with TTL
    const ttlSeconds = parseInt(Deno.env.get('SIGNED_URL_TTL') || '3600'); // 1 hour default
    
    const { data: signedUrl, error: signedUrlError } = await supabase.storage
      .from('projects')
      .createSignedUrl(release.storage_path, ttlSeconds);

    if (signedUrlError || !signedUrl) {
      console.error('Signed URL error:', signedUrlError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate download URL' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log audit event
    await supabase
      .from('audit_logs')
      .insert({
        tenant_id: profile.tenant_id,
        actor_id: user.id,
        accion: 'app_release_download',
        entidad: 'app_releases',
        entidad_id: release.id,
        diff: {
          app_type: release.app_type,
          hotel_slug: release.hotel_slug,
          version: release.version
        },
        metadata: {
          ip: req.headers.get('x-forwarded-for') || 'unknown'
        }
      });

    const response = {
      download_url: signedUrl.signedUrl,
      expires_at: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
      release: {
        id: release.id,
        app_type: release.app_type,
        hotel_slug: release.hotel_slug,
        version: release.version,
        checksum_sha256: release.checksum_sha256,
        size_bytes: release.size_bytes,
        published_at: release.published_at,
        notes: release.notes
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
    console.error('App download error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});