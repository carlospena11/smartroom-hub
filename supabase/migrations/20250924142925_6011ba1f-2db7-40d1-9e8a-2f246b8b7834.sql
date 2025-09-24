-- Continue with RLS policies for remaining tables

-- Create RLS policies for ad_campaigns table
CREATE POLICY "superuser_all_campaigns" ON public.ad_campaigns
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

CREATE POLICY "tenant_users_campaigns" ON public.ad_campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_id AND b.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

CREATE POLICY "tenant_content_managers_campaigns_write" ON public.ad_campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_id AND b.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'editor')
  );

-- Create RLS policies for event_sources table
CREATE POLICY "superuser_all_event_sources" ON public.event_sources
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

CREATE POLICY "tenant_users_event_sources" ON public.event_sources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_id AND b.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

CREATE POLICY "tenant_content_managers_event_sources_write" ON public.event_sources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_id AND b.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'editor')
  );

-- Create RLS policies for api_keys table
CREATE POLICY "superuser_all_api_keys" ON public.api_keys
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

CREATE POLICY "tenant_admin_api_keys" ON public.api_keys
  FOR ALL USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() = 'tenant_admin'
  );

-- Create RLS policies for webhooks table
CREATE POLICY "superuser_all_webhooks" ON public.webhooks
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

CREATE POLICY "tenant_admin_webhooks" ON public.webhooks
  FOR ALL USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() = 'tenant_admin'
  );

-- Create RLS policies for audit_logs table
CREATE POLICY "superuser_all_audit_logs" ON public.audit_logs
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

CREATE POLICY "tenant_admin_audit_logs" ON public.audit_logs
  FOR SELECT USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() = 'tenant_admin'
  );

-- Create RLS policies for app_releases table
CREATE POLICY "superuser_all_app_releases" ON public.app_releases
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

CREATE POLICY "tenant_users_app_releases" ON public.app_releases
  FOR SELECT USING (
    public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

CREATE POLICY "tenant_admin_app_releases_write" ON public.app_releases
  FOR ALL USING (public.get_user_role() = 'tenant_admin');

CREATE POLICY "hotel_admin_app_releases_write" ON public.app_releases
  FOR INSERT WITH CHECK (public.get_user_role() IN ('hotel_admin', 'editor'));

CREATE POLICY "hotel_admin_app_releases_update" ON public.app_releases
  FOR UPDATE USING (public.get_user_role() IN ('hotel_admin', 'editor'));

-- Create RLS policies for apps table
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

-- Create RLS policies for app_bindings table
CREATE POLICY "superuser_all_app_bindings" ON public.app_bindings
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

CREATE POLICY "tenant_users_app_bindings" ON public.app_bindings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.apps a 
      WHERE a.id = app_id AND a.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

CREATE POLICY "tenant_admin_app_bindings_write" ON public.app_bindings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.apps a 
      WHERE a.id = app_id AND a.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() = 'tenant_admin'
  );

-- Create RLS policies for content_pages table
CREATE POLICY "superuser_all_content_pages" ON public.content_pages
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

CREATE POLICY "tenant_users_content_pages" ON public.content_pages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.apps a 
      WHERE a.id = app_id AND a.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

CREATE POLICY "tenant_content_managers_content_pages_write" ON public.content_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.apps a 
      WHERE a.id = app_id AND a.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'editor')
  );

-- Create RLS policies for content_blocks table
CREATE POLICY "superuser_all_content_blocks" ON public.content_blocks
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

CREATE POLICY "tenant_users_content_blocks" ON public.content_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.content_pages p
      JOIN public.apps a ON a.id = p.app_id
      WHERE p.id = page_id AND a.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

CREATE POLICY "tenant_content_managers_content_blocks_write" ON public.content_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.content_pages p
      JOIN public.apps a ON a.id = p.app_id
      WHERE p.id = page_id AND a.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'editor')
  );

-- Create RLS policies for content_versions table
CREATE POLICY "superuser_all_content_versions" ON public.content_versions
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

CREATE POLICY "tenant_users_content_versions" ON public.content_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.content_pages p
      JOIN public.apps a ON a.id = p.app_id
      WHERE p.id = page_id AND a.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

CREATE POLICY "tenant_content_managers_content_versions_write" ON public.content_versions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.content_pages p
      JOIN public.apps a ON a.id = p.app_id
      WHERE p.id = page_id AND a.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'editor')
  );

-- Create RLS policies for i18n_strings table
CREATE POLICY "superuser_all_i18n_strings" ON public.i18n_strings
  FOR ALL USING (public.get_user_platform_role() = 'superuser');

CREATE POLICY "tenant_users_i18n_strings" ON public.i18n_strings
  FOR SELECT USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );

CREATE POLICY "tenant_content_managers_i18n_strings_write" ON public.i18n_strings
  FOR ALL USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() IN ('tenant_admin', 'editor')
  );

-- Continue with remaining tables in next migration