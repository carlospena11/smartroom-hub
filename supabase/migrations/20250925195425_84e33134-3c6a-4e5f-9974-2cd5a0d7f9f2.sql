-- Crear tabla para plantillas de proyectos
CREATE TABLE public.project_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  thumbnail_url TEXT,
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  background_image TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "superuser_all_project_templates" 
ON public.project_templates 
FOR ALL 
USING (get_user_platform_role() = 'superuser'::app_role);

CREATE POLICY "tenant_admin_project_templates_write" 
ON public.project_templates 
FOR ALL 
USING (
  tenant_id = get_user_tenant_id() AND 
  get_user_role() = ANY(ARRAY['tenant_admin'::tenant_role, 'editor'::tenant_role])
);

CREATE POLICY "tenant_users_project_templates" 
ON public.project_templates 
FOR SELECT 
USING (
  (tenant_id = get_user_tenant_id() OR is_public = true) AND 
  get_user_role() = ANY(ARRAY['tenant_admin'::tenant_role, 'hotel_admin'::tenant_role, 'editor'::tenant_role, 'viewer'::tenant_role, 'ops'::tenant_role])
);

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION public.update_project_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para timestamp automático
CREATE TRIGGER update_project_templates_updated_at
BEFORE UPDATE ON public.project_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_project_templates_updated_at();