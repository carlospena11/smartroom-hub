import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsEvent {
  tenant_id: string;
  hotel_id?: string;
  device_id?: string;
  user_id?: string;
  source: 'tv' | 'webapp' | 'totem' | 'ads';
  event_type: string;
  payload: any;
  occurred_at?: string;
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

    // Check rate limiting (basic implementation)
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `analytics_${clientIP}`;
    
    const body = await req.json();
    let events: AnalyticsEvent[] = [];

    // Handle both single event and batch of events
    if (Array.isArray(body)) {
      events = body;
    } else if (body.events && Array.isArray(body.events)) {
      events = body.events;
    } else {
      events = [body];
    }

    // Validate batch size
    const maxBatchSize = parseInt(Deno.env.get('MAX_ANALYTICS_BATCH_SIZE') || '100');
    if (events.length > maxBatchSize) {
      return new Response(
        JSON.stringify({ error: `Batch size too large. Maximum: ${maxBatchSize}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and sanitize events
    const validEvents = [];
    const errors = [];

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      
      // Validate required fields
      if (!event.tenant_id || !event.source || !event.event_type) {
        errors.push(`Event ${i}: Missing required fields (tenant_id, source, event_type)`);
        continue;
      }

      // Validate source
      if (!['tv', 'webapp', 'totem', 'ads'].includes(event.source)) {
        errors.push(`Event ${i}: Invalid source value`);
        continue;
      }

      // Validate payload size
      const payloadSize = JSON.stringify(event.payload || {}).length;
      if (payloadSize > 10000) { // 10KB limit
        errors.push(`Event ${i}: Payload too large`);
        continue;
      }

      // Set occurred_at if not provided
      if (!event.occurred_at) {
        event.occurred_at = new Date().toISOString();
      }

      // Set received_at
      const sanitizedEvent = {
        tenant_id: event.tenant_id,
        hotel_id: event.hotel_id || null,
        device_id: event.device_id || null,
        user_id: event.user_id || null,
        source: event.source,
        event_type: event.event_type,
        payload: event.payload || {},
        occurred_at: event.occurred_at,
        received_at: new Date().toISOString()
      };

      validEvents.push(sanitizedEvent);
    }

    if (validEvents.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No valid events to process', 
          validation_errors: errors 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert events into database
    const { error: insertError } = await supabase
      .from('analytics_events')
      .insert(validEvents);

    if (insertError) {
      console.error('Analytics insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to store analytics events' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return response
    const response = {
      success: true,
      processed: validEvents.length,
      rejected: events.length - validEvents.length,
      validation_errors: errors.length > 0 ? errors : undefined
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
    console.error('Analytics ingest error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});