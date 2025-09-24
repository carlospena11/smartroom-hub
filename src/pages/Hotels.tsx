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
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Hotel {
  id: string;
  nombre: string;
  codigo_hotel: string;
  timezone: string;
  cantidad_habitaciones: number;
  tiene_anuncios_eventos: boolean;
  tiene_pantallas_digitales: boolean;
  usuario_hotel?: {
    nombre: string;
    email: string;
    permisos: string[];
  };
  branding?: {
    logo?: string;
    colores?: {
      primario: string;
      secundario: string;
    };
  };
  theme?: {
    layout_id: string;
    layout_name: string;
  };
}

const Hotels = () => {
  const { toast } = useToast();
  const [hotels, setHotels] = useState<Hotel[]>([
    {
      id: "1",
      nombre: "Hotel Plaza Central",
      codigo_hotel: "HPC001",
      timezone: "America/Mexico_City",
      cantidad_habitaciones: 120,
      tiene_anuncios_eventos: true,
      tiene_pantallas_digitales: true,
      usuario_hotel: {
        nombre: "María González",
        email: "maria@hotelplaza.com",
        permisos: ["modificar_imagenes", "editar_textos", "gestionar_anuncios"]
      },
      branding: {
        colores: {
          primario: "#1e40af",
          secundario: "#f59e0b"
        }
      },
      theme: {
        layout_id: "modern_01",
        layout_name: "Moderno Elegante"
      }
    },
    {
      id: "2", 
      nombre: "Resort Marina Bay",
      codigo_hotel: "RMB002",
      timezone: "America/Cancun",
      cantidad_habitaciones: 85,
      tiene_anuncios_eventos: true,
      tiene_pantallas_digitales: false,
      usuario_hotel: {
        nombre: "Carlos Ruiz",
        email: "carlos@marinabaybay.com",
        permisos: ["modificar_imagenes", "editar_textos"]
      },
      branding: {
        colores: {
          primario: "#059669",
          secundario: "#dc2626"
        }
      },
      theme: {
        layout_id: "beach_01",
        layout_name: "Tropical Beach"
      }
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    codigo_hotel: "",
    timezone: "UTC",
    cantidad_habitaciones: 50,
    tiene_anuncios_eventos: false,
    tiene_pantallas_digitales: false,
    usuario_nombre: "",
    usuario_email: "",
    primario: "#1e40af",
    secundario: "#f59e0b",
    layout_id: "modern_01"
  });

  const handleCreateHotel = () => {
    const newHotel: Hotel = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      codigo_hotel: formData.codigo_hotel,
      timezone: formData.timezone,
      cantidad_habitaciones: formData.cantidad_habitaciones,
      tiene_anuncios_eventos: formData.tiene_anuncios_eventos,
      tiene_pantallas_digitales: formData.tiene_pantallas_digitales,
      usuario_hotel: formData.usuario_nombre ? {
        nombre: formData.usuario_nombre,
        email: formData.usuario_email,
        permisos: ["modificar_imagenes", "editar_textos"]
      } : undefined,
      branding: {
        colores: {
          primario: formData.primario,
          secundario: formData.secundario
        }
      },
      theme: {
        layout_id: formData.layout_id,
        layout_name: formData.layout_id === "modern_01" ? "Moderno Elegante" : "Otro Layout"
      }
    };

    setHotels([...hotels, newHotel]);
    setIsCreateDialogOpen(false);
    setFormData({
      nombre: "",
      codigo_hotel: "",
      timezone: "UTC",
      cantidad_habitaciones: 50,
      tiene_anuncios_eventos: false,
      tiene_pantallas_digitales: false,
      usuario_nombre: "",
      usuario_email: "",
      primario: "#1e40af",
      secundario: "#f59e0b",
      layout_id: "modern_01"
    });
    
    toast({
      title: "Hotel creado",
      description: "El hotel ha sido creado exitosamente.",
    });
  };

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setFormData({
      nombre: hotel.nombre,
      codigo_hotel: hotel.codigo_hotel,
      timezone: hotel.timezone,
      cantidad_habitaciones: hotel.cantidad_habitaciones,
      tiene_anuncios_eventos: hotel.tiene_anuncios_eventos,
      tiene_pantallas_digitales: hotel.tiene_pantallas_digitales,
      usuario_nombre: hotel.usuario_hotel?.nombre || "",
      usuario_email: hotel.usuario_hotel?.email || "",
      primario: hotel.branding?.colores?.primario || "#1e40af",
      secundario: hotel.branding?.colores?.secundario || "#f59e0b",
      layout_id: hotel.theme?.layout_id || "modern_01"
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateHotel = () => {
    if (!editingHotel) return;

    const updatedHotel: Hotel = {
      ...editingHotel,
      nombre: formData.nombre,
      codigo_hotel: formData.codigo_hotel,
      timezone: formData.timezone,
      cantidad_habitaciones: formData.cantidad_habitaciones,
      tiene_anuncios_eventos: formData.tiene_anuncios_eventos,
      tiene_pantallas_digitales: formData.tiene_pantallas_digitales,
      usuario_hotel: formData.usuario_nombre ? {
        nombre: formData.usuario_nombre,
        email: formData.usuario_email,
        permisos: ["modificar_imagenes", "editar_textos"]
      } : undefined,
      branding: {
        colores: {
          primario: formData.primario,
          secundario: formData.secundario
        }
      },
      theme: {
        layout_id: formData.layout_id,
        layout_name: formData.layout_id === "modern_01" ? "Moderno Elegante" : 
                     formData.layout_id === "classic_01" ? "Clásico Tradicional" :
                     formData.layout_id === "minimal_01" ? "Minimalista Clean" :
                     formData.layout_id === "beach_01" ? "Tropical Beach" :
                     formData.layout_id === "business_01" ? "Corporativo Business" : "Otro Layout"
      }
    };

    setHotels(hotels.map(h => h.id === editingHotel.id ? updatedHotel : h));
    setIsEditDialogOpen(false);
    setEditingHotel(null);
    setFormData({
      nombre: "",
      codigo_hotel: "",
      timezone: "UTC",
      cantidad_habitaciones: 50,
      tiene_anuncios_eventos: false,
      tiene_pantallas_digitales: false,
      usuario_nombre: "",
      usuario_email: "",
      primario: "#1e40af",
      secundario: "#f59e0b",
      layout_id: "modern_01"
    });
    
    toast({
      title: "Hotel actualizado",
      description: "El hotel ha sido actualizado exitosamente.",
    });
  };

  const handleDeleteHotel = (id: string) => {
    setHotels(hotels.filter(h => h.id !== id));
    toast({
      title: "Hotel eliminado",
      description: "El hotel ha sido eliminado exitosamente.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Hoteles</h1>
            <p className="text-muted-foreground">Administra los hoteles y su configuración</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Hotel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Hotel</DialogTitle>
                <DialogDescription>
                  Configura los detalles básicos del hotel
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre del Hotel</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Hotel Plaza Central"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código del Hotel</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo_hotel}
                    onChange={(e) => setFormData({...formData, codigo_hotel: e.target.value})}
                    placeholder="HPC001"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select value={formData.timezone} onValueChange={(value) => setFormData({...formData, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/Mexico_City">Ciudad de México</SelectItem>
                      <SelectItem value="America/Cancun">Cancún</SelectItem>
                      <SelectItem value="America/Tijuana">Tijuana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="primario">Color Primario</Label>
                    <Input
                      id="primario"
                      type="color"
                      value={formData.primario}
                      onChange={(e) => setFormData({...formData, primario: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="secundario">Color Secundario</Label>
                    <Input
                      id="secundario"
                      type="color"
                      value={formData.secundario}
                      onChange={(e) => setFormData({...formData, secundario: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="habitaciones">Cantidad de Habitaciones</Label>
                  <Input
                    id="habitaciones"
                    type="number"
                    min="1"
                    value={formData.cantidad_habitaciones}
                    onChange={(e) => setFormData({...formData, cantidad_habitaciones: parseInt(e.target.value)})}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="usuario_hotel">Usuario del Hotel</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Nombre completo"
                      value={formData.usuario_nombre}
                      onChange={(e) => setFormData({...formData, usuario_nombre: e.target.value})}
                    />
                    <Input
                      placeholder="email@hotel.com"
                      type="email"
                      value={formData.usuario_email}
                      onChange={(e) => setFormData({...formData, usuario_email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Características del Hotel</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="anuncios_eventos"
                        checked={formData.tiene_anuncios_eventos}
                        onChange={(e) => setFormData({...formData, tiene_anuncios_eventos: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="anuncios_eventos">Tiene anuncios de eventos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="pantallas_digitales"
                        checked={formData.tiene_pantallas_digitales}
                        onChange={(e) => setFormData({...formData, tiene_pantallas_digitales: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="pantallas_digitales">Tiene pantallas digitales</Label>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="layout">Layout/Skin TV</Label>
                  <Select value={formData.layout_id} onValueChange={(value) => setFormData({...formData, layout_id: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern_01">Moderno Elegante</SelectItem>
                      <SelectItem value="classic_01">Clásico Tradicional</SelectItem>
                      <SelectItem value="minimal_01">Minimalista Clean</SelectItem>
                      <SelectItem value="beach_01">Tropical Beach</SelectItem>
                      <SelectItem value="business_01">Corporativo Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateHotel} className="bg-gradient-primary">
                  Crear Hotel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Editar Hotel</DialogTitle>
                <DialogDescription>
                  Modifica los detalles del hotel
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-nombre">Nombre del Hotel</Label>
                  <Input
                    id="edit-nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Hotel Plaza Central"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-codigo">Código del Hotel</Label>
                  <Input
                    id="edit-codigo"
                    value={formData.codigo_hotel}
                    onChange={(e) => setFormData({...formData, codigo_hotel: e.target.value})}
                    placeholder="HPC001"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-timezone">Zona Horaria</Label>
                  <Select value={formData.timezone} onValueChange={(value) => setFormData({...formData, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/Mexico_City">Ciudad de México</SelectItem>
                      <SelectItem value="America/Cancun">Cancún</SelectItem>
                      <SelectItem value="America/Tijuana">Tijuana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-primario">Color Primario</Label>
                    <Input
                      id="edit-primario"
                      type="color"
                      value={formData.primario}
                      onChange={(e) => setFormData({...formData, primario: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-secundario">Color Secundario</Label>
                    <Input
                      id="edit-secundario"
                      type="color"
                      value={formData.secundario}
                      onChange={(e) => setFormData({...formData, secundario: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-habitaciones">Cantidad de Habitaciones</Label>
                  <Input
                    id="edit-habitaciones"
                    type="number"
                    min="1"
                    value={formData.cantidad_habitaciones}
                    onChange={(e) => setFormData({...formData, cantidad_habitaciones: parseInt(e.target.value)})}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-usuario_hotel">Usuario del Hotel</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Nombre completo"
                      value={formData.usuario_nombre}
                      onChange={(e) => setFormData({...formData, usuario_nombre: e.target.value})}
                    />
                    <Input
                      placeholder="email@hotel.com"
                      type="email"
                      value={formData.usuario_email}
                      onChange={(e) => setFormData({...formData, usuario_email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Características del Hotel</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="edit-anuncios_eventos"
                        checked={formData.tiene_anuncios_eventos}
                        onChange={(e) => setFormData({...formData, tiene_anuncios_eventos: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="edit-anuncios_eventos">Tiene anuncios de eventos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="edit-pantallas_digitales"
                        checked={formData.tiene_pantallas_digitales}
                        onChange={(e) => setFormData({...formData, tiene_pantallas_digitales: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="edit-pantallas_digitales">Tiene pantallas digitales</Label>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-layout">Layout/Skin TV</Label>
                  <Select value={formData.layout_id} onValueChange={(value) => setFormData({...formData, layout_id: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern_01">Moderno Elegante</SelectItem>
                      <SelectItem value="classic_01">Clásico Tradicional</SelectItem>
                      <SelectItem value="minimal_01">Minimalista Clean</SelectItem>
                      <SelectItem value="beach_01">Tropical Beach</SelectItem>
                      <SelectItem value="business_01">Corporativo Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateHotel} className="bg-gradient-primary">
                  Actualizar Hotel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Hoteles Registrados
            </CardTitle>
            <CardDescription>
              Lista de todos los hoteles configurados en el sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Habitaciones</TableHead>
                  <TableHead>Usuario Hotel</TableHead>
                  <TableHead>Características</TableHead>
                  <TableHead>Layout TV</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell className="font-medium">{hotel.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{hotel.codigo_hotel}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">{hotel.cantidad_habitaciones}</Badge>
                    </TableCell>
                    <TableCell>
                      {hotel.usuario_hotel ? (
                        <div className="text-sm">
                          <div className="font-medium">{hotel.usuario_hotel.nombre}</div>
                          <div className="text-muted-foreground">{hotel.usuario_hotel.email}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sin asignar</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {hotel.tiene_anuncios_eventos && (
                          <Badge variant="outline" className="text-xs">Eventos</Badge>
                        )}
                        {hotel.tiene_pantallas_digitales && (
                          <Badge variant="outline" className="text-xs">Digital</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{hotel.theme?.layout_name}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditHotel(hotel)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteHotel(hotel.id)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Hotels;