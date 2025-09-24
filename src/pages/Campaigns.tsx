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
import { Plus, Edit, Trash2, Calendar, Play, Pause, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  nombre: string;
  business_id: string;
  business_name: string;
  fecha_inicio: string;
  fecha_fin: string;
  prioridad: number;
  status: "active" | "paused" | "scheduled" | "ended";
  reglas: {
    horarios?: string[];
    ubicaciones?: string[];
  };
}

const Campaigns = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      nombre: "Campaña Verano 2024",
      business_id: "1",
      business_name: "Tótem Lobby Principal",
      fecha_inicio: "2024-06-01",
      fecha_fin: "2024-08-31",
      prioridad: 5,
      status: "active",
      reglas: {
        horarios: ["09:00-22:00"],
        ubicaciones: ["lobby", "piscina"]
      }
    },
    {
      id: "2",
      nombre: "Promoción Spa Relajante",
      business_id: "2", 
      business_name: "Pantalla Spa",
      fecha_inicio: "2024-05-15",
      fecha_fin: "2024-12-15",
      prioridad: 3,
      status: "active",
      reglas: {
        horarios: ["08:00-20:00"],
        ubicaciones: ["spa"]
      }
    },
    {
      id: "3",
      nombre: "Black Friday Hotels",
      business_id: "1",
      business_name: "Tótem Lobby Principal", 
      fecha_inicio: "2024-11-20",
      fecha_fin: "2024-11-30",
      prioridad: 10,
      status: "scheduled",
      reglas: {
        horarios: ["00:00-23:59"],
        ubicaciones: ["lobby", "recepcion"]
      }
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    business_id: "1",
    fecha_inicio: "",
    fecha_fin: "",
    prioridad: 5,
    horarios: "09:00-22:00",
    ubicaciones: "lobby"
  });

  const getStatusBadge = (status: Campaign["status"]) => {
    const statusConfig = {
      active: { label: "Activa", variant: "default" as const, color: "text-tertiary" },
      paused: { label: "Pausada", variant: "secondary" as const, color: "text-warning" },
      scheduled: { label: "Programada", variant: "outline" as const, color: "text-primary" },
      ended: { label: "Finalizada", variant: "destructive" as const, color: "text-muted-foreground" }
    };
    
    return statusConfig[status];
  };

  const handleCreateCampaign = () => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      business_id: formData.business_id,
      business_name: formData.business_id === "1" ? "Tótem Lobby Principal" : "Pantalla Spa",
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin,
      prioridad: formData.prioridad,
      status: new Date(formData.fecha_inicio) > new Date() ? "scheduled" : "active",
      reglas: {
        horarios: [formData.horarios],
        ubicaciones: formData.ubicaciones.split(",").map(u => u.trim())
      }
    };

    setCampaigns([...campaigns, newCampaign]);
    setIsCreateDialogOpen(false);
    setFormData({
      nombre: "",
      business_id: "1",
      fecha_inicio: "",
      fecha_fin: "",
      prioridad: 5,
      horarios: "09:00-22:00",
      ubicaciones: "lobby"
    });
    
    toast({
      title: "Campaña creada",
      description: "La campaña publicitaria ha sido creada exitosamente.",
    });
  };

  const handleToggleCampaign = (id: string) => {
    setCampaigns(campaigns.map(campaign => {
      if (campaign.id === id) {
        const newStatus = campaign.status === "active" ? "paused" : "active";
        return { ...campaign, status: newStatus };
      }
      return campaign;
    }));

    toast({
      title: "Estado actualizado",
      description: "El estado de la campaña ha sido actualizado.",
    });
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast({
      title: "Campaña eliminada",
      description: "La campaña ha sido eliminada exitosamente.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Campañas Publicitarias</h1>
            <p className="text-muted-foreground">Gestiona las campañas publicitarias y promocionales</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Campaña
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nueva Campaña</DialogTitle>
                <DialogDescription>
                  Configura los detalles de la campaña publicitaria
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre de la Campaña</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Campaña Verano 2024"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="business">Dispositivo</Label>
                  <Select value={formData.business_id} onValueChange={(value) => setFormData({...formData, business_id: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Tótem Lobby Principal</SelectItem>
                      <SelectItem value="2">Pantalla Spa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                    <Input
                      id="fecha_inicio"
                      type="date"
                      value={formData.fecha_inicio}
                      onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="fecha_fin">Fecha Fin</Label>
                    <Input
                      id="fecha_fin"
                      type="date"
                      value={formData.fecha_fin}
                      onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="prioridad">Prioridad (1-10)</Label>
                  <Input
                    id="prioridad"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.prioridad}
                    onChange={(e) => setFormData({...formData, prioridad: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="horarios">Horarios de Exhibición</Label>
                  <Input
                    id="horarios"
                    value={formData.horarios}
                    onChange={(e) => setFormData({...formData, horarios: e.target.value})}
                    placeholder="09:00-22:00"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="ubicaciones">Ubicaciones (separadas por coma)</Label>
                  <Input
                    id="ubicaciones"
                    value={formData.ubicaciones}
                    onChange={(e) => setFormData({...formData, ubicaciones: e.target.value})}
                    placeholder="lobby, recepcion, piscina"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCampaign} className="bg-gradient-primary">
                  Crear Campaña
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campañas Activas</CardTitle>
              <Target className="h-4 w-4 text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">
                {campaigns.filter(c => c.status === "active").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programadas</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {campaigns.filter(c => c.status === "scheduled").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pausadas</CardTitle>
              <Pause className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {campaigns.filter(c => c.status === "paused").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalizadas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {campaigns.filter(c => c.status === "ended").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Todas las Campañas
            </CardTitle>
            <CardDescription>
              Gestiona y monitorea todas las campañas publicitarias
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaña</TableHead>
                  <TableHead>Dispositivo</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ubicaciones</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const statusConfig = getStatusBadge(campaign.status);
                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.nombre}</TableCell>
                      <TableCell>{campaign.business_name}</TableCell>
                      <TableCell className="text-sm">
                        <div className="space-y-1">
                          <div>Inicio: {campaign.fecha_inicio}</div>
                          <div>Fin: {campaign.fecha_fin}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">P{campaign.prioridad}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant} className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {campaign.reglas.ubicaciones?.slice(0, 2).map((ubicacion, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {ubicacion}
                            </Badge>
                          ))}
                          {campaign.reglas.ubicaciones && campaign.reglas.ubicaciones.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{campaign.reglas.ubicaciones.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleCampaign(campaign.id)}
                          >
                            {campaign.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteCampaign(campaign.id)}
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

export default Campaigns;