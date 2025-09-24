import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Upload, Image, Video, FileText, Search, Filter, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaAsset {
  id: string;
  url: string;
  tipo: "image" | "video" | "svg";
  width?: number;
  height?: number;
  size_bytes: number;
  tags: string[];
  created_at: string;
  name: string;
}

const Media = () => {
  const { toast } = useToast();
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([
    {
      id: "1",
      url: "/src/assets/hero-smartroom.jpg",
      tipo: "image",
      width: 1920,
      height: 1080,
      size_bytes: 450000,
      tags: ["hero", "smartroom", "hotel"],
      created_at: "2024-01-15",
      name: "hero-smartroom.jpg"
    },
    {
      id: "2",
      url: "https://example.com/video-promo.mp4",
      tipo: "video",
      width: 1920,
      height: 1080,
      size_bytes: 15000000,
      tags: ["promocional", "video", "hotel"],
      created_at: "2024-02-01",
      name: "video-promo.mp4"
    },
    {
      id: "3",
      url: "https://example.com/logo-hotel.svg",
      tipo: "svg",
      width: 300,
      height: 100,
      size_bytes: 25000,
      tags: ["logo", "branding", "svg"],
      created_at: "2024-01-20",
      name: "logo-hotel.svg"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video" | "svg">("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: MediaAsset["tipo"]) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "svg":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: MediaAsset["tipo"]) => {
    const typeConfig = {
      image: { label: "Imagen", variant: "default" as const },
      video: { label: "Video", variant: "secondary" as const },
      svg: { label: "SVG", variant: "outline" as const }
    };
    
    return typeConfig[type];
  };

  const filteredAssets = mediaAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || asset.tipo === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleDeleteAsset = (id: string) => {
    setMediaAssets(mediaAssets.filter(a => a.id !== id));
    toast({
      title: "Archivo eliminado",
      description: "El archivo multimedia ha sido eliminado de la biblioteca.",
    });
  };

  const handleUploadFiles = () => {
    // Simulamos la subida de archivos
    const newAsset: MediaAsset = {
      id: Date.now().toString(),
      url: "https://example.com/nuevo-archivo.jpg",
      tipo: "image",
      width: 1200,
      height: 800,
      size_bytes: 320000,
      tags: ["nuevo", "subida"],
      created_at: new Date().toISOString().split('T')[0],
      name: "nuevo-archivo.jpg"
    };

    setMediaAssets([newAsset, ...mediaAssets]);
    setIsUploadDialogOpen(false);
    
    toast({
      title: "Archivo subido",
      description: "Los archivos han sido subidos exitosamente a la biblioteca.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Biblioteca de Medios</h1>
            <p className="text-muted-foreground">Gestiona todos los archivos multimedia del sistema</p>
          </div>
          
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
                <Upload className="h-4 w-4 mr-2" />
                Subir Archivos
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Subir Archivos Multimedia</DialogTitle>
                <DialogDescription>
                  Sube imágenes, videos y otros archivos a la biblioteca
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Arrastra archivos aquí</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    o haz clic para seleccionar archivos
                  </p>
                  <Button variant="outline">
                    Seleccionar Archivos
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Tipos de archivo soportados:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Imágenes: JPG, PNG, GIF, WebP</li>
                    <li>Videos: MP4, WebM, MOV</li>
                    <li>Vectores: SVG</li>
                  </ul>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUploadFiles} className="bg-gradient-primary">
                  Subir Archivos
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Archivos</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mediaAssets.length}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Imágenes</CardTitle>
              <Image className="h-4 w-4 text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">
                {mediaAssets.filter(m => m.tipo === "image").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos</CardTitle>
              <Video className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {mediaAssets.filter(m => m.tipo === "video").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vectores SVG</CardTitle>
              <FileText className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {mediaAssets.filter(m => m.tipo === "svg").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Archivos Multimedia
            </CardTitle>
            <CardDescription>
              Todos los archivos subidos a la biblioteca de medios
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar archivos por nombre o etiquetas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                >
                  Todos
                </Button>
                <Button
                  variant={filterType === "image" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("image")}
                >
                  <Image className="h-4 w-4 mr-1" />
                  Imágenes
                </Button>
                <Button
                  variant={filterType === "video" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("video")}
                >
                  <Video className="h-4 w-4 mr-1" />
                  Videos
                </Button>
                <Button
                  variant={filterType === "svg" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("svg")}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  SVG
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAssets.map((asset) => {
                const typeBadge = getTypeBadge(asset.tipo);
                
                return (
                  <Card key={asset.id} className="shadow-card hover:shadow-elegant transition-smooth">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                        {asset.tipo === "image" && asset.url.startsWith("/") ? (
                          <img 
                            src={asset.url} 
                            alt={asset.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`flex flex-col items-center text-muted-foreground ${asset.tipo === "image" && asset.url.startsWith("/") ? 'hidden' : ''}`}>
                          {getTypeIcon(asset.tipo)}
                          <span className="text-xs mt-1">{asset.tipo.toLowerCase()}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant={typeBadge.variant}>
                            {typeBadge.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(asset.size_bytes)}
                          </span>
                        </div>
                        
                        <h4 className="font-medium text-sm truncate" title={asset.name}>
                          {asset.name}
                        </h4>
                        
                        {asset.width && asset.height && (
                          <p className="text-xs text-muted-foreground">
                            {asset.width} × {asset.height}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {asset.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{asset.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-muted-foreground">
                            {asset.created_at}
                          </span>
                          
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteAsset(asset.id)}
                              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {filteredAssets.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No se encontraron archivos</p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Intenta con otros términos de búsqueda" : "Sube algunos archivos para comenzar"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Media;