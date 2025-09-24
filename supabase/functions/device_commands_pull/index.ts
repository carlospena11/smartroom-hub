import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CommandPullRequest {
  device_id: string;
  last_seen_at?: string;
  app_version?: string;
}

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

    const { device_id, last_seen_at, app_version }: CommandPullRequest = await req.json();

    if (!device_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: device_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify device exists
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select(`
        *,
        business:businesses(
          tenant_id,
          tenant:tenants(*)
        )
      `)
      .eq('id', device_id)
      .single();

    if (deviceError || !device) {
      return new Response(
        JSON.stringify({ error: 'Device not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date().toISOString();

    // Get pending commands for this device
    const { data: commands, error: commandsError } = await supabase
      .from('device_commands')
      .select('*')
      .eq('device_id', device_id)
      .in('status', ['queued', 'sent'])
      .or(`not_before.is.null,not_before.lte.${now}`)
      .gt('expires_at', now)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(20);

    if (commandsError) {
      console.error('Commands fetch error:', commandsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch commands' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark queued commands as sent
    const queuedCommands = commands?.filter(cmd => cmd.status === 'queued') || [];
    if (queuedCommands.length > 0) {
      const queuedIds = queuedCommands.map(cmd => cmd.id);
      await supabase
        .from('device_commands')
        .update({ status: 'sent' })
        .in('id', queuedIds);
    }

    // Update device status if provided
    if (last_seen_at || app_version) {
      await supabase
        .from('device_status')
        .upsert({
          device_id,
          app_version: app_version || null,
          last_seen_at: last_seen_at || now
        }, {
          onConflict: 'device_id'
        });
    }

    // Clean up expired commands
    await supabase
      .from('device_commands')
      .update({ status: 'expired' })
      .eq('device_id', device_id)
      .in('status', ['queued', 'sent'])
      .lt('expires_at', now);

    const response = {
      success: true,
      device_id,
      commands: commands || [],
      timestamp: now,
      next_poll_seconds: 30 // Suggest next poll interval
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Device commands pull error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});