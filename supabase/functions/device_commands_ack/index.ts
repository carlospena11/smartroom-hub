import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CommandAckRequest {
  command_id: string;
  device_id: string;
  status: 'received' | 'ack' | 'error';
  details?: any;
  error_message?: string;
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

    const { command_id, device_id, status, details, error_message }: CommandAckRequest = await req.json();

    if (!command_id || !device_id || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: command_id, device_id, status' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['received', 'ack', 'error'].includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status. Must be: received, ack, or error' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify command exists and belongs to the device
    const { data: command, error: commandError } = await supabase
      .from('device_commands')
      .select('*')
      .eq('id', command_id)
      .eq('device_id', device_id)
      .single();

    if (commandError || !command) {
      return new Response(
        JSON.stringify({ error: 'Command not found or does not belong to device' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update command status based on acknowledgment
    let commandStatus = command.status;
    if (status === 'ack') {
      commandStatus = 'ack';
    } else if (status === 'error') {
      commandStatus = 'failed';
    }
    // For 'received', we keep the current status (likely 'sent')

    const { error: updateError } = await supabase
      .from('device_commands')
      .update({ status: commandStatus })
      .eq('id', command_id);

    if (updateError) {
      console.error('Command update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update command status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert receipt record
    const receiptDetails = details || {};
    if (error_message && status === 'error') {
      receiptDetails.error_message = error_message;
    }

    const { error: receiptError } = await supabase
      .from('device_command_receipts')
      .insert({
        command_id,
        device_id,
        status,
        details: receiptDetails,
        received_at: new Date().toISOString()
      });

    if (receiptError) {
      console.error('Receipt insert error:', receiptError);
      // Don't fail the request for receipt errors, just log
    }

    // Log analytics event
    await supabase
      .from('analytics_events')
      .insert({
        tenant_id: command.tenant_id,
        device_id,
        source: 'tv',
        event_type: 'command_acknowledgment',
        payload: {
          command_id,
          command_type: command.command,
          ack_status: status,
          has_error: status === 'error',
          execution_time_ms: details?.execution_time_ms
        },
        occurred_at: new Date().toISOString()
      });

    const response = {
      success: true,
      command_id,
      device_id,
      acknowledged_status: status,
      command_status: commandStatus,
      timestamp: new Date().toISOString()
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
    console.error('Device commands ack error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
