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

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get JWT token from request
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

    if (!profile || !['superuser', 'tenant_admin'].includes(profile.platform_role || profile.tenant_role)) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const appType = formData.get('app_type') as string;
    const hotelSlug = formData.get('hotel_slug') as string;
    const version = formData.get('version') as string;
    const notes = formData.get('notes') as string;
    const isLatest = formData.get('is_latest') === 'true';

    if (!file || !appType || !version) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: file, app_type, version' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Read file and calculate checksum
    const fileBytes = await file.arrayBuffer();
    const fileData = new Uint8Array(fileBytes);
    
    // Calculate SHA256 checksum
    const hashBuffer = await crypto.subtle.digest('SHA-256', fileBytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const checksum = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Create storage path
    const storagePath = `projects/${appType}/${hotelSlug || 'global'}/${version}/${file.name}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('projects')
      .upload(storagePath, fileData, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If this is marked as latest, unmark other releases
    if (isLatest) {
      await supabase
        .from('app_releases')
        .update({ is_latest: false })
        .eq('app_type', appType)
        .eq('hotel_slug', hotelSlug || null);
    }

    // Insert release record
    const { data: release, error: insertError } = await supabase
      .from('app_releases')
      .insert({
        app_type: appType,
        hotel_slug: hotelSlug || null,
        version,
        storage_path: storagePath,
        checksum_sha256: checksum,
        size_bytes: fileBytes.byteLength,
        published_at: new Date().toISOString(),
        notes,
        is_latest: isLatest
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      // Clean up uploaded file
      await supabase.storage.from('projects').remove([storagePath]);
      
      return new Response(
        JSON.stringify({ error: 'Failed to create release record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log audit event
    await supabase
      .from('audit_logs')
      .insert({
        tenant_id: profile.tenant_id,
        actor_id: user.id,
        accion: 'app_release_upload',
        entidad: 'app_releases',
        entidad_id: release.id,
        diff: {
          app_type: appType,
          hotel_slug: hotelSlug,
          version,
          size_bytes: fileBytes.byteLength,
          is_latest: isLatest
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        release: {
          id: release.id,
          version: release.version,
          checksum_sha256: release.checksum_sha256,
          size_bytes: release.size_bytes,
          published_at: release.published_at,
          is_latest: release.is_latest
        }
      }),
      { 
        status: 201, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('App upload error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});