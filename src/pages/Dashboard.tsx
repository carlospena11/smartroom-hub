import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Bed, 
  Monitor, 
  Users,
  Calendar,
  HardDrive,
  TrendingUp,
  Wifi,
  WifiOff,
  Play,
  Pause
} from "lucide-react";

// Mock data - En producción vendría de tu base de datos hwocuptv_smartroom
const dashboardData = {
  stats: {
    hotels: { total: 12, trend: { value: 8.2, isPositive: true } },
    rooms: { total: 248, trend: { value: 12.5, isPositive: true } },
    devices: { total: 67, active: 62, inactive: 5 },
    users: { total: 24, trend: { value: -2.1, isPositive: false } },
    campaigns: { active: 8, scheduled: 15 },
    storage: { used: 2.4, total: 10, unit: "GB" }
  },
  deviceStatus: [
    { name: "Android TV - Lobby Principal", status: "online", location: "Hotel Plaza" },
    { name: "Tótem Información", status: "online", location: "Hotel Boutique" },
    { name: "Pantalla Publicidad", status: "offline", location: "Centro Comercial" },
    { name: "Pantalla Eventos", status: "maintenance", location: "Hotel Plaza" },
  ]
};

export const Dashboard = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-tertiary" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-destructive" />;
      case "maintenance":
        return <Pause className="h-4 w-4 text-warning" />;
      default:
        return <Monitor className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-tertiary/20 text-tertiary">En línea</Badge>;
      case "offline":
        return <Badge variant="destructive">Sin conexión</Badge>;
      case "maintenance":
        return <Badge className="bg-warning/20 text-warning-foreground">Mantenimiento</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-xl p-8 text-primary-foreground shadow-glow">
        <h1 className="text-3xl font-bold mb-2">Panel de Control SmartRoom</h1>
        <p className="text-lg opacity-90">
          Gestiona hoteles, dispositivos y contenido desde un solo lugar
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
            <Building2 className="h-4 w-4 mr-2" />
            Crear Hotel
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Monitor className="h-4 w-4 mr-2" />
            Agregar Dispositivo
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Total Habitaciones"
          value={dashboardData.stats.rooms.total}
          icon={Bed}
          description="Habitaciones configuradas"
          trend={dashboardData.stats.rooms.trend}
          variant="primary"
        />
        
        <StatsCard
          title="Plataformas Digitales"
          value="Android TV: 45, webOS: 22, Roku: 12"
          icon={Monitor}
          description="Por tipo de plataforma"
          variant="secondary"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Campañas Activas"
          value={dashboardData.stats.campaigns.active}
          icon={Calendar}
          description={`${dashboardData.stats.campaigns.scheduled} programadas`}
        />
        
        <StatsCard
          title="Almacenamiento"
          value={`${dashboardData.stats.storage.used}${dashboardData.stats.storage.unit}`}
          icon={HardDrive}
          description={`de ${dashboardData.stats.storage.total}${dashboardData.stats.storage.unit} total`}
        />
        
        <StatsCard
          title="Rendimiento"
          value="98.5%"
          icon={TrendingUp}
          description="Uptime promedio"
          trend={{ value: 0.3, isPositive: true }}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Status */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Estado de Dispositivos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.deviceStatus.map((device, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                <div className="flex items-center gap-3">
                  {getStatusIcon(device.status)}
                  <div>
                    <p className="font-medium text-foreground">{device.name}</p>
                    <p className="text-sm text-muted-foreground">{device.location}</p>
                  </div>
                </div>
                {getStatusBadge(device.status)}
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              Ver Todos los Dispositivos
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
};