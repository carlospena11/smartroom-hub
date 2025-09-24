-- Drop all existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Create RLS policies for all remaining tables
-- ad_campaigns
CREATE POLICY "superuser_all_campaigns" ON public.ad_campaigns
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_campaigns" ON public.ad_campaigns
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.tenant_id = public.get_user_tenant_id())
    AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );
CREATE POLICY "tenant_content_managers_campaigns_write" ON public.ad_campaigns
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.tenant_id = public.get_user_tenant_id())
    AND public.get_user_role() IN ('tenant_admin', 'editor')
  );

-- event_sources
CREATE POLICY "superuser_all_events" ON public.event_sources
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_events" ON public.event_sources
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.tenant_id = public.get_user_tenant_id())
    AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );
CREATE POLICY "tenant_content_managers_events_write" ON public.event_sources
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.tenant_id = public.get_user_tenant_id())
    AND public.get_user_role() IN ('tenant_admin', 'editor')
  );

-- api_keys
CREATE POLICY "superuser_all_api_keys" ON public.api_keys
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_admin_api_keys" ON public.api_keys
  FOR ALL USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() = 'tenant_admin'
  );

-- webhooks
CREATE POLICY "superuser_all_webhooks" ON public.webhooks
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_admin_webhooks" ON public.webhooks
  FOR ALL USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() = 'tenant_admin'
  );

-- audit_logs
CREATE POLICY "superuser_all_audit" ON public.audit_logs
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_admin_audit_read" ON public.audit_logs
  FOR SELECT USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() = 'tenant_admin'
  );

-- app_releases
CREATE POLICY "superuser_all_releases" ON public.app_releases
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_releases" ON public.app_releases
  FOR SELECT USING (public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops'));

-- apps
CREATE POLICY "superuser_all_apps" ON public.apps
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_apps" ON public.apps
  FOR SELECT USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );
CREATE POLICY "tenant_admin_apps_write" ON public.apps
  FOR ALL USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() = 'tenant_admin'
  );

-- app_bindings
CREATE POLICY "superuser_all_bindings" ON public.app_bindings
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_bindings" ON public.app_bindings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.apps a WHERE a.id = app_id AND a.tenant_id = public.get_user_tenant_id())
    AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

-- content_pages
CREATE POLICY "superuser_all_content_pages" ON public.content_pages
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_content_pages" ON public.content_pages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.apps a WHERE a.id = app_id AND a.tenant_id = public.get_user_tenant_id())
    AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );
CREATE POLICY "tenant_content_managers_pages_write" ON public.content_pages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.apps a WHERE a.id = app_id AND a.tenant_id = public.get_user_tenant_id())
    AND public.get_user_role() IN ('tenant_admin', 'editor')
  );

-- content_blocks
CREATE POLICY "superuser_all_content_blocks" ON public.content_blocks
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_content_blocks" ON public.content_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.content_pages cp 
      JOIN public.apps a ON a.id = cp.app_id 
      WHERE cp.id = page_id AND a.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

-- content_versions
CREATE POLICY "superuser_all_content_versions" ON public.content_versions
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_content_versions" ON public.content_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.content_pages cp 
      JOIN public.apps a ON a.id = cp.app_id 
      WHERE cp.id = page_id AND a.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

-- i18n_strings
CREATE POLICY "superuser_all_i18n" ON public.i18n_strings
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_i18n" ON public.i18n_strings
  FOR SELECT USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

-- Remaining policies (device_enrollments, device_status, users_hotels, etc.)
CREATE POLICY "superuser_all_enrollments" ON public.device_enrollments
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_enrollments" ON public.device_enrollments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.devices d JOIN public.businesses b ON b.id = d.business_id WHERE d.id = device_id AND b.tenant_id = public.get_user_tenant_id())
    AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

CREATE POLICY "superuser_all_device_status" ON public.device_status
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_device_status" ON public.device_status
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.devices d JOIN public.businesses b ON b.id = d.business_id WHERE d.id = device_id AND b.tenant_id = public.get_user_tenant_id())
    AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

CREATE POLICY "users_own_hotel_assignments" ON public.users_hotels
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "superuser_all_impersonation" ON public.impersonation_sessions
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

-- Analytics tables
CREATE POLICY "superuser_all_analytics_events" ON public.analytics_events
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_analytics_events" ON public.analytics_events
  FOR SELECT USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

CREATE POLICY "superuser_all_analytics_aggregates" ON public.analytics_aggregates_daily
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_analytics_aggregates" ON public.analytics_aggregates_daily
  FOR SELECT USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

-- Device commands
CREATE POLICY "superuser_all_commands" ON public.device_commands
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_commands" ON public.device_commands
  FOR SELECT USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

CREATE POLICY "superuser_all_command_receipts" ON public.device_command_receipts
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

-- Platform providers
CREATE POLICY "superuser_all_providers" ON public.platform_providers
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_providers" ON public.platform_providers
  FOR SELECT USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

CREATE POLICY "superuser_all_installs" ON public.device_platform_installs
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

CREATE POLICY "superuser_all_credentials" ON public.platform_credentials
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

CREATE POLICY "superuser_all_credential_logs" ON public.credential_access_logs
  FOR ALL USING (public.get_user_platform_role() = 'superuser');