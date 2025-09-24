-- Add missing core RLS policies
-- tenants
CREATE POLICY "superuser_all_tenants" ON public.tenants
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_admin_own_tenant" ON public.tenants
  FOR SELECT USING (
    public.get_user_role() = 'tenant_admin' AND 
    id = public.get_user_tenant_id()
  );

-- profiles  
CREATE POLICY "superuser_all_profiles" ON public.profiles
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "users_own_profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "tenant_admin_tenant_profiles" ON public.profiles
  FOR ALL USING (
    public.get_user_role() = 'tenant_admin' AND 
    tenant_id = public.get_user_tenant_id()
  );

-- hotels
CREATE POLICY "superuser_all_hotels" ON public.hotels
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_hotels" ON public.hotels
  FOR SELECT USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );
CREATE POLICY "tenant_admin_hotels_write" ON public.hotels
  FOR INSERT WITH CHECK (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() = 'tenant_admin'
  );
CREATE POLICY "tenant_admin_hotels_update" ON public.hotels
  FOR UPDATE USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() = 'tenant_admin'
  );
CREATE POLICY "hotel_admin_assigned_hotels" ON public.hotels
  FOR SELECT USING (
    public.get_user_role() = 'hotel_admin' AND
    public.user_has_hotel_access(id)
  );

-- rooms
CREATE POLICY "superuser_all_rooms" ON public.rooms
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_rooms" ON public.rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.hotels h 
      WHERE h.id = hotel_id AND h.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );
CREATE POLICY "tenant_admin_rooms_write" ON public.rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.hotels h 
      WHERE h.id = hotel_id AND h.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() = 'tenant_admin'
  );
CREATE POLICY "hotel_admin_assigned_rooms" ON public.rooms
  FOR ALL USING (
    public.get_user_role() = 'hotel_admin' AND
    public.user_has_hotel_access(hotel_id)
  );

-- businesses
CREATE POLICY "superuser_all_businesses" ON public.businesses
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_businesses" ON public.businesses
  FOR SELECT USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );
CREATE POLICY "tenant_admin_businesses_write" ON public.businesses
  FOR ALL USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() = 'tenant_admin'
  );

-- devices
CREATE POLICY "superuser_all_devices" ON public.devices
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_devices" ON public.devices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_id AND b.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );
CREATE POLICY "tenant_admin_devices_write" ON public.devices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_id AND b.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() = 'tenant_admin'
  );

-- media_assets
CREATE POLICY "superuser_all_media" ON public.media_assets
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_media" ON public.media_assets
  FOR SELECT USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );
CREATE POLICY "tenant_content_managers_media_write" ON public.media_assets
  FOR ALL USING (
    tenant_id = public.get_user_tenant_id() AND
    public.get_user_role() IN ('tenant_admin', 'editor')
  );

-- menu_items
CREATE POLICY "superuser_all_menu" ON public.menu_items
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_menu" ON public.menu_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.hotels h 
      WHERE h.id = hotel_id AND h.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );
CREATE POLICY "tenant_content_managers_menu_write" ON public.menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.hotels h 
      WHERE h.id = hotel_id AND h.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'editor')
  );

-- ad_playlists
CREATE POLICY "superuser_all_playlists" ON public.ad_playlists
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_playlists" ON public.ad_playlists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_id AND b.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );
CREATE POLICY "tenant_content_managers_playlists_write" ON public.ad_playlists
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b 
      WHERE b.id = business_id AND b.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'editor')
  );

-- ad_playlist_items
CREATE POLICY "superuser_all_playlist_items" ON public.ad_playlist_items
  FOR ALL USING (public.get_user_platform_role() = 'superuser');
CREATE POLICY "tenant_users_playlist_items" ON public.ad_playlist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ad_playlists p
      JOIN public.businesses b ON b.id = p.business_id
      WHERE p.id = playlist_id AND b.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'hotel_admin', 'editor', 'viewer', 'ops')
  );
CREATE POLICY "tenant_content_managers_playlist_items_write" ON public.ad_playlist_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ad_playlists p
      JOIN public.businesses b ON b.id = p.business_id
      WHERE p.id = playlist_id AND b.tenant_id = public.get_user_tenant_id()
    ) AND public.get_user_role() IN ('tenant_admin', 'editor')
  );