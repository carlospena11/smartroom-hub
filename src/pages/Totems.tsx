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
import { Plus, Edit, Trash2, Monitor, MapPin, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Totem {
  id: string;
  nombre: string;
  ubicacion: string;
  codigo: string;
  tipo: "totem";
  url_gestion: string;
  configuracion_web: {
    titulo: string;
    descripcion: string;
    tema: string;
    contenido_html?: string;
  };
  layout: {
    template: string;
    configuracion: Record<string, any>;
  };
  widgets: {
    activos: string[];
  };
  timezone: string;
  status: "online" | "offline" | "maintenance";
  last_seen?: string;
}

const Totems = () => {
  const { toast } = useToast();
  const [totems, setTotems] = useState<Totem[]>([
    {
      id: "1",
      nombre: "Tótem Lobby Principal",
      ubicacion: "Lobby - Recepción",
      codigo: "TT-LOBBY-001",
      tipo: "totem",
      url_gestion: "https://admin.smartroom.com/totem/lobby-001",
      configuracion_web: {
        titulo: "Bienvenido al Hotel Plaza Central",
        descripcion: "Información y servicios del hotel",
        tema: "modern_blue",
        contenido_html: "<div><h2>Servicios disponibles</h2><ul><li>Recepción 24h</li><li>WiFi gratuito</li></ul></div>"
      },
      layout: {
        template: "welcome_screen",
        configuracion: { theme: "modern", language: "es" }
      },
      widgets: {
        activos: ["welcome", "weather", "events", "promotions"]
      },
      timezone: "America/Mexico_City",
      status: "online",
      last_seen: "2024-03-20 14:30"
    },
    {
      id: "2",
      nombre: "Tótem Restaurante",
      ubicacion: "Restaurante Principal",
      codigo: "TT-REST-001",
      tipo: "totem",
      url_gestion: "https://admin.smartroom.com/totem/rest-001",
      configuracion_web: {
        titulo: "Menú del Restaurante",
        descripcion: "Especialidades y horarios",
        tema: "elegant_gold"
      },
      layout: {
        template: "menu_display",
        configuracion: { theme: "elegant", language: "es" }
      },
      widgets: {
        activos: ["menu", "specials", "hours"]
      },
      timezone: "America/Mexico_City",
      status: "online",
      last_seen: "2024-03-20 14:25"
    },
    {
      id: "3",
      nombre: "Tótem Piscina",
      ubicacion: "Área de Piscina",
      codigo: "TT-POOL-001",
      tipo: "totem",
      url_gestion: "https://admin.smartroom.com/totem/pool-001",
      configuracion_web: {
        titulo: "Actividades de Piscina",
        descripcion: "Seguridad y entretenimiento",
        tema: "vibrant_green"
      },
      layout: {
        template: "outdoor_display",
        configuracion: { theme: "bright", language: "es" }
      },
      widgets: {
        activos: ["weather", "activities", "safety"]
      },
      timezone: "America/Mexico_City",
      status: "maintenance",
      last_seen: "2024-03-19 16:45"
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTotem, setEditingTotem] = useState<Totem | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    codigo: "",
    url_gestion: "",
    titulo_web: "",
    descripcion_web: "",
    tema_web: "modern_blue",
    template: "welcome_screen",
    timezone: "America/Mexico_City"
  });

  const getStatusBadge = (status: Totem["status"]) => {
    const statusConfig = {
      online: { label: "En Línea", variant: "default" as const, color: "text-tertiary" },
      offline: { label: "Desconectado", variant: "destructive" as const, color: "text-destructive" },
      maintenance: { label: "Mantenimiento", variant: "secondary" as const, color: "text-warning" }
    };
    
    return statusConfig[status];
  };

  const handleCreateTotem = () => {
    const newTotem: Totem = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      ubicacion: formData.ubicacion,
      codigo: formData.codigo,
      tipo: "totem",
      url_gestion: formData.url_gestion,
      configuracion_web: {
        titulo: formData.titulo_web,
        descripcion: formData.descripcion_web,
        tema: formData.tema_web
      },
      layout: {
        template: formData.template,
        configuracion: { theme: "modern", language: "es" }
      },
      widgets: {
        activos: ["welcome", "weather"]
      },
      timezone: formData.timezone,
      status: "offline"
    };

    setTotems([...totems, newTotem]);
    setIsCreateDialogOpen(false);
    setFormData({
      nombre: "",
      ubicacion: "",
      codigo: "",
      url_gestion: "",
      titulo_web: "",
      descripcion_web: "",
      tema_web: "modern_blue",
      template: "welcome_screen",
      timezone: "America/Mexico_City"
    });
    
    toast({
      title: "Tótem creado",
      description: "El tótem ha sido creado exitosamente.",
    });
  };

  const handleDeleteTotem = (id: string) => {
    setTotems(totems.filter(t => t.id !== id));
    toast({
      title: "Tótem eliminado",
      description: "El tótem ha sido eliminado exitosamente.",
    });
  };

  const handleToggleStatus = (id: string) => {
    setTotems(totems.map(totem => {
      if (totem.id === id) {
        const newStatus = totem.status === "online" ? "offline" : "online";
        return { 
          ...totem, 
          status: newStatus,
          last_seen: newStatus === "online" ? new Date().toISOString().slice(0, 16).replace('T', ' ') : totem.last_seen
        };
      }
      return totem;
    }));

    toast({
      title: "Estado actualizado",
      description: "El estado del tótem ha sido actualizado.",
    });
  };

  const handleEditTotem = (totem: Totem) => {
    setEditingTotem(totem);
    setFormData({
      nombre: totem.nombre,
      ubicacion: totem.ubicacion,
      codigo: totem.codigo,
      url_gestion: totem.url_gestion,
      titulo_web: totem.configuracion_web.titulo,
      descripcion_web: totem.configuracion_web.descripcion,
      tema_web: totem.configuracion_web.tema,
      template: totem.layout.template,
      timezone: totem.timezone
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTotem = () => {
    if (!editingTotem) return;

    const updatedTotem: Totem = {
      ...editingTotem,
      nombre: formData.nombre,
      ubicacion: formData.ubicacion,
      codigo: formData.codigo,
      url_gestion: formData.url_gestion,
      configuracion_web: {
        titulo: formData.titulo_web,
        descripcion: formData.descripcion_web,
        tema: formData.tema_web
      },
      layout: {
        template: formData.template,
        configuracion: { theme: "modern", language: "es" }
      },
      timezone: formData.timezone
    };

    setTotems(totems.map(t => t.id === editingTotem.id ? updatedTotem : t));
    setIsEditDialogOpen(false);
    setEditingTotem(null);
    setFormData({
      nombre: "",
      ubicacion: "",
      codigo: "",
      url_gestion: "",
      titulo_web: "",
      descripcion_web: "",
      tema_web: "modern_blue",
      template: "welcome_screen",
      timezone: "America/Mexico_City"
    });
    
    toast({
      title: "Tótem actualizado",
      description: "El tótem ha sido actualizado exitosamente.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Tótems</h1>
            <p className="text-muted-foreground">Administra los tótems informativos del hotel</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Tótem
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Tótem</DialogTitle>
                <DialogDescription>
                  Configura un nuevo tótem informativo para el hotel
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre del Tótem</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Tótem Lobby Principal"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Input
                    id="ubicacion"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    placeholder="Lobby - Recepción"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código del Dispositivo</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    placeholder="TT-LOBBY-001"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="template">Plantilla de Visualización</Label>
                  <Select value={formData.template} onValueChange={(value) => setFormData({...formData, template: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome_screen">Pantalla de Bienvenida</SelectItem>
                      <SelectItem value="menu_display">Mostrador de Menú</SelectItem>
                      <SelectItem value="outdoor_display">Pantalla Exterior</SelectItem>
                      <SelectItem value="info_kiosk">Kiosco Informativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="url_gestion">URL de Gestión</Label>
                  <Input
                    id="url_gestion"
                    value={formData.url_gestion}
                    onChange={(e) => setFormData({...formData, url_gestion: e.target.value})}
                    placeholder="https://admin.smartroom.com/totem/..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Configuración Web</Label>
                  <div className="grid gap-2">
                    <Input
                      placeholder="Título de la página"
                      value={formData.titulo_web}
                      onChange={(e) => setFormData({...formData, titulo_web: e.target.value})}
                    />
                    <Input
                      placeholder="Descripción"
                      value={formData.descripcion_web}
                      onChange={(e) => setFormData({...formData, descripcion_web: e.target.value})}
                    />
                    <Select value={formData.tema_web} onValueChange={(value) => setFormData({...formData, tema_web: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern_blue">Moderno Azul</SelectItem>
                        <SelectItem value="elegant_gold">Elegante Dorado</SelectItem>
                        <SelectItem value="minimal_gray">Minimalista Gris</SelectItem>
                        <SelectItem value="vibrant_green">Vibrante Verde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateTotem} className="bg-gradient-primary">
                  Crear Tótem
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tótems</CardTitle>
              <Monitor className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totems.length}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Línea</CardTitle>
              <Monitor className="h-4 w-4 text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">
                {totems.filter(t => t.status === "online").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Desconectados</CardTitle>
              <Monitor className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {totems.filter(t => t.status === "offline").length}
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
                {totems.filter(t => t.status === "maintenance").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              Tótems Registrados
            </CardTitle>
            <CardDescription>
              Lista de todos los tótems informativos del sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Gestión Web</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Plantilla</TableHead>
                  <TableHead>Última Conexión</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {totems.map((totem) => {
                  const statusConfig = getStatusBadge(totem.status);
                  
                  return (
                    <TableRow key={totem.id}>
                      <TableCell className="font-medium">{totem.nombre}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {totem.ubicacion}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {totem.codigo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{totem.configuracion_web.titulo}</div>
                          <div className="text-muted-foreground text-xs">
                            <a href={totem.url_gestion} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {totem.url_gestion}
                            </a>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant} className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {totem.layout.template.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {totem.last_seen || "Nunca"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTotem(totem)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(totem.id)}
                        >
                          {totem.status === "online" ? "Desconectar" : "Conectar"}
                        </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteTotem(totem.id)}
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

export default Totems;