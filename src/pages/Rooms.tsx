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
import { Plus, Edit, Trash2, Bed, Monitor, Palette } from "lucide-react";
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
  tv_relacionado?: {
    marca: string;
    modelo: string;
    plataformas: TVPlatform[];
  };
  personalizacion?: {
    skin_type: "modern" | "classic" | "minimal" | "luxury";
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
      },
      personalizacion: {
        skin_type: "modern",
        widgets: ["welcome", "weather"],
        configuracion: { theme: "premium" }
      }
    },
    {
      id: "2",
      codigo_habitacion: "102",
      hotel_id: "1",
      hotel_name: "Hotel Plaza Central",
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
      personalizacion: {
        skin_type: "luxury",
        widgets: ["welcome", "weather", "concierge"],
        configuracion: { theme: "premium", animations: true }
      }
    },
    {
      id: "3",
      codigo_habitacion: "201",
      hotel_id: "2",
      hotel_name: "Resort Marina Bay",
      personalizacion: {
        skin_type: "classic"
      }
    },
    {
      id: "4",
      codigo_habitacion: "301",
      hotel_id: "1",
      hotel_name: "Hotel Plaza Central",
      personalizacion: {
        skin_type: "minimal"
      }
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTVDialogOpen, setIsTVDialogOpen] = useState(false);
  const [isPersonalizacionDialogOpen, setIsPersonalizacionDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [managingTVRoom, setManagingTVRoom] = useState<Room | null>(null);
  const [personalizacionRoom, setPersonalizacionRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    codigo_habitacion: "",
    hotel_id: "1",
    skin_type: "modern" as "modern" | "classic" | "minimal" | "luxury"
  });
  const [tvFormData, setTvFormData] = useState({
    marca: "",
    modelo: "",
    plataformas: [] as TVPlatform[]
  });
  const [personalizacionData, setPersonalizacionData] = useState({
    skin_type: "modern" as "modern" | "classic" | "minimal" | "luxury",
    widgets: [] as string[],
    configuracion: {} as Record<string, any>
  });

  const getSkinBadge = (skinType: string) => {
    const skinConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      modern: { label: "Moderno", variant: "default" },
      classic: { label: "Clásico", variant: "secondary" },
      minimal: { label: "Minimalista", variant: "outline" },
      luxury: { label: "Lujo", variant: "default" }
    };
    
    return skinConfig[skinType] || { label: skinType, variant: "outline" as const };
  };

  const handleCreateRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      codigo_habitacion: formData.codigo_habitacion,
      hotel_id: formData.hotel_id,
      hotel_name: formData.hotel_id === "1" ? "Hotel Plaza Central" : "Resort Marina Bay",
      personalizacion: {
        skin_type: formData.skin_type
      }
    };

    setRooms([...rooms, newRoom]);
    setIsCreateDialogOpen(false);
    setFormData({
      codigo_habitacion: "",
      hotel_id: "1",
      skin_type: "modern"
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
      skin_type: room.personalizacion?.skin_type || "modern"
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
      personalizacion: {
        ...editingRoom.personalizacion,
        skin_type: formData.skin_type
      }
    };

    setRooms(rooms.map(r => r.id === editingRoom.id ? updatedRoom : r));
    setIsEditDialogOpen(false);
    setEditingRoom(null);
    setFormData({
      codigo_habitacion: "",
      hotel_id: "1",
      skin_type: "modern"
    });
    
    toast({
      title: "Habitación actualizada",
      description: "La habitación ha sido actualizada exitosamente.",
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

  const handleManagePersonalizacion = (room: Room) => {
    setPersonalizacionRoom(room);
    setPersonalizacionData({
      skin_type: room.personalizacion?.skin_type || "modern",
      widgets: room.personalizacion?.widgets || [],
      configuracion: room.personalizacion?.configuracion || {}
    });
    setIsPersonalizacionDialogOpen(true);
  };

  const handleSavePersonalizacion = () => {
    if (!personalizacionRoom) return;

    const updatedRoom: Room = {
      ...personalizacionRoom,
      personalizacion: {
        skin_type: personalizacionData.skin_type,
        widgets: personalizacionData.widgets,
        configuracion: personalizacionData.configuracion
      }
    };

    setRooms(rooms.map(r => r.id === personalizacionRoom.id ? updatedRoom : r));
    setIsPersonalizacionDialogOpen(false);
    setPersonalizacionRoom(null);
    
    toast({
      title: "Personalización actualizada",
      description: "Los ajustes de personalización han sido guardados exitosamente.",
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

  const availableWidgets = [
    "welcome", "weather", "concierge", "menu", "events", "promotions", "news"
  ];

  const handleToggleWidget = (widget: string) => {
    const newWidgets = personalizacionData.widgets.includes(widget)
      ? personalizacionData.widgets.filter(w => w !== widget)
      : [...personalizacionData.widgets, widget];
    setPersonalizacionData({...personalizacionData, widgets: newWidgets});
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
                  <Label htmlFor="skin_type">Tipo de Skin</Label>
                  <Select value={formData.skin_type} onValueChange={(value: "modern" | "classic" | "minimal" | "luxury") => setFormData({...formData, skin_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Moderno</SelectItem>
                      <SelectItem value="classic">Clásico</SelectItem>
                      <SelectItem value="minimal">Minimalista</SelectItem>
                      <SelectItem value="luxury">Lujo</SelectItem>
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

          {/* Edit Room Dialog */}
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
                  <Label htmlFor="edit-skin_type">Tipo de Skin</Label>
                  <Select value={formData.skin_type} onValueChange={(value: "modern" | "classic" | "minimal" | "luxury") => setFormData({...formData, skin_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Moderno</SelectItem>
                      <SelectItem value="classic">Clásico</SelectItem>
                      <SelectItem value="minimal">Minimalista</SelectItem>
                      <SelectItem value="luxury">Lujo</SelectItem>
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

                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Plataformas Digitales</h4>
                    <Button type="button" onClick={handleAddPlatform} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Plataforma
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {tvFormData.plataformas.map((platform) => (
                      <div key={platform.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-medium">Plataforma #{platform.id}</h5>
                          <Button 
                            type="button" 
                            onClick={() => handleRemovePlatform(platform.id)} 
                            size="sm" 
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-2">
                            <Label>Nombre</Label>
                            <Input
                              value={platform.nombre}
                              onChange={(e) => handleUpdatePlatform(platform.id, "nombre", e.target.value)}
                              placeholder="Netflix, Android TV, etc."
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Estado</Label>
                            <Select 
                              value={platform.estado} 
                              onValueChange={(value: "activo" | "vencido" | "pendiente") => handleUpdatePlatform(platform.id, "estado", value)}
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
                          <div className="grid gap-2">
                            <Label>Usuario</Label>
                            <Input
                              value={platform.usuario}
                              onChange={(e) => handleUpdatePlatform(platform.id, "usuario", e.target.value)}
                              placeholder="usuario@ejemplo.com"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Contraseña</Label>
                            <Input
                              type="password"
                              value={platform.password}
                              onChange={(e) => handleUpdatePlatform(platform.id, "password", e.target.value)}
                              placeholder="••••••••"
                            />
                          </div>
                          <div className="grid gap-2 col-span-2">
                            <Label>Fecha de Caducidad</Label>
                            <Input
                              type="date"
                              value={platform.fecha_caducidad}
                              onChange={(e) => handleUpdatePlatform(platform.id, "fecha_caducidad", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTVDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveTV} className="bg-gradient-primary">
                  Guardar TV
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Personalizacion Dialog */}
          <Dialog open={isPersonalizacionDialogOpen} onOpenChange={setIsPersonalizacionDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Personalización - Habitación {personalizacionRoom?.codigo_habitacion}</DialogTitle>
                <DialogDescription>
                  Configura el tipo de skin y widgets de la habitación
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label>Tipo de Skin</Label>
                  <Select 
                    value={personalizacionData.skin_type} 
                    onValueChange={(value: "modern" | "classic" | "minimal" | "luxury") => 
                      setPersonalizacionData({...personalizacionData, skin_type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Moderno</SelectItem>
                      <SelectItem value="classic">Clásico</SelectItem>
                      <SelectItem value="minimal">Minimalista</SelectItem>
                      <SelectItem value="luxury">Lujo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Widgets Activos</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableWidgets.map((widget) => (
                      <div key={widget} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={widget}
                          checked={personalizacionData.widgets.includes(widget)}
                          onChange={() => handleToggleWidget(widget)}
                          className="rounded"
                        />
                        <Label htmlFor={widget} className="text-sm">
                          {widget.charAt(0).toUpperCase() + widget.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPersonalizacionDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSavePersonalizacion} className="bg-gradient-primary">
                  Guardar Personalización
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Habitaciones</CardTitle>
              <Bed className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{rooms.length}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Con TV Configurado</CardTitle>
              <Monitor className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {rooms.filter(r => r.tv_relacionado).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Personalizadas</CardTitle>
              <Palette className="h-4 w-4 text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">
                {rooms.filter(r => r.personalizacion?.widgets && r.personalizacion.widgets.length > 0).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-primary" />
              Habitaciones Registradas
            </CardTitle>
            <CardDescription>
              Lista de todas las habitaciones del sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Habitación</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Tipo de Skin</TableHead>
                  <TableHead>TV</TableHead>
                  <TableHead>Personalización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => {
                  const skinConfig = getSkinBadge(room.personalizacion?.skin_type || "modern");
                  
                  return (
                    <TableRow key={room.id}>
                      <TableCell>
                        <div className="font-medium">{room.codigo_habitacion}</div>
                      </TableCell>
                      <TableCell>{room.hotel_name}</TableCell>
                      <TableCell>
                        <Badge variant={skinConfig.variant}>
                          {skinConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {room.tv_relacionado ? (
                          <Badge variant="default">
                            {room.tv_relacionado.marca} {room.tv_relacionado.modelo}
                          </Badge>
                        ) : (
                          <Badge variant="outline">No configurado</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {room.personalizacion?.widgets && room.personalizacion.widgets.length > 0 ? (
                            <span>{room.personalizacion.widgets.length} widgets activos</span>
                          ) : (
                            <span className="text-muted-foreground">Sin personalizar</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageTV(room)}
                        >
                          📺 TV
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManagePersonalizacion(room)}
                        >
                          <Palette className="h-4 w-4" />
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
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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