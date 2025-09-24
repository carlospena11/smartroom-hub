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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Users as UsersIcon, Shield, ShieldCheck, Eye, UserCog, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlatformUser {
  id: string;
  nombre: string;
  email: string;
  tenant_role: "tenant_admin" | "hotel_admin" | "editor" | "viewer" | "ops";
  mfa_enabled: boolean;
  created_at: string;
  last_login?: string;
  status: "active" | "inactive" | "pending";
}

interface ClientUser {
  id: string;
  nombre: string;
  email: string;
  hotel_id: string;
  hotel_name: string;
  permisos: string[];
  cargo: "gerente_hotel" | "recepcionista" | "marketing" | "mantenimiento";
  created_at: string;
  last_login?: string;
  status: "active" | "inactive" | "pending";
}

const Users = () => {
  const { toast } = useToast();
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>([
    {
      id: "1",
      nombre: "Juan Pérez",
      email: "juan.perez@smartroom.com",
      tenant_role: "tenant_admin",
      mfa_enabled: true,
      created_at: "2024-01-15",
      last_login: "2024-03-20",
      status: "active"
    },
    {
      id: "2",
      nombre: "Ana Torres",
      email: "ana.torres@smartroom.com",
      tenant_role: "ops",
      mfa_enabled: false,
      created_at: "2024-03-01",
      status: "pending"
    }
  ]);

  const [clientUsers, setClientUsers] = useState<ClientUser[]>([
    {
      id: "1",
      nombre: "María González",
      email: "maria.gonzalez@hotelplaza.com",
      hotel_id: "1",
      hotel_name: "Hotel Plaza Central",
      permisos: ["modificar_imagenes", "editar_textos", "gestionar_anuncios"],
      cargo: "gerente_hotel",
      created_at: "2024-02-01",
      last_login: "2024-03-19",
      status: "active"
    },
    {
      id: "2",
      nombre: "Carlos Ruiz",
      email: "carlos.ruiz@marinabaybay.com",
      hotel_id: "2",
      hotel_name: "Resort Marina Bay",
      permisos: ["modificar_imagenes", "editar_textos"],
      cargo: "marketing",
      created_at: "2024-02-15",
      last_login: "2024-03-18",
      status: "active"
    },
    {
      id: "3",
      nombre: "Laura Sánchez",
      email: "laura.sanchez@hotelplaza.com",
      hotel_id: "1",
      hotel_name: "Hotel Plaza Central",
      permisos: ["modificar_imagenes"],
      cargo: "recepcionista",
      created_at: "2024-03-05",
      status: "pending"
    }
  ]);

  const [activeTab, setActiveTab] = useState("platform");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PlatformUser | ClientUser | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    tipo: "platform" as "platform" | "client",
    tenant_role: "viewer" as PlatformUser["tenant_role"],
    hotel_id: "1",
    cargo: "recepcionista" as ClientUser["cargo"],
    permisos: [] as string[],
    mfa_enabled: false
  });

  const getRoleBadge = (role: PlatformUser["tenant_role"]) => {
    const roleConfig = {
      tenant_admin: { label: "Admin Tenant", variant: "default" as const, icon: Shield },
      hotel_admin: { label: "Admin Hotel", variant: "secondary" as const, icon: ShieldCheck },
      editor: { label: "Editor", variant: "outline" as const, icon: UserCog },
      viewer: { label: "Visualizador", variant: "secondary" as const, icon: Eye },
      ops: { label: "Operaciones", variant: "outline" as const, icon: UserCog }
    };
    
    return roleConfig[role];
  };

  const getCargoBadge = (cargo: ClientUser["cargo"]) => {
    const cargoConfig = {
      gerente_hotel: { label: "Gerente Hotel", variant: "default" as const },
      recepcionista: { label: "Recepcionista", variant: "secondary" as const },
      marketing: { label: "Marketing", variant: "outline" as const },
      mantenimiento: { label: "Mantenimiento", variant: "secondary" as const }
    };
    
    return cargoConfig[cargo];
  };

  const getStatusBadge = (status: "active" | "inactive" | "pending") => {
    const statusConfig = {
      active: { label: "Activo", variant: "default" as const, color: "text-tertiary" },
      inactive: { label: "Inactivo", variant: "secondary" as const, color: "text-muted-foreground" },
      pending: { label: "Pendiente", variant: "outline" as const, color: "text-warning" }
    };
    
    return statusConfig[status];
  };

  const availablePermisos = [
    "modificar_imagenes",
    "editar_textos",
    "gestionar_anuncios",
    "ver_reportes",
    "gestionar_eventos",
    "configurar_pantallas"
  ];

  const handleCreateUser = () => {
    if (formData.tipo === "platform") {
      const newUser: PlatformUser = {
        id: Date.now().toString(),
        nombre: formData.nombre,
        email: formData.email,
        tenant_role: formData.tenant_role,
        mfa_enabled: formData.mfa_enabled,
        created_at: new Date().toISOString().split('T')[0],
        status: "pending"
      };
      setPlatformUsers([...platformUsers, newUser]);
    } else {
      const newUser: ClientUser = {
        id: Date.now().toString(),
        nombre: formData.nombre,
        email: formData.email,
        hotel_id: formData.hotel_id,
        hotel_name: formData.hotel_id === "1" ? "Hotel Plaza Central" : "Resort Marina Bay",
        permisos: formData.permisos,
        cargo: formData.cargo,
        created_at: new Date().toISOString().split('T')[0],
        status: "pending"
      };
      setClientUsers([...clientUsers, newUser]);
    }

    setIsCreateDialogOpen(false);
    setFormData({
      nombre: "",
      email: "",
      tipo: "platform",
      tenant_role: "viewer",
      hotel_id: "1",
      cargo: "recepcionista",
      permisos: [],
      mfa_enabled: false
    });
    
    toast({
      title: "Usuario creado",
      description: "El usuario ha sido creado y recibirá un email de activación.",
    });
  };

  const handleTogglePermiso = (permiso: string) => {
    const newPermisos = formData.permisos.includes(permiso)
      ? formData.permisos.filter(p => p !== permiso)
      : [...formData.permisos, permiso];
    setFormData({...formData, permisos: newPermisos});
  };

  const handleEditUser = (user: PlatformUser | ClientUser, type: "platform" | "client") => {
    setEditingUser(user);
    if (type === "platform") {
      const platformUser = user as PlatformUser;
      setFormData({
        ...formData,
        nombre: platformUser.nombre,
        email: platformUser.email,
        tipo: "platform",
        tenant_role: platformUser.tenant_role,
        mfa_enabled: platformUser.mfa_enabled
      });
    } else {
      const clientUser = user as ClientUser;
      setFormData({
        ...formData,
        nombre: clientUser.nombre,
        email: clientUser.email,
        tipo: "client",
        hotel_id: clientUser.hotel_id,
        cargo: clientUser.cargo,
        permisos: clientUser.permisos
      });
    }
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    if (formData.tipo === "platform") {
      const updatedUser: PlatformUser = {
        ...editingUser as PlatformUser,
        nombre: formData.nombre,
        email: formData.email,
        tenant_role: formData.tenant_role,
        mfa_enabled: formData.mfa_enabled
      };
      setPlatformUsers(platformUsers.map(u => u.id === editingUser.id ? updatedUser : u));
    } else {
      const updatedUser: ClientUser = {
        ...editingUser as ClientUser,
        nombre: formData.nombre,
        email: formData.email,
        hotel_id: formData.hotel_id,
        hotel_name: formData.hotel_id === "1" ? "Hotel Plaza Central" : "Resort Marina Bay",
        cargo: formData.cargo,
        permisos: formData.permisos
      };
      setClientUsers(clientUsers.map(u => u.id === editingUser.id ? updatedUser : u));
    }

    setIsEditDialogOpen(false);
    setEditingUser(null);
    setFormData({
      nombre: "",
      email: "",
      tipo: "platform",
      tenant_role: "viewer",
      hotel_id: "1",
      cargo: "recepcionista",
      permisos: [],
      mfa_enabled: false
    });
    
    toast({
      title: "Usuario actualizado",
      description: "El usuario ha sido actualizado exitosamente.",
    });
  };

  const handleDeleteUser = (id: string, type: "platform" | "client") => {
    if (type === "platform") {
      setPlatformUsers(platformUsers.filter(u => u.id !== id));
    } else {
      setClientUsers(clientUsers.filter(u => u.id !== id));
    }
    
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado exitosamente.",
    });
  };

  const handleToggleUserStatus = (id: string, type: "platform" | "client") => {
    if (type === "platform") {
      setPlatformUsers(platformUsers.map(user => 
        user.id === id 
          ? { ...user, status: user.status === "active" ? "inactive" : "active" } 
          : user
      ));
    } else {
      setClientUsers(clientUsers.map(user => 
        user.id === id 
          ? { ...user, status: user.status === "active" ? "inactive" : "active" } 
          : user
      ));
    }
    
    toast({
      title: "Estado actualizado",
      description: "El estado del usuario ha sido actualizado.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administra usuarios de plataforma y usuarios de clientes</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo usuario al sistema y configura sus permisos
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de Usuario</Label>
                  <Select value={formData.tipo} onValueChange={(value: "platform" | "client") => setFormData({...formData, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platform">Usuario de Plataforma</SelectItem>
                      <SelectItem value="client">Usuario Cliente (Hotel)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Juan Pérez"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="juan.perez@ejemplo.com"
                  />
                </div>

                {formData.tipo === "platform" ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Rol del Usuario</Label>
                      <Select value={formData.tenant_role} onValueChange={(value: PlatformUser["tenant_role"]) => setFormData({...formData, tenant_role: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tenant_admin">Administrador Tenant</SelectItem>
                          <SelectItem value="hotel_admin">Administrador Hotel</SelectItem>
                          <SelectItem value="editor">Editor de Contenido</SelectItem>
                          <SelectItem value="viewer">Visualizador</SelectItem>
                          <SelectItem value="ops">Operaciones</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="mfa"
                        checked={formData.mfa_enabled}
                        onCheckedChange={(checked) => setFormData({...formData, mfa_enabled: checked})}
                      />
                      <Label htmlFor="mfa">Habilitar Autenticación de Dos Factores</Label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="hotel">Hotel Asignado</Label>
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
                      <Label htmlFor="cargo">Cargo</Label>
                      <Select value={formData.cargo} onValueChange={(value: ClientUser["cargo"]) => setFormData({...formData, cargo: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gerente_hotel">Gerente de Hotel</SelectItem>
                          <SelectItem value="recepcionista">Recepcionista</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Permisos</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {availablePermisos.map((permiso) => (
                          <div key={permiso} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={permiso}
                              checked={formData.permisos.includes(permiso)}
                              onChange={() => handleTogglePermiso(permiso)}
                              className="rounded"
                            />
                            <Label htmlFor={permiso} className="text-sm">
                              {permiso.replace('_', ' ')}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateUser} className="bg-gradient-primary">
                  Crear Usuario
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogDescription>
                  Modifica los datos del usuario
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-nombre">Nombre Completo</Label>
                  <Input
                    id="edit-nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Juan Pérez"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="juan.perez@ejemplo.com"
                  />
                </div>

                {formData.tipo === "platform" ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-role">Rol del Usuario</Label>
                      <Select value={formData.tenant_role} onValueChange={(value: PlatformUser["tenant_role"]) => setFormData({...formData, tenant_role: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tenant_admin">Administrador Tenant</SelectItem>
                          <SelectItem value="hotel_admin">Administrador Hotel</SelectItem>
                          <SelectItem value="editor">Editor de Contenido</SelectItem>
                          <SelectItem value="viewer">Visualizador</SelectItem>
                          <SelectItem value="ops">Operaciones</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-mfa"
                        checked={formData.mfa_enabled}
                        onCheckedChange={(checked) => setFormData({...formData, mfa_enabled: checked})}
                      />
                      <Label htmlFor="edit-mfa">Habilitar Autenticación de Dos Factores</Label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-hotel">Hotel Asignado</Label>
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
                      <Label htmlFor="edit-cargo">Cargo</Label>
                      <Select value={formData.cargo} onValueChange={(value: ClientUser["cargo"]) => setFormData({...formData, cargo: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gerente_hotel">Gerente de Hotel</SelectItem>
                          <SelectItem value="recepcionista">Recepcionista</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Permisos</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {availablePermisos.map((permiso) => (
                          <div key={permiso} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`edit-${permiso}`}
                              checked={formData.permisos.includes(permiso)}
                              onChange={() => handleTogglePermiso(permiso)}
                              className="rounded"
                            />
                            <Label htmlFor={`edit-${permiso}`} className="text-sm">
                              {permiso.replace('_', ' ')}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateUser} className="bg-gradient-primary">
                  Actualizar Usuario
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Plataforma</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{platformUsers.length}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Cliente</CardTitle>
              <User className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{clientUsers.length}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <Shield className="h-4 w-4 text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">
                {[...platformUsers, ...clientUsers].filter(u => u.status === "active").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Con MFA</CardTitle>
              <ShieldCheck className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {platformUsers.filter(u => u.mfa_enabled).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-primary" />
              Gestión de Usuarios
            </CardTitle>
            <CardDescription>
              Administra usuarios de plataforma y usuarios de clientes
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="platform">Usuarios de Plataforma</TabsTrigger>
                <TabsTrigger value="client">Usuarios Cliente</TabsTrigger>
              </TabsList>
              
              <TabsContent value="platform">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>MFA</TableHead>
                      <TableHead>Último Acceso</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {platformUsers.map((user) => {
                      const roleConfig = getRoleBadge(user.tenant_role);
                      const statusConfig = getStatusBadge(user.status);
                      const RoleIcon = roleConfig.icon;
                      
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.nombre}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={roleConfig.variant} className="flex items-center gap-1 w-fit">
                              <RoleIcon className="h-3 w-3" />
                              {roleConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant} className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.mfa_enabled ? (
                              <Badge variant="default" className="text-tertiary">
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                Habilitado
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                Deshabilitado
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {user.last_login || "Nunca"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
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
              </TabsContent>
              
              <TabsContent value="client">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Permisos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Último Acceso</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientUsers.map((user) => {
                      const cargoConfig = getCargoBadge(user.cargo);
                      const statusConfig = getStatusBadge(user.status);
                      
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.nombre}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.hotel_name}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={cargoConfig.variant}>
                              {cargoConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {user.permisos.slice(0, 2).map((permiso, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {permiso.replace('_', ' ')}
                                </Badge>
                              ))}
                              {user.permisos.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.permisos.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant} className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {user.last_login || "Nunca"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Users;