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
import { Plus, Edit, Trash2, Users as UsersIcon, Shield, ShieldCheck, Eye, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  nombre: string;
  email: string;
  tenant_role: "tenant_admin" | "hotel_admin" | "editor" | "viewer" | "ops";
  mfa_enabled: boolean;
  created_at: string;
  last_login?: string;
  status: "active" | "inactive" | "pending";
}

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
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
      nombre: "María González",
      email: "maria.gonzalez@hotel-plaza.com",
      tenant_role: "hotel_admin",
      mfa_enabled: false,
      created_at: "2024-02-01",
      last_login: "2024-03-19",
      status: "active"
    },
    {
      id: "3",
      nombre: "Carlos Ruiz",
      email: "carlos.ruiz@resort-marina.com",
      tenant_role: "editor",
      mfa_enabled: true,
      created_at: "2024-02-15",
      last_login: "2024-03-18",
      status: "active"
    },
    {
      id: "4",
      nombre: "Ana Torres",
      email: "ana.torres@smartroom.com",
      tenant_role: "viewer",
      mfa_enabled: false,
      created_at: "2024-03-01",
      status: "pending"
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    tenant_role: "viewer" as User["tenant_role"],
    mfa_enabled: false
  });

  const getRoleBadge = (role: User["tenant_role"]) => {
    const roleConfig = {
      tenant_admin: { label: "Admin Tenant", variant: "default" as const, icon: Shield },
      hotel_admin: { label: "Admin Hotel", variant: "secondary" as const, icon: ShieldCheck },
      editor: { label: "Editor", variant: "outline" as const, icon: UserCog },
      viewer: { label: "Visualizador", variant: "secondary" as const, icon: Eye },
      ops: { label: "Operaciones", variant: "outline" as const, icon: UserCog }
    };
    
    return roleConfig[role];
  };

  const getStatusBadge = (status: User["status"]) => {
    const statusConfig = {
      active: { label: "Activo", variant: "default" as const, color: "text-tertiary" },
      inactive: { label: "Inactivo", variant: "secondary" as const, color: "text-muted-foreground" },
      pending: { label: "Pendiente", variant: "outline" as const, color: "text-warning" }
    };
    
    return statusConfig[status];
  };

  const handleCreateUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      email: formData.email,
      tenant_role: formData.tenant_role,
      mfa_enabled: formData.mfa_enabled,
      created_at: new Date().toISOString().split('T')[0],
      status: "pending"
    };

    setUsers([...users, newUser]);
    setIsCreateDialogOpen(false);
    setFormData({
      nombre: "",
      email: "",
      tenant_role: "viewer",
      mfa_enabled: false
    });
    
    toast({
      title: "Usuario creado",
      description: "El usuario ha sido creado y recibirá un email de activación.",
    });
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        const newStatus = user.status === "active" ? "inactive" : "active";
        return { ...user, status: newStatus };
      }
      return user;
    }));

    toast({
      title: "Estado actualizado",
      description: "El estado del usuario ha sido actualizado.",
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      tenant_role: user.tenant_role,
      mfa_enabled: user.mfa_enabled
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    const updatedUser: User = {
      ...editingUser,
      nombre: formData.nombre,
      email: formData.email,
      tenant_role: formData.tenant_role,
      mfa_enabled: formData.mfa_enabled
    };

    setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
    setIsEditDialogOpen(false);
    setEditingUser(null);
    setFormData({
      nombre: "",
      email: "",
      tenant_role: "viewer",
      mfa_enabled: false
    });
    
    toast({
      title: "Usuario actualizado",
      description: "El usuario ha sido actualizado exitosamente.",
    });
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado del sistema.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administra los usuarios y sus permisos en el sistema</p>
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
                
                <div className="grid gap-2">
                  <Label htmlFor="role">Rol del Usuario</Label>
                  <Select value={formData.tenant_role} onValueChange={(value: User["tenant_role"]) => setFormData({...formData, tenant_role: value})}>
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

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogDescription>
                  Modifica los detalles del usuario y sus permisos
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
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Rol del Usuario</Label>
                  <Select value={formData.tenant_role} onValueChange={(value: User["tenant_role"]) => setFormData({...formData, tenant_role: value})}>
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
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <UsersIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <Shield className="h-4 w-4 text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">
                {users.filter(u => u.status === "active").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <UserCog className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {users.filter(u => u.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Con MFA</CardTitle>
              <ShieldCheck className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {users.filter(u => u.mfa_enabled).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-primary" />
              Lista de Usuarios
            </CardTitle>
            <CardDescription>
              Gestiona todos los usuarios del sistema y sus permisos
            </CardDescription>
          </CardHeader>
          
          <CardContent>
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
                {users.map((user) => {
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.status === "active" ? "Desactivar" : "Activar"}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
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

export default Users;