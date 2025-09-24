import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Globe, Shield, Bell, Palette, Database, Users, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  
  const [generalSettings, setGeneralSettings] = useState({
    tenant_name: "SmartRoom Hotels",
    logo_url: "/logo.png",
    default_timezone: "America/Mexico_City",
    default_language: "es",
    currency: "MXN",
    date_format: "DD/MM/YYYY",
    time_format: "24h"
  });

  const [securitySettings, setSecuritySettings] = useState({
    mfa_required: true,
    session_timeout: 60,
    password_min_length: 8,
    password_require_special: true,
    login_attempts_limit: 5,
    auto_logout_inactive: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    webhook_notifications: false,
    audit_alerts: true,
    system_maintenance: true,
    device_offline_alerts: true,
    campaign_status_alerts: false
  });

  const [systemSettings, setSystemSettings] = useState({
    backup_enabled: true,
    backup_frequency: "daily",
    log_retention_days: 90,
    analytics_retention_days: 365,
    auto_cleanup_enabled: true,
    debug_mode: false
  });

  const handleSave = (section: string) => {
    toast({
      title: "Configuración guardada",
      description: `Los ajustes de ${section} han sido guardados exitosamente.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ajustes del Sistema</h1>
            <p className="text-muted-foreground">Configura los parámetros globales del sistema</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Seguridad
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Apariencia
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Configuración General
                </CardTitle>
                <CardDescription>
                  Ajustes básicos y configuración regional del sistema
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="logo_url">URL del Logo</Label>
                  <Input
                    id="logo_url"
                    value={generalSettings.logo_url}
                    onChange={(e) => setGeneralSettings({...generalSettings, logo_url: e.target.value})}
                    placeholder="/logo.png"
                  />
                </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default_timezone">Zona Horaria por Defecto</Label>
                    <Select 
                      value={generalSettings.default_timezone} 
                      onValueChange={(value) => setGeneralSettings({...generalSettings, default_timezone: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                        <SelectItem value="America/Cancun">Cancún (GMT-5)</SelectItem>
                        <SelectItem value="America/Tijuana">Tijuana (GMT-8)</SelectItem>
                        <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default_language">Idioma por Defecto</Label>
                    <Select 
                      value={generalSettings.default_language} 
                      onValueChange={(value) => setGeneralSettings({...generalSettings, default_language: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Moneda</Label>
                    <Select 
                      value={generalSettings.currency} 
                      onValueChange={(value) => setGeneralSettings({...generalSettings, currency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                        <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date_format">Formato de Fecha</Label>
                    <Select 
                      value={generalSettings.date_format} 
                      onValueChange={(value) => setGeneralSettings({...generalSettings, date_format: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time_format">Formato de Hora</Label>
                    <Select 
                      value={generalSettings.time_format} 
                      onValueChange={(value) => setGeneralSettings({...generalSettings, time_format: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 Horas</SelectItem>
                        <SelectItem value="12h">12 Horas (AM/PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("configuración general")} className="bg-gradient-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Configuración de Seguridad
                </CardTitle>
                <CardDescription>
                  Políticas de seguridad y autenticación del sistema
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticación de Dos Factores Obligatoria</Label>
                      <p className="text-sm text-muted-foreground">
                        Requerir MFA para todos los usuarios del sistema
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.mfa_required}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, mfa_required: checked})}
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="session_timeout">Tiempo de Sesión (minutos)</Label>
                      <Input
                        id="session_timeout"
                        type="number"
                        value={securitySettings.session_timeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, session_timeout: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password_min_length">Longitud Mínima de Contraseña</Label>
                      <Input
                        id="password_min_length"
                        type="number"
                        value={securitySettings.password_min_length}
                        onChange={(e) => setSecuritySettings({...securitySettings, password_min_length: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Requerir Caracteres Especiales en Contraseñas</Label>
                      <p className="text-sm text-muted-foreground">
                        Las contraseñas deben incluir símbolos especiales
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.password_require_special}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, password_require_special: checked})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login_attempts">Límite de Intentos de Login</Label>
                    <Input
                      id="login_attempts"
                      type="number"
                      value={securitySettings.login_attempts_limit}
                      onChange={(e) => setSecuritySettings({...securitySettings, login_attempts_limit: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-logout por Inactividad</Label>
                      <p className="text-sm text-muted-foreground">
                        Cerrar sesión automáticamente después del tiempo límite
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.auto_logout_inactive}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, auto_logout_inactive: checked})}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("seguridad")} className="bg-gradient-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Configuración de Notificaciones
                </CardTitle>
                <CardDescription>
                  Administra cómo y cuándo recibir notificaciones del sistema
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificaciones por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibir notificaciones importantes por correo electrónico
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_notifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, email_notifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Webhooks</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar eventos a endpoints externos configurados
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.webhook_notifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, webhook_notifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas de Auditoría</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar sobre actividades sospechosas o críticas
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.audit_alerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, audit_alerts: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mantenimiento del Sistema</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificaciones sobre actualizaciones y mantenimiento
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.system_maintenance}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, system_maintenance: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dispositivos Desconectados</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertas cuando los dispositivos se desconectan
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.device_offline_alerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, device_offline_alerts: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Estado de Campañas</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificaciones sobre inicio, fin y errores en campañas
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.campaign_status_alerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, campaign_status_alerts: checked})}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("notificaciones")} className="bg-gradient-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Configuración de Apariencia
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia y el tema del sistema
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center py-12">
                  <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Configuración de Apariencia</p>
                  <p className="text-sm text-muted-foreground">
                    Las opciones de personalización de tema estarán disponibles próximamente
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Configuración del Sistema
                </CardTitle>
                <CardDescription>
                  Ajustes avanzados del sistema, backups y mantenimiento
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Backups Automáticos</Label>
                      <p className="text-sm text-muted-foreground">
                        Realizar copias de seguridad automáticas de la base de datos
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.backup_enabled}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, backup_enabled: checked})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backup_frequency">Frecuencia de Backup</Label>
                    <Select 
                      value={systemSettings.backup_frequency} 
                      onValueChange={(value) => setSystemSettings({...systemSettings, backup_frequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Cada Hora</SelectItem>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="log_retention">Retención de Logs (días)</Label>
                      <Input
                        id="log_retention"
                        type="number"
                        value={systemSettings.log_retention_days}
                        onChange={(e) => setSystemSettings({...systemSettings, log_retention_days: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="analytics_retention">Retención de Analytics (días)</Label>
                      <Input
                        id="analytics_retention"
                        type="number"
                        value={systemSettings.analytics_retention_days}
                        onChange={(e) => setSystemSettings({...systemSettings, analytics_retention_days: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Limpieza Automática</Label>
                      <p className="text-sm text-muted-foreground">
                        Eliminar automáticamente datos antiguos según los períodos de retención
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.auto_cleanup_enabled}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, auto_cleanup_enabled: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Modo Debug</Label>
                      <p className="text-sm text-muted-foreground">
                        Activar logs detallados para debugging (afecta el rendimiento)
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.debug_mode}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, debug_mode: checked})}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("sistema")} className="bg-gradient-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;