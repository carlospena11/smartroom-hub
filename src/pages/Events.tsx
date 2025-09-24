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
import { Plus, Edit, Trash2, CalendarDays, MapPin, Settings, Globe, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventSource {
  id: string;
  business_id: string;
  business_name: string;
  tipo: "ics" | "gcal" | "csv";
  config: {
    url?: string;
    credenciales?: Record<string, any>;
    mapeo_campos?: Record<string, string>;
  };
  activo: boolean;
  last_sync?: string;
  event_count?: number;
  sync_status: "success" | "error" | "pending" | "never";
}

const Events = () => {
  const { toast } = useToast();
  const [eventSources, setEventSources] = useState<EventSource[]>([
    {
      id: "1",
      business_id: "1",
      business_name: "Pantalla Eventos Lobby",
      tipo: "gcal",
      config: {
        url: "https://calendar.google.com/calendar/ical/...",
        credenciales: { calendar_id: "hotel-eventos@gmail.com" }
      },
      activo: true,
      last_sync: "2024-03-20 14:30",
      event_count: 25,
      sync_status: "success"
    },
    {
      id: "2",
      business_id: "2",
      business_name: "Pantalla Centro de Convenciones",
      tipo: "ics",
      config: {
        url: "https://convenciones-hotel.com/events.ics",
        mapeo_campos: { title: "SUMMARY", location: "LOCATION", date: "DTSTART" }
      },
      activo: true,
      last_sync: "2024-03-20 12:15",
      event_count: 8,
      sync_status: "success"
    },
    {
      id: "3",
      business_id: "3",
      business_name: "Sistema Eventos Restaurante",
      tipo: "csv",
      config: {
        url: "https://api.restaurant-system.com/events.csv",
        mapeo_campos: { title: "event_name", location: "venue", date: "event_date" }
      },
      activo: false,
      last_sync: "2024-03-19 18:45",
      event_count: 0,
      sync_status: "error"
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    business_id: "1",
    tipo: "gcal" as EventSource["tipo"],
    url: "",
    calendar_id: "",
    title_field: "SUMMARY",
    location_field: "LOCATION",
    date_field: "DTSTART"
  });

  const getTypeBadge = (tipo: EventSource["tipo"]) => {
    const typeConfig = {
      gcal: { label: "Google Calendar", variant: "default" as const, icon: Calendar },
      ics: { label: "Archivo ICS", variant: "secondary" as const, icon: CalendarDays },
      csv: { label: "Archivo CSV", variant: "outline" as const, icon: CalendarDays }
    };
    
    return typeConfig[tipo];
  };

  const getStatusBadge = (status: EventSource["sync_status"]) => {
    const statusConfig = {
      success: { label: "Sincronizado", variant: "default" as const, color: "text-tertiary" },
      error: { label: "Error", variant: "destructive" as const, color: "text-destructive" },
      pending: { label: "Sincronizando", variant: "secondary" as const, color: "text-warning" },
      never: { label: "Nunca", variant: "outline" as const, color: "text-muted-foreground" }
    };
    
    return statusConfig[status];
  };

  const handleCreateEventSource = () => {
    const config: EventSource["config"] = {
      url: formData.url
    };

    if (formData.tipo === "gcal") {
      config.credenciales = { calendar_id: formData.calendar_id };
    } else {
      config.mapeo_campos = {
        title: formData.title_field,
        location: formData.location_field,
        date: formData.date_field
      };
    }

    const newEventSource: EventSource = {
      id: Date.now().toString(),
      business_id: formData.business_id,
      business_name: formData.business_id === "1" ? "Pantalla Eventos Lobby" : 
                     formData.business_id === "2" ? "Pantalla Centro de Convenciones" : 
                     "Sistema Eventos Restaurante",
      tipo: formData.tipo,
      config,
      activo: true,
      sync_status: "never"
    };

    setEventSources([...eventSources, newEventSource]);
    setIsCreateDialogOpen(false);
    setFormData({
      business_id: "1",
      tipo: "gcal",
      url: "",
      calendar_id: "",
      title_field: "SUMMARY",
      location_field: "LOCATION",
      date_field: "DTSTART"
    });
    
    toast({
      title: "Fuente de eventos creada",
      description: "La fuente de eventos ha sido configurada exitosamente.",
    });
  };

  const handleDeleteEventSource = (id: string) => {
    setEventSources(eventSources.filter(es => es.id !== id));
    toast({
      title: "Fuente eliminada",
      description: "La fuente de eventos ha sido eliminada exitosamente.",
    });
  };

  const handleToggleStatus = (id: string) => {
    setEventSources(eventSources.map(source => {
      if (source.id === id) {
        return { ...source, activo: !source.activo };
      }
      return source;
    }));

    toast({
      title: "Estado actualizado",
      description: "El estado de la fuente de eventos ha sido actualizado.",
    });
  };

  const handleSyncSource = (id: string) => {
    setEventSources(eventSources.map(source => {
      if (source.id === id) {
        return { 
          ...source, 
          sync_status: "pending" as const,
          last_sync: new Date().toISOString().slice(0, 16).replace('T', ' ')
        };
      }
      return source;
    }));

    // Simular sincronización exitosa después de 2 segundos
    setTimeout(() => {
      setEventSources(prev => prev.map(source => {
        if (source.id === id) {
          return { 
            ...source, 
            sync_status: "success" as const,
            event_count: Math.floor(Math.random() * 30) + 5
          };
        }
        return source;
      }));
    }, 2000);

    toast({
      title: "Sincronización iniciada",
      description: "La sincronización de eventos ha comenzado.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fuentes de Eventos</h1>
            <p className="text-muted-foreground">Configura las fuentes externas de eventos y calendario</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Fuente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nueva Fuente de Eventos</DialogTitle>
                <DialogDescription>
                  Configura una nueva fuente externa para importar eventos
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="business">Dispositivo de Visualización</Label>
                  <Select value={formData.business_id} onValueChange={(value) => setFormData({...formData, business_id: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Pantalla Eventos Lobby</SelectItem>
                      <SelectItem value="2">Pantalla Centro de Convenciones</SelectItem>
                      <SelectItem value="3">Sistema Eventos Restaurante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de Fuente</Label>
                  <Select value={formData.tipo} onValueChange={(value: EventSource["tipo"]) => setFormData({...formData, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gcal">Google Calendar</SelectItem>
                      <SelectItem value="ics">Archivo ICS</SelectItem>
                      <SelectItem value="csv">Archivo CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="url">URL de la Fuente</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    placeholder={
                      formData.tipo === "gcal" ? "https://calendar.google.com/calendar/ical/..." :
                      formData.tipo === "ics" ? "https://ejemplo.com/eventos.ics" :
                      "https://api.ejemplo.com/eventos.csv"
                    }
                  />
                </div>
                
                {formData.tipo === "gcal" ? (
                  <div className="grid gap-2">
                    <Label htmlFor="calendar_id">ID del Calendar</Label>
                    <Input
                      id="calendar_id"
                      value={formData.calendar_id}
                      onChange={(e) => setFormData({...formData, calendar_id: e.target.value})}
                      placeholder="eventos@hotel.com"
                    />
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label>Mapeo de Campos</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="title_field">Campo Título</Label>
                        <Input
                          id="title_field"
                          value={formData.title_field}
                          onChange={(e) => setFormData({...formData, title_field: e.target.value})}
                          placeholder="SUMMARY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location_field">Campo Ubicación</Label>
                        <Input
                          id="location_field"
                          value={formData.location_field}
                          onChange={(e) => setFormData({...formData, location_field: e.target.value})}
                          placeholder="LOCATION"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="date_field">Campo Fecha</Label>
                      <Input
                        id="date_field"
                        value={formData.date_field}
                        onChange={(e) => setFormData({...formData, date_field: e.target.value})}
                        placeholder="DTSTART"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateEventSource} className="bg-gradient-primary">
                  Crear Fuente
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fuentes</CardTitle>
              <Globe className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{eventSources.length}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activas</CardTitle>
              <CalendarDays className="h-4 w-4 text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">
                {eventSources.filter(es => es.activo).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos Totales</CardTitle>
              <Calendar className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {eventSources.reduce((sum, es) => sum + (es.event_count || 0), 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Con Errores</CardTitle>
              <Settings className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {eventSources.filter(es => es.sync_status === "error").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Fuentes de Eventos Configuradas
            </CardTitle>
            <CardDescription>
              Gestiona las fuentes externas de eventos y calendarios
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dispositivo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Sincronización</TableHead>
                  <TableHead>Eventos</TableHead>
                  <TableHead>Última Sync</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventSources.map((eventSource) => {
                  const typeConfig = getTypeBadge(eventSource.tipo);
                  const statusConfig = getStatusBadge(eventSource.sync_status);
                  const TypeIcon = typeConfig.icon;
                  
                  return (
                    <TableRow key={eventSource.id}>
                      <TableCell className="font-medium">{eventSource.business_name}</TableCell>
                      <TableCell>
                        <Badge variant={typeConfig.variant} className="flex items-center gap-1 w-fit">
                          <TypeIcon className="h-3 w-3" />
                          {typeConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm font-mono" title={eventSource.config.url}>
                          {eventSource.config.url}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={eventSource.activo ? "default" : "secondary"}>
                          {eventSource.activo ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant} className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {eventSource.event_count || 0} eventos
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {eventSource.last_sync || "Nunca"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSyncSource(eventSource.id)}
                            disabled={eventSource.sync_status === "pending"}
                          >
                            Sincronizar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleStatus(eventSource.id)}
                          >
                            {eventSource.activo ? "Desactivar" : "Activar"}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteEventSource(eventSource.id)}
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

export default Events;