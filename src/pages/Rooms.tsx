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
import { Plus, Edit, Trash2, Bed, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TVPlatform {
  id: string;
  nombre: string;
  usuario: string;
  password: string;
  fecha_caducidad: string;
  estado: "activo" | "vencido" | "pendiente";
}

interface Room {
  id: string;
  codigo_habitacion: string;
  hotel_id: string;
  hotel_name: string;
  tipo: string;
  estado: "libre" | "ocupada" | "mantenimiento";
  tv_relacionado?: {
    marca: string;
    modelo: string;
    plataformas: TVPlatform[];
  };
  overrides?: {
    widgets?: string[];
    configuracion?: Record<string, any>;
  };
}

const Rooms = () => {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      codigo_habitacion: "101",
      hotel_id: "1",
      hotel_name: "Hotel Plaza Central",
      tipo: "standard",
      estado: "libre",
      tv_relacionado: {
        marca: "Samsung",
        modelo: "QN55Q70A",
        plataformas: [
          {
            id: "1",
            nombre: "Android TV",
            usuario: "hotel_tv_101",
            password: "tv2024*101",
            fecha_caducidad: "2024-12-31",
            estado: "activo"
          },
          {
            id: "2", 
            nombre: "Netflix",
            usuario: "hotel.plaza@netflix.com",
            password: "Netflix2024!",
            fecha_caducidad: "2024-06-30",
            estado: "vencido"
          }
        ]
      }
    },
    {
      id: "2",
      codigo_habitacion: "102",
      hotel_id: "1",
      hotel_name: "Hotel Plaza Central",
      tipo: "suite",
      estado: "ocupada",
      tv_relacionado: {
        marca: "LG",
        modelo: "OLED55C1PSA",
        plataformas: [
          {
            id: "3",
            nombre: "webOS",
            usuario: "suite_tv_102",
            password: "suite2024*102",
            fecha_caducidad: "2025-01-15",
            estado: "activo"
          },
          {
            id: "4",
            nombre: "Prime Video",
            usuario: "hotel.plaza@amazon.com",
            password: "Prime2024@",
            fecha_caducidad: "2024-08-30",
            estado: "activo"
          }
        ]
      },
      overrides: {
        widgets: ["welcome", "weather"],
        configuracion: { theme: "premium" }
      }
    },
    {
      id: "3",
      codigo_habitacion: "201",
      hotel_id: "2",
      hotel_name: "Resort Marina Bay",
      tipo: "deluxe",
      estado: "libre"
    },
    {
      id: "4",
      codigo_habitacion: "301",
      hotel_id: "1",
      hotel_name: "Hotel Plaza Central",
      tipo: "premium",
      estado: "mantenimiento"
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTVDialogOpen, setIsTVDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [managingTVRoom, setManagingTVRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    codigo_habitacion: "",
    hotel_id: "1",
    tipo: "standard",
    estado: "libre" as Room["estado"]
  });
  const [tvFormData, setTvFormData] = useState({
    marca: "",
    modelo: "",
    plataformas: [] as TVPlatform[]
  });

  const getStatusBadge = (estado: Room["estado"]) => {
    const statusConfig = {
      libre: { label: "Libre", variant: "default" as const, color: "text-tertiary" },
      ocupada: { label: "Ocupada", variant: "secondary" as const, color: "text-secondary" },
      mantenimiento: { label: "Mantenimiento", variant: "destructive" as const, color: "text-warning" }
    };
    
    return statusConfig[estado];
  };

  const getTipoBadge = (tipo: string) => {
    const tipoConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      standard: { label: "Standard", variant: "outline" },
      suite: { label: "Suite", variant: "secondary" },
      premium: { label: "Premium", variant: "default" },
      deluxe: { label: "Deluxe", variant: "default" }
    };
    
    return tipoConfig[tipo] || { label: tipo, variant: "outline" as const };
  };

  const handleCreateRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      codigo_habitacion: formData.codigo_habitacion,
      hotel_id: formData.hotel_id,
      hotel_name: formData.hotel_id === "1" ? "Hotel Plaza Central" : "Resort Marina Bay",
      tipo: formData.tipo,
      estado: formData.estado
    };

    setRooms([...rooms, newRoom]);
    setIsCreateDialogOpen(false);
    setFormData({
      codigo_habitacion: "",
      hotel_id: "1",
      tipo: "standard",
      estado: "libre"
    });
    
    toast({
      title: "Habitación creada",
      description: "La habitación ha sido creada exitosamente.",
    });
  };

  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
    toast({
      title: "Habitación eliminada",
      description: "La habitación ha sido eliminada exitosamente.",
    });
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      codigo_habitacion: room.codigo_habitacion,
      hotel_id: room.hotel_id,
      tipo: room.tipo,
      estado: room.estado
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateRoom = () => {
    if (!editingRoom) return;

    const updatedRoom: Room = {
      ...editingRoom,
      codigo_habitacion: formData.codigo_habitacion,
      hotel_id: formData.hotel_id,
      hotel_name: formData.hotel_id === "1" ? "Hotel Plaza Central" : "Resort Marina Bay",
      tipo: formData.tipo,
      estado: formData.estado
    };

    setRooms(rooms.map(r => r.id === editingRoom.id ? updatedRoom : r));
    setIsEditDialogOpen(false);
    setEditingRoom(null);
    setFormData({
      codigo_habitacion: "",
      hotel_id: "1",
      tipo: "standard",
      estado: "libre"
    });
    
    toast({
      title: "Habitación actualizada",
      description: "La habitación ha sido actualizada exitosamente.",
    });
  };

  const handleChangeStatus = (id: string, newStatus: Room["estado"]) => {
    setRooms(rooms.map(room => 
      room.id === id ? { ...room, estado: newStatus } : room
    ));
    
    toast({
      title: "Estado actualizado",
      description: "El estado de la habitación ha sido actualizado.",
    });
  };

  const handleManageTV = (room: Room) => {
    setManagingTVRoom(room);
    setTvFormData({
      marca: room.tv_relacionado?.marca || "",
      modelo: room.tv_relacionado?.modelo || "",
      plataformas: room.tv_relacionado?.plataformas || []
    });
    setIsTVDialogOpen(true);
  };

  const handleSaveTV = () => {
    if (!managingTVRoom) return;

    const updatedRoom: Room = {
      ...managingTVRoom,
      tv_relacionado: {
        marca: tvFormData.marca,
        modelo: tvFormData.modelo,
        plataformas: tvFormData.plataformas
      }
    };

    setRooms(rooms.map(r => r.id === managingTVRoom.id ? updatedRoom : r));
    setIsTVDialogOpen(false);
    setManagingTVRoom(null);
    
    toast({
      title: "TV actualizado",
      description: "La información del TV ha sido actualizada exitosamente.",
    });
  };

  const handleAddPlatform = () => {
    const newPlatform: TVPlatform = {
      id: Date.now().toString(),
      nombre: "",
      usuario: "",
      password: "",
      fecha_caducidad: "",
      estado: "pendiente"
    };
    setTvFormData({
      ...tvFormData,
      plataformas: [...tvFormData.plataformas, newPlatform]
    });
  };

  const handleRemovePlatform = (platformId: string) => {
    setTvFormData({
      ...tvFormData,
      plataformas: tvFormData.plataformas.filter(p => p.id !== platformId)
    });
  };

  const handleUpdatePlatform = (platformId: string, field: keyof TVPlatform, value: string) => {
    setTvFormData({
      ...tvFormData,
      plataformas: tvFormData.plataformas.map(p => 
        p.id === platformId ? { ...p, [field]: value } : p
      )
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Habitaciones</h1>
            <p className="text-muted-foreground">Administra las habitaciones de todos los hoteles</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Habitación
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nueva Habitación</DialogTitle>
                <DialogDescription>
                  Agrega una nueva habitación al hotel seleccionado
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código de Habitación</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo_habitacion}
                    onChange={(e) => setFormData({...formData, codigo_habitacion: e.target.value})}
                    placeholder="101"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="hotel">Hotel</Label>
                  <Select value={formData.hotel_id} onValueChange={(value) => setFormData({...formData, hotel_id: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Hotel Plaza Central</SelectItem>
                      <SelectItem value="2">Resort Marina Bay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de Habitación</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado Inicial</Label>
                  <Select value={formData.estado} onValueChange={(value: Room["estado"]) => setFormData({...formData, estado: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="libre">Libre</SelectItem>
                      <SelectItem value="ocupada">Ocupada</SelectItem>
                      <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateRoom} className="bg-gradient-primary">
                  Crear Habitación
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Editar Habitación</DialogTitle>
                <DialogDescription>
                  Modifica los detalles de la habitación
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-codigo">Código de Habitación</Label>
                  <Input
                    id="edit-codigo"
                    value={formData.codigo_habitacion}
                    onChange={(e) => setFormData({...formData, codigo_habitacion: e.target.value})}
                    placeholder="101"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-hotel">Hotel</Label>
                  <Select value={formData.hotel_id} onValueChange={(value) => setFormData({...formData, hotel_id: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Hotel Plaza Central</SelectItem>
                      <SelectItem value="2">Resort Marina Bay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-tipo">Tipo de Habitación</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value: Room["estado"]) => setFormData({...formData, estado: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="libre">Libre</SelectItem>
                      <SelectItem value="ocupada">Ocupada</SelectItem>
                      <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateRoom} className="bg-gradient-primary">
                  Actualizar Habitación
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* TV Management Dialog */}
          <Dialog open={isTVDialogOpen} onOpenChange={setIsTVDialogOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Gestionar TV - Habitación {managingTVRoom?.codigo_habitacion}</DialogTitle>
                <DialogDescription>
                  Configura el TV y las plataformas digitales de la habitación
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                {/* TV Information */}
                <div className="grid gap-4">
                  <h4 className="text-sm font-medium">Información del TV</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tv-marca">Marca</Label>
                      <Input
                        id="tv-marca"
                        value={tvFormData.marca}
                        onChange={(e) => setTvFormData({...tvFormData, marca: e.target.value})}
                        placeholder="Samsung, LG, Sony..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tv-modelo">Modelo</Label>
                      <Input
                        id="tv-modelo"
                        value={tvFormData.modelo}
                        onChange={(e) => setTvFormData({...tvFormData, modelo: e.target.value})}
                        placeholder="QN55Q70A, OLED55C1PSA..."
                      />
                    </div>
                  </div>
                </div>

                {/* Platform Management */}
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Plataformas Digitales</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddPlatform}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Plataforma
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {tvFormData.plataformas.map((plataforma, index) => (
                      <Card key={plataforma.id} className="p-4">
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium">Plataforma #{index + 1}</h5>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemovePlatform(plataforma.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>Nombre de la Plataforma</Label>
                              <Select 
                                value={plataforma.nombre} 
                                onValueChange={(value) => handleUpdatePlatform(plataforma.id, "nombre", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar plataforma" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Android TV">Android TV</SelectItem>
                                  <SelectItem value="webOS">webOS (LG)</SelectItem>
                                  <SelectItem value="Tizen">Tizen (Samsung)</SelectItem>
                                  <SelectItem value="Netflix">Netflix</SelectItem>
                                  <SelectItem value="Prime Video">Prime Video</SelectItem>
                                  <SelectItem value="YouTube TV">YouTube TV</SelectItem>
                                  <SelectItem value="Roku TV">Roku TV</SelectItem>
                                  <SelectItem value="Apple TV">Apple TV</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="grid gap-2">
                              <Label>Estado</Label>
                              <Select 
                                value={plataforma.estado} 
                                onValueChange={(value) => handleUpdatePlatform(plataforma.id, "estado", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="activo">Activo</SelectItem>
                                  <SelectItem value="vencido">Vencido</SelectItem>
                                  <SelectItem value="pendiente">Pendiente</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                              <Label>Usuario/Email</Label>
                              <Input
                                value={plataforma.usuario}
                                onChange={(e) => handleUpdatePlatform(plataforma.id, "usuario", e.target.value)}
                                placeholder="usuario@email.com"
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label>Contraseña</Label>
                              <Input
                                type="password"
                                value={plataforma.password}
                                onChange={(e) => handleUpdatePlatform(plataforma.id, "password", e.target.value)}
                                placeholder="••••••••"
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label>Fecha de Caducidad</Label>
                              <Input
                                type="date"
                                value={plataforma.fecha_caducidad}
                                onChange={(e) => handleUpdatePlatform(plataforma.id, "fecha_caducidad", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    {tvFormData.plataformas.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        No hay plataformas configuradas. Haz clic en "Agregar Plataforma" para comenzar.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTVDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveTV} className="bg-gradient-primary">
                  Guardar TV y Plataformas
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Habitaciones</CardTitle>
              <Home className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{rooms.length}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Libres</CardTitle>
              <Bed className="h-4 w-4 text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">
                {rooms.filter(r => r.estado === "libre").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupadas</CardTitle>
              <Bed className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {rooms.filter(r => r.estado === "ocupada").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mantenimiento</CardTitle>
              <Bed className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {rooms.filter(r => r.estado === "mantenimiento").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-primary" />
              Todas las Habitaciones
            </CardTitle>
            <CardDescription>
              Lista de todas las habitaciones registradas en el sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Habitación</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>TV y Plataformas</TableHead>
                  <TableHead>Personalización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => {
                  const statusConfig = getStatusBadge(room.estado);
                  const tipoConfig = getTipoBadge(room.tipo);
                  
                  return (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium font-mono">
                        {room.codigo_habitacion}
                      </TableCell>
                      <TableCell>{room.hotel_name}</TableCell>
                      <TableCell>
                        <Badge variant={tipoConfig.variant}>
                          {tipoConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={room.estado} 
                          onValueChange={(value: Room["estado"]) => handleChangeStatus(room.id, value)}
                        >
                          <SelectTrigger className="w-auto">
                            <Badge variant={statusConfig.variant} className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="libre">Libre</SelectItem>
                            <SelectItem value="ocupada">Ocupada</SelectItem>
                            <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {room.tv_relacionado ? (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {room.tv_relacionado.marca} {room.tv_relacionado.modelo}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {room.tv_relacionado.plataformas.map((plataforma) => (
                                <Badge 
                                  key={plataforma.id}
                                  variant={plataforma.estado === "activo" ? "default" : plataforma.estado === "vencido" ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  {plataforma.nombre}
                                </Badge>
                              ))}
                            </div>
                            {room.tv_relacionado.plataformas.some(p => p.estado === "vencido") && (
                              <div className="text-xs text-destructive">
                                ⚠️ Algunas plataformas vencidas
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin TV configurado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {room.overrides ? (
                          <Badge variant="outline" className="text-primary">
                            Personalizada
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Por defecto
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleManageTV(room)}
                            className="text-primary"
                          >
                            📺 TV
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditRoom(room)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteRoom(room.id)}
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

export default Rooms;