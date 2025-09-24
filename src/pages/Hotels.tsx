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
  branding?: {
    logo?: string;
    colores?: {
      primario: string;
      secundario: string;
    };
  };
  theme?: {
    layout: string;
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
      branding: {
        colores: {
          primario: "#1e40af",
          secundario: "#f59e0b"
        }
      },
      theme: {
        layout: "modern"
      }
    },
    {
      id: "2", 
      nombre: "Resort Marina Bay",
      codigo_hotel: "RMB002",
      timezone: "America/Cancun",
      branding: {
        colores: {
          primario: "#059669",
          secundario: "#dc2626"
        }
      },
      theme: {
        layout: "classic"
      }
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    codigo_hotel: "",
    timezone: "UTC",
    primario: "#1e40af",
    secundario: "#f59e0b",
    layout: "modern"
  });

  const handleCreateHotel = () => {
    const newHotel: Hotel = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      codigo_hotel: formData.codigo_hotel,
      timezone: formData.timezone,
      branding: {
        colores: {
          primario: formData.primario,
          secundario: formData.secundario
        }
      },
      theme: {
        layout: formData.layout
      }
    };

    setHotels([...hotels, newHotel]);
    setIsCreateDialogOpen(false);
    setFormData({
      nombre: "",
      codigo_hotel: "",
      timezone: "UTC", 
      primario: "#1e40af",
      secundario: "#f59e0b",
      layout: "modern"
    });
    
    toast({
      title: "Hotel creado",
      description: "El hotel ha sido creado exitosamente.",
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
                  <Label htmlFor="layout">Layout</Label>
                  <Select value={formData.layout} onValueChange={(value) => setFormData({...formData, layout: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Moderno</SelectItem>
                      <SelectItem value="classic">Clásico</SelectItem>
                      <SelectItem value="minimal">Minimalista</SelectItem>
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
                  <TableHead>Zona Horaria</TableHead>
                  <TableHead>Branding</TableHead>
                  <TableHead>Layout</TableHead>
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
                    <TableCell>{hotel.timezone}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: hotel.branding?.colores?.primario }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: hotel.branding?.colores?.secundario }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{hotel.theme?.layout}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
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