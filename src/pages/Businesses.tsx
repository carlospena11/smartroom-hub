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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Building, MapPin, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Business {
  id: string;
  nombre: string;
  tipo: "restaurant" | "spa" | "shop" | "entertainment" | "service";
  ubicacion?: string;
  tenant_id: string;
  branding?: {
    logo?: string;
    colores?: {
      primario: string;
      secundario: string;
    };
  };
  created_at: string;
}

const Businesses = () => {
  const { toast } = useToast();
  const [businesses, setBusiness] = useState<Business[]>([
    {
      id: "1",
      nombre: "Tótem Lobby Principal",
      tipo: "entertainment",
      ubicacion: "Lobby Principal - Planta Baja",
      tenant_id: "1",
      branding: {
        colores: {
          primario: "#1e40af",
          secundario: "#f59e0b"
        }
      },
      created_at: "2024-01-15"
    },
    {
      id: "2",
      nombre: "Pantalla Spa Wellness",
      tipo: "spa",
      ubicacion: "Área de Spa - Segundo Piso",
      tenant_id: "1",
      branding: {
        colores: {
          primario: "#059669",
          secundario: "#dc2626"
        }
      },
      created_at: "2024-02-01"
    },
    {
      id: "3",
      nombre: "Display Restaurante Gourmet",
      tipo: "restaurant",
      ubicacion: "Restaurante Principal",
      tenant_id: "1",
      branding: {
        colores: {
          primario: "#7c3aed",
          secundario: "#f59e0b"
        }
      },
      created_at: "2024-02-15"
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "entertainment" as Business["tipo"],
    ubicacion: "",
    primario: "#1e40af",
    secundario: "#f59e0b"
  });

  const getTipoBadge = (tipo: Business["tipo"]) => {
    const tipoConfig = {
      restaurant: { label: "Restaurante", variant: "default" as const, icon: "🍽️" },
      spa: { label: "Spa", variant: "secondary" as const, icon: "🧘" },
      shop: { label: "Tienda", variant: "outline" as const, icon: "🛍️" },
      entertainment: { label: "Entretenimiento", variant: "default" as const, icon: "🎯" },
      service: { label: "Servicio", variant: "secondary" as const, icon: "🛎️" }
    };
    
    return tipoConfig[tipo];
  };

  const handleCreateBusiness = () => {
    const newBusiness: Business = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      tipo: formData.tipo,
      ubicacion: formData.ubicacion,
      tenant_id: "1",
      branding: {
        colores: {
          primario: formData.primario,
          secundario: formData.secundario
        }
      },
      created_at: new Date().toISOString().split('T')[0]
    };

    setBusiness([...businesses, newBusiness]);
    setIsCreateDialogOpen(false);
    setFormData({
      nombre: "",
      tipo: "entertainment",
      ubicacion: "",
      primario: "#1e40af",
      secundario: "#f59e0b"
    });
    
    toast({
      title: "Negocio creado",
      description: "El negocio ha sido creado exitosamente.",
    });
  };

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setFormData({
      nombre: business.nombre,
      tipo: business.tipo,
      ubicacion: business.ubicacion || "",
      primario: business.branding?.colores?.primario || "#1e40af",
      secundario: business.branding?.colores?.secundario || "#f59e0b"
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateBusiness = () => {
    if (!editingBusiness) return;

    const updatedBusiness: Business = {
      ...editingBusiness,
      nombre: formData.nombre,
      tipo: formData.tipo,
      ubicacion: formData.ubicacion,
      branding: {
        colores: {
          primario: formData.primario,
          secundario: formData.secundario
        }
      }
    };

    setBusiness(businesses.map(b => b.id === editingBusiness.id ? updatedBusiness : b));
    setIsEditDialogOpen(false);
    setEditingBusiness(null);
    setFormData({
      nombre: "",
      tipo: "entertainment",
      ubicacion: "",
      primario: "#1e40af",
      secundario: "#f59e0b"
    });
    
    toast({
      title: "Negocio actualizado",
      description: "El negocio ha sido actualizado exitosamente.",
    });
  };

  const handleDeleteBusiness = (id: string) => {
    setBusiness(businesses.filter(b => b.id !== id));
    toast({
      title: "Negocio eliminado",
      description: "El negocio ha sido eliminado exitosamente.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Negocios</h1>
            <p className="text-muted-foreground">Administra los negocios y dispositivos del hotel</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Negocio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Negocio</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo negocio o dispositivo al sistema
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre del Negocio</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Tótem Lobby Principal"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de Negocio</Label>
                  <Select value={formData.tipo} onValueChange={(value: Business["tipo"]) => setFormData({...formData, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">🍽️ Restaurante</SelectItem>
                      <SelectItem value="spa">🧘 Spa</SelectItem>
                      <SelectItem value="shop">🛍️ Tienda</SelectItem>
                      <SelectItem value="entertainment">🎯 Entretenimiento</SelectItem>
                      <SelectItem value="service">🛎️ Servicio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Textarea
                    id="ubicacion"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    placeholder="Lobby Principal - Planta Baja"
                    rows={2}
                  />
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
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateBusiness} className="bg-gradient-primary">
                  Crear Negocio
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Editar Negocio</DialogTitle>
                <DialogDescription>
                  Modifica los detalles del negocio o dispositivo
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-nombre">Nombre del Negocio</Label>
                  <Input
                    id="edit-nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Tótem Lobby Principal"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-tipo">Tipo de Negocio</Label>
                  <Select value={formData.tipo} onValueChange={(value: Business["tipo"]) => setFormData({...formData, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">🍽️ Restaurante</SelectItem>
                      <SelectItem value="spa">🧘 Spa</SelectItem>
                      <SelectItem value="shop">🛍️ Tienda</SelectItem>
                      <SelectItem value="entertainment">🎯 Entretenimiento</SelectItem>
                      <SelectItem value="service">🛎️ Servicio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-ubicacion">Ubicación</Label>
                  <Textarea
                    id="edit-ubicacion"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    placeholder="Lobby Principal - Planta Baja"
                    rows={2}
                  />
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
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateBusiness} className="bg-gradient-primary">
                  Actualizar Negocio
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Negocios</CardTitle>
              <Building className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{businesses.length}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Restaurantes</CardTitle>
              <span className="text-lg">🍽️</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">
                {businesses.filter(b => b.tipo === "restaurant").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entretenimiento</CardTitle>
              <span className="text-lg">🎯</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {businesses.filter(b => b.tipo === "entertainment").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spas</CardTitle>
              <span className="text-lg">🧘</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {businesses.filter(b => b.tipo === "spa").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Lista de Negocios
            </CardTitle>
            <CardDescription>
              Gestiona todos los negocios y dispositivos del hotel
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Negocio</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Branding</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => {
                  const tipoConfig = getTipoBadge(business.tipo);
                  
                  return (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">{business.nombre}</TableCell>
                      <TableCell>
                        <Badge variant={tipoConfig.variant} className="flex items-center gap-1 w-fit">
                          <span>{tipoConfig.icon}</span>
                          {tipoConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {business.ubicacion || "Sin especificar"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <div 
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: business.branding?.colores?.primario }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: business.branding?.colores?.secundario }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {business.created_at}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditBusiness(business)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteBusiness(business.id)}
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

export default Businesses;