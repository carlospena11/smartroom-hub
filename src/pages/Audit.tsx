import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Activity, User, Edit, Trash2, Plus, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  accion: string;
  entidad: string;
  entidad_id: string;
  diff: {
    antes?: Record<string, any>;
    despues?: Record<string, any>;
  };
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

const Audit = () => {
  const { toast } = useToast();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "1",
      actor_id: "user-1",
      actor_name: "Juan Pérez",
      accion: "CREATE",
      entidad: "hotel",
      entidad_id: "hotel-123",
      diff: {
        despues: { nombre: "Hotel Plaza Central", codigo_hotel: "HPC001" }
      },
      created_at: "2024-03-20 14:30:15",
      ip_address: "192.168.1.100",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    },
    {
      id: "2",
      actor_id: "user-2",
      actor_name: "María González",
      accion: "UPDATE",
      entidad: "room",
      entidad_id: "room-456",
      diff: {
        antes: { estado: "libre" },
        despues: { estado: "ocupada" }
      },
      created_at: "2024-03-20 13:45:22",
      ip_address: "192.168.1.101",
      user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
    },
    {
      id: "3",
      actor_id: "user-1",
      actor_name: "Juan Pérez",
      accion: "DELETE",
      entidad: "user",
      entidad_id: "user-789",
      diff: {
        antes: { nombre: "Carlos Ruiz", email: "carlos@example.com", rol: "editor" }
      },
      created_at: "2024-03-20 12:15:33",
      ip_address: "192.168.1.100",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    },
    {
      id: "4",
      actor_id: "user-3",
      actor_name: "Ana Torres",
      accion: "CREATE",
      entidad: "campaign",
      entidad_id: "campaign-321",
      diff: {
        despues: { nombre: "Campaña Verano 2024", fecha_inicio: "2024-06-01" }
      },
      created_at: "2024-03-20 11:30:45",
      ip_address: "192.168.1.102",
      user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"
    },
    {
      id: "5",
      actor_id: "user-2",
      actor_name: "María González",
      accion: "UPDATE",
      entidad: "device",
      entidad_id: "device-654",
      diff: {
        antes: { status: "offline" },
        despues: { status: "online" }
      },
      created_at: "2024-03-20 10:22:18",
      ip_address: "192.168.1.101",
      user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterEntity, setFilterEntity] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const getActionBadge = (accion: string) => {
    const actionConfig = {
      CREATE: { label: "Crear", variant: "default" as const, color: "text-tertiary" },
      UPDATE: { label: "Actualizar", variant: "secondary" as const, color: "text-secondary" },
      DELETE: { label: "Eliminar", variant: "destructive" as const, color: "text-destructive" },
      LOGIN: { label: "Inicio Sesión", variant: "outline" as const, color: "text-primary" },
      LOGOUT: { label: "Cerrar Sesión", variant: "outline" as const, color: "text-muted-foreground" }
    };
    
    return actionConfig[accion] || { label: accion, variant: "outline" as const, color: "text-foreground" };
  };

  const getEntityBadge = (entidad: string) => {
    const entityConfig = {
      hotel: { label: "Hotel", icon: "🏨" },
      room: { label: "Habitación", icon: "🛏️" },
      user: { label: "Usuario", icon: "👤" },
      campaign: { label: "Campaña", icon: "📢" },
      device: { label: "Dispositivo", icon: "📺" },
      media: { label: "Media", icon: "🖼️" },
      api_key: { label: "API Key", icon: "🔑" }
    };
    
    return entityConfig[entidad] || { label: entidad, icon: "📄" };
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entidad_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = filterAction === "all" || log.accion === filterAction;
    const matchesEntity = filterEntity === "all" || log.entidad === filterEntity;
    
    return matchesSearch && matchesAction && matchesEntity;
  });

  const formatDiff = (diff: AuditLog["diff"]) => {
    if (!diff.antes && !diff.despues) return "Sin cambios";
    
    if (diff.antes && diff.despues) {
      const changes = Object.keys(diff.despues).map(key => {
        const before = diff.antes?.[key];
        const after = diff.despues?.[key];
        if (before !== after) {
          return `${key}: ${before} → ${after}`;
        }
        return null;
      }).filter(Boolean);
      
      return changes.join(", ") || "Sin cambios detectables";
    }
    
    if (diff.despues) {
      return `Creado: ${Object.entries(diff.despues).map(([k, v]) => `${k}: ${v}`).join(", ")}`;
    }
    
    if (diff.antes) {
      return `Eliminado: ${Object.entries(diff.antes).map(([k, v]) => `${k}: ${v}`).join(", ")}`;
    }
    
    return "Sin detalles";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Auditoría del Sistema</h1>
            <p className="text-muted-foreground">Registro completo de todas las actividades del sistema</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{auditLogs.length}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Creaciones</CardTitle>
              <Plus className="h-4 w-4 text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">
                {auditLogs.filter(log => log.accion === "CREATE").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modificaciones</CardTitle>
              <Edit className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {auditLogs.filter(log => log.accion === "UPDATE").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eliminaciones</CardTitle>
              <Trash2 className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {auditLogs.filter(log => log.accion === "DELETE").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Registro de Auditoría
            </CardTitle>
            <CardDescription>
              Historial completo de actividades y cambios en el sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por usuario, acción, entidad o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Acciones</SelectItem>
                  <SelectItem value="CREATE">Crear</SelectItem>
                  <SelectItem value="UPDATE">Actualizar</SelectItem>
                  <SelectItem value="DELETE">Eliminar</SelectItem>
                  <SelectItem value="LOGIN">Inicio Sesión</SelectItem>
                  <SelectItem value="LOGOUT">Cerrar Sesión</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterEntity} onValueChange={setFilterEntity}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Entidades</SelectItem>
                  <SelectItem value="hotel">Hoteles</SelectItem>
                  <SelectItem value="room">Habitaciones</SelectItem>
                  <SelectItem value="user">Usuarios</SelectItem>
                  <SelectItem value="campaign">Campañas</SelectItem>
                  <SelectItem value="device">Dispositivos</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="api_key">API Keys</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Entidad</TableHead>
                  <TableHead>ID Entidad</TableHead>
                  <TableHead>Cambios</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead className="text-right">Ver</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const actionConfig = getActionBadge(log.accion);
                  const entityConfig = getEntityBadge(log.entidad);
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm font-mono">
                        {log.created_at}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{log.actor_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={actionConfig.variant} className={actionConfig.color}>
                          {actionConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{entityConfig.icon}</span>
                          <Badge variant="outline">
                            {entityConfig.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {log.entidad_id}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm" title={formatDiff(log.diff)}>
                          {formatDiff(log.diff)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">
                        {log.ip_address}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No se encontraron eventos</p>
                <p className="text-sm text-muted-foreground">
                  Intenta con otros filtros de búsqueda
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal para ver detalles del log (simplificado) */}
        {selectedLog && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-elegant">
              <CardHeader>
                <CardTitle>Detalles del Evento de Auditoría</CardTitle>
                <CardDescription>
                  Información completa del evento seleccionado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Usuario</Label>
                    <p className="text-sm text-muted-foreground">{selectedLog.actor_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Fecha/Hora</Label>
                    <p className="text-sm text-muted-foreground font-mono">{selectedLog.created_at}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Acción</Label>
                    <p className="text-sm text-muted-foreground">{selectedLog.accion}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Entidad</Label>
                    <p className="text-sm text-muted-foreground">{selectedLog.entidad}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">IP Address</Label>
                    <p className="text-sm text-muted-foreground font-mono">{selectedLog.ip_address}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">ID Entidad</Label>
                    <p className="text-sm text-muted-foreground font-mono">{selectedLog.entidad_id}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">User Agent</Label>
                  <p className="text-sm text-muted-foreground break-all">{selectedLog.user_agent}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Cambios Realizados</Label>
                  <pre className="text-sm bg-muted p-3 rounded-md overflow-auto">
                    {JSON.stringify(selectedLog.diff, null, 2)}
                  </pre>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => setSelectedLog(null)}>
                    Cerrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

export default Audit;