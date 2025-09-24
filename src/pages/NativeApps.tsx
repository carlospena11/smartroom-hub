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
import { Plus, Edit, Trash2, Smartphone, Download, Upload, Package, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface LayoutSkin {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: "hotel" | "restaurant" | "spa" | "business";
  preview_url: string;
  config_json: string;
  creado_por: string;
  fecha_creacion: string;
  descargas: number;
  rating: number;
}

interface AppRelease {
  id: string;
  app_type: "android_tv" | "totem" | "ads" | "events";
  hotel_slug: string;
  version: string;
  size_bytes: number;
  checksum_sha256: string;
  published_at: string;
  notes: string;
  is_latest: boolean;
  download_count: number;
}

const NativeApps = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("releases");
  const [layoutSkins, setLayoutSkins] = useState<LayoutSkin[]>([
    {
      id: "1",
      nombre: "Moderno Elegante",
      descripcion: "Layout minimalista con colores suaves y tipografía moderna",
      categoria: "hotel",
      preview_url: "/previews/modern_elegant.jpg",
      config_json: '{"theme": "modern", "colors": {"primary": "#1e40af", "secondary": "#f59e0b"}}',
      creado_por: "SmartRoom Team",
      fecha_creacion: "2024-03-15",
      descargas: 145,
      rating: 4.8
    },
    {
      id: "2",
      nombre: "Tropical Beach",
      descripcion: "Tema tropical con colores vibrantes del océano",
      categoria: "hotel",
      preview_url: "/previews/tropical_beach.jpg",
      config_json: '{"theme": "tropical", "colors": {"primary": "#059669", "secondary": "#06b6d4"}}',
      creado_por: "Design Studio",
      fecha_creacion: "2024-03-10",
      descargas: 89,
      rating: 4.6
    },
    {
      id: "3",
      nombre: "Corporativo Business",
      descripcion: "Diseño profesional para hoteles de negocios",
      categoria: "business",
      preview_url: "/previews/corporate_business.jpg",
      config_json: '{"theme": "corporate", "colors": {"primary": "#374151", "secondary": "#f59e0b"}}',
      creado_por: "Corporate Designs",
      fecha_creacion: "2024-03-08",
      descargas: 67,
      rating: 4.5
    },
    {
      id: "4",
      nombre: "Spa Wellness",
      descripcion: "Layout relajante con tonos naturales",
      categoria: "spa",
      preview_url: "/previews/spa_wellness.jpg",
      config_json: '{"theme": "spa", "colors": {"primary": "#10b981", "secondary": "#84cc16"}}',
      creado_por: "Wellness Co.",
      fecha_creacion: "2024-03-05",
      descargas: 112,
      rating: 4.9
    },
    {
      id: "5",
      nombre: "Restaurant Gourmet",
      descripcion: "Tema elegante para restaurantes de alta cocina",
      categoria: "restaurant",
      preview_url: "/previews/restaurant_gourmet.jpg",
      config_json: '{"theme": "gourmet", "colors": {"primary": "#dc2626", "secondary": "#f59e0b"}}',
      creado_por: "Culinary Arts",
      fecha_creacion: "2024-03-01",
      descargas: 76,
      rating: 4.7
    }
  ]);
  
  const [appReleases, setAppReleases] = useState<AppRelease[]>([
    {
      id: "1",
      app_type: "android_tv",
      hotel_slug: "hotel-plaza-central",
      version: "2.1.4",
      size_bytes: 45000000,
      checksum_sha256: "a1b2c3d4e5f6...",
      published_at: "2024-03-20",
      notes: "Corrección de errores y mejoras de rendimiento para Android TV",
      is_latest: true,
      download_count: 125
    },
    {
      id: "2",
      app_type: "totem",
      hotel_slug: "resort-marina-bay",
      version: "1.8.2",
      size_bytes: 32000000,
      checksum_sha256: "b2c3d4e5f6g7...",
      published_at: "2024-03-18",
      notes: "Nuevas funcionalidades para tótems interactivos",
      is_latest: true,
      download_count: 89
    },
    {
      id: "3",
      app_type: "ads",
      hotel_slug: "hotel-plaza-central",
      version: "3.0.1",
      size_bytes: 28000000,
      checksum_sha256: "c3d4e5f6g7h8...",
      published_at: "2024-03-15",
      notes: "Nueva versión con soporte para campañas programadas",
      is_latest: true,
      download_count: 201
    },
    {
      id: "4",
      app_type: "android_tv",
      hotel_slug: "hotel-plaza-central",
      version: "2.1.3",
      size_bytes: 44500000,
      checksum_sha256: "d4e5f6g7h8i9...",
      published_at: "2024-03-10",
      notes: "Versión anterior con funcionalidades básicas",
      is_latest: false,
      download_count: 312
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    app_type: "android_tv" as AppRelease["app_type"],
    hotel_slug: "hotel-plaza-central",
    version: "",
    notes: "",
    file: null as File | null
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAppTypeBadge = (type: AppRelease["app_type"]) => {
    const typeConfig = {
      android_tv: { label: "Android TV", variant: "default" as const, icon: "📺" },
      totem: { label: "Tótem", variant: "secondary" as const, icon: "🖥️" },
      ads: { label: "Publicidad", variant: "outline" as const, icon: "📢" },
      events: { label: "Eventos", variant: "secondary" as const, icon: "📅" }
    };
    
    return typeConfig[type];
  };

  const handleCreateRelease = () => {
    if (!formData.file) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo APK.",
        variant: "destructive"
      });
      return;
    }

    const newRelease: AppRelease = {
      id: Date.now().toString(),
      app_type: formData.app_type,
      hotel_slug: formData.hotel_slug,
      version: formData.version,
      size_bytes: formData.file.size,
      checksum_sha256: "generated_checksum_" + Date.now(),
      published_at: new Date().toISOString().split('T')[0],
      notes: formData.notes,
      is_latest: true,
      download_count: 0
    };

    // Marcar como no-latest las versiones anteriores del mismo tipo y hotel
    const updatedReleases = appReleases.map(release => {
      if (release.app_type === newRelease.app_type && release.hotel_slug === newRelease.hotel_slug) {
        return { ...release, is_latest: false };
      }
      return release;
    });

    setAppReleases([newRelease, ...updatedReleases]);
    setIsCreateDialogOpen(false);
    setFormData({
      app_type: "android_tv",
      hotel_slug: "hotel-plaza-central",
      version: "",
      notes: "",
      file: null
    });
    
    toast({
      title: "Release publicado",
      description: "La nueva versión de la aplicación ha sido publicada exitosamente.",
    });
  };

  const handleDeleteRelease = (id: string) => {
    setAppReleases(appReleases.filter(r => r.id !== id));
    toast({
      title: "Release eliminado",
      description: "La versión de la aplicación ha sido eliminada.",
    });
  };

  const handleDownload = (release: AppRelease) => {
    // Incrementar contador de descargas
    setAppReleases(appReleases.map(r => 
      r.id === release.id ? { ...r, download_count: r.download_count + 1 } : r
    ));
    
    toast({
      title: "Descarga iniciada",
      description: `Descargando ${release.app_type} v${release.version}`,
    });
  };

  const handleDownloadSkin = (skinId: string) => {
    setLayoutSkins(layoutSkins.map(skin => 
      skin.id === skinId ? { ...skin, descargas: skin.descargas + 1 } : skin
    ));
    
    toast({
      title: "Descarga iniciada",
      description: "El layout ha sido descargado exitosamente.",
    });
  };

  const getCategoriaColor = (categoria: LayoutSkin["categoria"]) => {
    const colors = {
      hotel: "text-primary",
      restaurant: "text-secondary",
      spa: "text-tertiary",
      business: "text-warning"
    };
    return colors[categoria];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Aplicaciones Nativas</h1>
            <p className="text-muted-foreground">Gestiona las versiones de las aplicaciones y librería de layouts</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Release
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Publicar Nueva Versión</DialogTitle>
                <DialogDescription>
                  Sube una nueva versión de la aplicación nativa
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="app_type">Tipo de Aplicación</Label>
                  <Select value={formData.app_type} onValueChange={(value: AppRelease["app_type"]) => setFormData({...formData, app_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="android_tv">Android TV</SelectItem>
                      <SelectItem value="totem">Aplicación Tótem</SelectItem>
                      <SelectItem value="ads">Sistema Publicitario</SelectItem>
                      <SelectItem value="events">Sistema de Eventos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="hotel_slug">Hotel Destinatario</Label>
                  <Select value={formData.hotel_slug} onValueChange={(value) => setFormData({...formData, hotel_slug: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel-plaza-central">Hotel Plaza Central</SelectItem>
                      <SelectItem value="resort-marina-bay">Resort Marina Bay</SelectItem>
                      <SelectItem value="all-hotels">Todos los Hoteles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="version">Versión</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData({...formData, version: e.target.value})}
                    placeholder="2.1.5"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="file">Archivo APK/APP</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".apk,.app,.ipa"
                    onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}
                  />
                  {formData.file && (
                    <p className="text-sm text-muted-foreground">
                      Archivo seleccionado: {formData.file.name} ({formatFileSize(formData.file.size)})
                    </p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notas de la Versión</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Describe los cambios y mejoras de esta versión..."
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateRelease} className="bg-gradient-primary">
                  <Upload className="h-4 w-4 mr-2" />
                  Publicar Release
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {["android_tv", "totem", "ads", "events"].map((type) => {
            const releases = appReleases.filter(r => r.app_type === type);
            const latestRelease = releases.find(r => r.is_latest);
            const typeConfig = getAppTypeBadge(type as AppRelease["app_type"]);
            
            return (
              <Card key={type} className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{typeConfig.label}</CardTitle>
                  <span className="text-lg">{typeConfig.icon}</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {latestRelease ? `v${latestRelease.version}` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {releases.length} version{releases.length !== 1 ? 'es' : ''} disponible{releases.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="releases">Historial de Releases</TabsTrigger>
            <TabsTrigger value="layouts">Librería de Layouts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="releases">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Historial de Releases
                </CardTitle>
                <CardDescription>
                  Todas las versiones publicadas de las aplicaciones nativas
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aplicación</TableHead>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Versión</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Descargas</TableHead>
                      <TableHead>Notas</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appReleases.map((release) => {
                      const typeConfig = getAppTypeBadge(release.app_type);
                      
                      return (
                        <TableRow key={release.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{typeConfig.icon}</span>
                              <Badge variant={typeConfig.variant}>
                                {typeConfig.label}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {release.hotel_slug.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono font-medium">
                            v{release.version}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatFileSize(release.size_bytes)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {release.published_at}
                          </TableCell>
                          <TableCell>
                            {release.is_latest ? (
                              <Badge variant="default">Actual</Badge>
                            ) : (
                              <Badge variant="secondary">Anterior</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {release.download_count} descargas
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate text-sm" title={release.notes}>
                              {release.notes}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownload(release)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteRelease(release.id)}
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
          </TabsContent>
          
          <TabsContent value="layouts">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Librería de Layouts / Skins
                </CardTitle>
                <CardDescription>
                  Layouts prediseñados listos para usar en las aplicaciones de TV
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {layoutSkins.map((skin) => (
                    <Card key={skin.id} className="border hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{skin.nombre}</CardTitle>
                            <Badge variant="outline" className={getCategoriaColor(skin.categoria)}>
                              {skin.categoria}
                            </Badge>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            ⭐ {skin.rating}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="aspect-video bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                            <Smartphone className="h-8 w-8" />
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {skin.descripcion}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Por {skin.creado_por}</span>
                            <span>{skin.descargas} descargas</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleDownloadSkin(skin.id)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Descargar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default NativeApps;