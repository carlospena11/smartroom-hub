import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HeartbeatRequest {
  device_id: string;
  app_version?: string;
  network?: any;
  power_state?: string;
  notes?: string;
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

    const { device_id, app_version, network, power_state, notes }: HeartbeatRequest = await req.json();

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

    // Update or insert device status
    const { error: statusError } = await supabase
      .from('device_status')
      .upsert({
        device_id,
        app_version,
        network,
        last_seen_at: new Date().toISOString(),
        power_state,
        notes
      }, {
        onConflict: 'device_id'
      });

    if (statusError) {
      console.error('Device status update error:', statusError);
      return new Response(
        JSON.stringify({ error: 'Failed to update device status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for pending commands
    const { data: pendingCommands, error: commandsError } = await supabase
      .from('device_commands')
      .select('*')
      .eq('device_id', device_id)
      .eq('status', 'queued')
      .or(`not_before.is.null,not_before.lte.${new Date().toISOString()}`)
      .gt('expires_at', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(10);

    if (commandsError) {
      console.error('Commands fetch error:', commandsError);
    }

    // Mark commands as sent
    if (pendingCommands && pendingCommands.length > 0) {
      const commandIds = pendingCommands.map(cmd => cmd.id);
      await supabase
        .from('device_commands')
        .update({ status: 'sent' })
        .in('id', commandIds);
    }

    // Prepare response flags
    const flags: any = {};
    
    // Check heartbeat interval
    const heartbeatInterval = parseInt(Deno.env.get('HEARTBEAT_INTERVAL') || '300'); // 5 minutes default
    flags.next_heartbeat_seconds = heartbeatInterval;

    // Check if config refresh is needed (example logic)
    const lastConfigUpdate = device.updated_at;
    const configAge = Date.now() - new Date(lastConfigUpdate).getTime();
    if (configAge > 3600000) { // 1 hour
      flags.config_refresh_needed = true;
    }

    const response = {
      success: true,
      device_id,
      timestamp: new Date().toISOString(),
      pending_commands: pendingCommands || [],
      flags
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
    console.error('Device heartbeat error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});