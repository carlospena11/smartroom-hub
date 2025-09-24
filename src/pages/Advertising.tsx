import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Radio, MapPin, Settings, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdvertisingDisplay {
  id: string;
  nombre: string;
  ubicacion: string;
  codigo: string;
  tipo: "ads";
  layout: {
    template: string;
    configuracion: Record<string, any>;
  };
  widgets: {
    activos: string[];
  };
  timezone: string;
  status: "online" | "offline" | "maintenance";
  current_playlist?: string;
  last_seen?: string;
}

const Advertising = () => {
  const { toast } = useToast();
  const [displays, setDisplays] = useState<AdvertisingDisplay[]>([
    {
      id: "1",
      nombre: "Pantalla Lobby Comercial",
      ubicacion: "Lobby - Entrada Principal",
      codigo: "AD-LOBBY-001",
      tipo: "ads",
      layout: {
        template: "commercial_display",
        configuracion: { rotation_speed: 15, sound_enabled: false }
      },
      widgets: {
        activos: ["ads_player", "weather_widget", "clock"]
      },
      timezone: "America/Mexico_City",
      status: "online",
      current_playlist: "Promociones Verano 2024",
      last_seen: "2024-03-20 14:30"
    },
    {
      id: "2",
      nombre: "Pantalla Elevadores",
      ubicacion: "Área de Elevadores",
      codigo: "AD-ELEV-001",
      tipo: "ads",
      layout: {
        template: "vertical_display",
        configuracion: { rotation_speed: 10, sound_enabled: false }
      },
      widgets: {
        activos: ["ads_player", "news_ticker"]
      },
      timezone: "America/Mexico_City",
      status: "online",
      current_playlist: "Anuncios Generales",
      last_seen: "2024-03-20 14:28"
    },
    {
      id: "3",
      nombre: "Pantalla Restaurante Bar",
      ubicacion: "Bar del Restaurante",
      codigo: "AD-BAR-001",
      tipo: "ads",
      layout: {
        template: "entertainment_display",
        configuracion: { rotation_speed: 20, sound_enabled: true }
      },
      widgets: {
        activos: ["ads_player", "menu_highlights", "events"]
      },
      timezone: "America/Mexico_City",
      status: "maintenance",
      current_playlist: "Promociones Bar",
      last_seen: "2024-03-19 18:45"
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    codigo: "",
    template: "commercial_display",
    timezone: "America/Mexico_City",
    rotation_speed: 15,
    sound_enabled: false
  });

  const getStatusBadge = (status: AdvertisingDisplay["status"]) => {
    const statusConfig = {
      online: { label: "En Línea", variant: "default" as const, color: "text-tertiary" },
      offline: { label: "Desconectado", variant: "destructive" as const, color: "text-destructive" },
      maintenance: { label: "Mantenimiento", variant: "secondary" as const, color: "text-warning" }
    };
    
    return statusConfig[status];
  };

  const handleCreateDisplay = () => {
    const newDisplay: AdvertisingDisplay = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      ubicacion: formData.ubicacion,
      codigo: formData.codigo,
      tipo: "ads",
      layout: {
        template: formData.template,
        configuracion: { 
          rotation_speed: formData.rotation_speed,
          sound_enabled: formData.sound_enabled
        }
      },
      widgets: {
        activos: ["ads_player", "clock"]
      },
      timezone: formData.timezone,
      status: "offline"
    };

    setDisplays([...displays, newDisplay]);
    setIsCreateDialogOpen(false);
    setFormData({
      nombre: "",
      ubicacion: "",
      codigo: "",
      template: "commercial_display",
      timezone: "America/Mexico_City",
      rotation_speed: 15,
      sound_enabled: false
    });
    
    toast({
      title: "Pantalla publicitaria creada",
      description: "La pantalla publicitaria ha sido creada exitosamente.",
    });
  };

  const handleDeleteDisplay = (id: string) => {
    setDisplays(displays.filter(d => d.id !== id));
    toast({
      title: "Pantalla eliminada",
      description: "La pantalla publicitaria ha sido eliminada exitosamente.",
    });
  };

  const handleToggleStatus = (id: string) => {
    setDisplays(displays.map(display => {
      if (display.id === id) {
        const newStatus = display.status === "online" ? "offline" : "online";
        return { 
          ...display, 
          status: newStatus,
          last_seen: newStatus === "online" ? new Date().toISOString().slice(0, 16).replace('T', ' ') : display.last_seen
        };
      }
      return display;
    }));

    toast({
      title: "Estado actualizado",
      description: "El estado de la pantalla publicitaria ha sido actualizado.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pantallas Publicitarias</h1>
            <p className="text-muted-foreground">Gestiona las pantallas de publicidad digital del hotel</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Pantalla
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nueva Pantalla Publicitaria</DialogTitle>
                <DialogDescription>
                  Configura una nueva pantalla para mostrar publicidad digital
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre de la Pantalla</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Pantalla Lobby Comercial"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Input
                    id="ubicacion"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    placeholder="Lobby - Entrada Principal"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código del Dispositivo</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    placeholder="AD-LOBBY-001"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="template">Tipo de Pantalla</Label>
                  <Select value={formData.template} onValueChange={(value) => setFormData({...formData, template: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial_display">Pantalla Comercial</SelectItem>
                      <SelectItem value="vertical_display">Pantalla Vertical</SelectItem>
                      <SelectItem value="entertainment_display">Pantalla Entretenimiento</SelectItem>
                      <SelectItem value="outdoor_display">Pantalla Exterior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rotation">Rotación (segundos)</Label>
                    <Input
                      id="rotation"
                      type="number"
                      min="5"
                      max="60"
                      value={formData.rotation_speed}
                      onChange={(e) => setFormData({...formData, rotation_speed: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select value={formData.timezone} onValueChange={(value) => setFormData({...formData, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Mexico_City">Ciudad de México</SelectItem>
                        <SelectItem value="America/Cancun">Cancún</SelectItem>
                        <SelectItem value="America/Tijuana">Tijuana</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sound"
                    checked={formData.sound_enabled}
                    onChange={(e) => setFormData({...formData, sound_enabled: e.target.checked})}
                    className="rounded border border-input"
                  />
                  <Label htmlFor="sound">Habilitar Sonido</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateDisplay} className="bg-gradient-primary">
                  Crear Pantalla
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pantallas</CardTitle>
              <Radio className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{displays.length}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activas</CardTitle>
              <Play className="h-4 w-4 text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">
                {displays.filter(d => d.status === "online").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Desconectadas</CardTitle>
              <Pause className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {displays.filter(d => d.status === "offline").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mantenimiento</CardTitle>
              <Settings className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {displays.filter(d => d.status === "maintenance").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              Pantallas Publicitarias
            </CardTitle>
            <CardDescription>
              Gestiona todas las pantallas de publicidad digital
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Playlist Actual</TableHead>
                  <TableHead>Configuración</TableHead>
                  <TableHead>Última Conexión</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displays.map((display) => {
                  const statusConfig = getStatusBadge(display.status);
                  
                  return (
                    <TableRow key={display.id}>
                      <TableCell className="font-medium">{display.nombre}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {display.ubicacion}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {display.codigo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {display.layout.template.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant} className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {display.current_playlist ? (
                          <Badge variant="outline">
                            {display.current_playlist}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin playlist</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{display.layout.configuracion.rotation_speed}s rotación</div>
                          <div className="text-muted-foreground">
                            {display.layout.configuracion.sound_enabled ? "Con sonido" : "Sin sonido"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {display.last_seen || "Nunca"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleStatus(display.id)}
                          >
                            {display.status === "online" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteDisplay(display.id)}
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Advertising;