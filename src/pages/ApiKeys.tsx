import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Key, RefreshCw, Copy, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKey {
  id: string;
  nombre: string;
  token_preview: string;
  token_full?: string;
  scopes: string[];
  created_at: string;
  last_rotated_at: string;
  last_used_at?: string;
  status: "active" | "revoked";
}

const ApiKeys = () => {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      nombre: "API Producción Hotel Plaza",
      token_preview: "sk_live_1234...8901",
      token_full: "sk_live_1234567890abcdef1234567890abcdef12348901",
      scopes: ["hotels:read", "hotels:write", "rooms:read", "analytics:read"],
      created_at: "2024-01-15",
      last_rotated_at: "2024-01-15",
      last_used_at: "2024-03-20",
      status: "active"
    },
    {
      id: "2",
      nombre: "API Desarrollo CMS",
      token_preview: "sk_test_abcd...5678",
      token_full: "sk_test_abcdef1234567890abcdef1234567890abcd5678",
      scopes: ["hotels:read", "media:read", "media:write"],
      created_at: "2024-02-01",
      last_rotated_at: "2024-02-01",
      last_used_at: "2024-03-19",
      status: "active"
    },
    {
      id: "3",
      nombre: "API Analytics Dashboard",
      token_preview: "sk_live_xyz9...4321",
      scopes: ["analytics:read", "users:read"],
      created_at: "2024-01-20",
      last_rotated_at: "2024-02-15",
      status: "revoked"
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    nombre: "",
    scopes: [] as string[]
  });

  const availableScopes = [
    { id: "hotels:read", label: "Leer Hoteles", description: "Acceso de lectura a información de hoteles" },
    { id: "hotels:write", label: "Escribir Hoteles", description: "Crear y modificar información de hoteles" },
    { id: "rooms:read", label: "Leer Habitaciones", description: "Acceso de lectura a habitaciones" },
    { id: "rooms:write", label: "Escribir Habitaciones", description: "Crear y modificar habitaciones" },
    { id: "media:read", label: "Leer Medios", description: "Acceso a biblioteca de medios" },
    { id: "media:write", label: "Escribir Medios", description: "Subir y gestionar archivos multimedia" },
    { id: "campaigns:read", label: "Leer Campañas", description: "Ver campañas publicitarias" },
    { id: "campaigns:write", label: "Escribir Campañas", description: "Crear y gestionar campañas" },
    { id: "analytics:read", label: "Leer Analytics", description: "Acceso a métricas y reportes" },
    { id: "users:read", label: "Leer Usuarios", description: "Ver información de usuarios" },
    { id: "users:write", label: "Escribir Usuarios", description: "Gestionar usuarios del sistema" }
  ];

  const generateToken = () => {
    const prefix = "sk_live_";
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = prefix;
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateApiKey = () => {
    const fullToken = generateToken();
    const newApiKey: ApiKey = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      token_preview: fullToken.slice(0, 8) + "..." + fullToken.slice(-4),
      token_full: fullToken,
      scopes: formData.scopes,
      created_at: new Date().toISOString().split('T')[0],
      last_rotated_at: new Date().toISOString().split('T')[0],
      status: "active"
    };

    setApiKeys([...apiKeys, newApiKey]);
    setIsCreateDialogOpen(false);
    setFormData({
      nombre: "",
      scopes: []
    });
    
    toast({
      title: "API Key creada",
      description: "La API Key ha sido generada exitosamente. Asegúrate de copiarla ahora.",
    });
  };

  const handleScopeChange = (scopeId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        scopes: [...prev.scopes, scopeId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        scopes: prev.scopes.filter(s => s !== scopeId)
      }));
    }
  };

  const handleRotateKey = (id: string) => {
    const newToken = generateToken();
    setApiKeys(apiKeys.map(key => {
      if (key.id === id) {
        return {
          ...key,
          token_preview: newToken.slice(0, 8) + "..." + newToken.slice(-4),
          token_full: newToken,
          last_rotated_at: new Date().toISOString().split('T')[0]
        };
      }
      return key;
    }));

    toast({
      title: "API Key rotada",
      description: "Se ha generado una nueva API Key. La anterior ya no es válida.",
    });
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.map(key => {
      if (key.id === id) {
        return { ...key, status: "revoked" as const };
      }
      return key;
    }));

    toast({
      title: "API Key revocada",
      description: "La API Key ha sido revocada y ya no puede usarse.",
    });
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      title: "Token copiado",
      description: "El token ha sido copiado al portapapeles.",
    });
  };

  const toggleTokenVisibility = (id: string) => {
    const newVisible = new Set(visibleTokens);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleTokens(newVisible);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">API Keys</h1>
            <p className="text-muted-foreground">Gestiona las claves de API para integraciones externas</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
                <Plus className="h-4 w-4 mr-2" />
                Nueva API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Crear Nueva API Key</DialogTitle>
                <DialogDescription>
                  Genera una nueva clave de API con los permisos específicos
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre de la API Key</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="API Producción Hotel Plaza"
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label>Permisos (Scopes)</Label>
                  <div className="grid gap-3 max-h-60 overflow-y-auto p-3 border rounded-md">
                    {availableScopes.map((scope) => (
                      <div key={scope.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={scope.id}
                          checked={formData.scopes.includes(scope.id)}
                          onCheckedChange={(checked) => handleScopeChange(scope.id, !!checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={scope.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {scope.label}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {scope.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateApiKey} 
                  className="bg-gradient-primary"
                  disabled={!formData.nombre || formData.scopes.length === 0}
                >
                  Generar API Key
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total API Keys</CardTitle>
              <Key className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{apiKeys.length}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activas</CardTitle>
              <Key className="h-4 w-4 text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">
                {apiKeys.filter(k => k.status === "active").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revocadas</CardTitle>
              <Key className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {apiKeys.filter(k => k.status === "revoked").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rotadas Este Mes</CardTitle>
              <RefreshCw className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">2</div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              API Keys del Tenant
            </CardTitle>
            <CardDescription>
              Gestiona todas las claves de API y sus permisos
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Permisos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Uso</TableHead>
                  <TableHead>Creada</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.nombre}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-mono text-sm">
                        <span>
                          {visibleTokens.has(apiKey.id) && apiKey.token_full 
                            ? apiKey.token_full 
                            : apiKey.token_preview
                          }
                        </span>
                        <div className="flex gap-1">
                          {apiKey.token_full && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTokenVisibility(apiKey.id)}
                            >
                              {visibleTokens.has(apiKey.id) ? 
                                <EyeOff className="h-3 w-3" /> : 
                                <Eye className="h-3 w-3" />
                              }
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyToken(
                              visibleTokens.has(apiKey.id) && apiKey.token_full 
                                ? apiKey.token_full 
                                : apiKey.token_preview
                            )}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {apiKey.scopes.slice(0, 2).map((scope) => (
                          <Badge key={scope} variant="secondary" className="text-xs">
                            {scope.split(':')[0]}
                          </Badge>
                        ))}
                        {apiKey.scopes.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{apiKey.scopes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={apiKey.status === "active" ? "default" : "destructive"}>
                        {apiKey.status === "active" ? "Activa" : "Revocada"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {apiKey.last_used_at || "Nunca"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {apiKey.created_at}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {apiKey.status === "active" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRotateKey(apiKey.id)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRevokeKey(apiKey.id)}
                              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            >
                              Revocar
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
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

export default ApiKeys;