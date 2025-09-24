import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Monitor, Edit, Upload, Download, Eye, Palette, Image as ImageIcon, Type, Settings, Play, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppElement {
  id: string;
  type: 'text' | 'image' | 'background' | 'logo';
  content: string;
  position: { x: number; y: number };
  styles: {
    fontSize?: string;
    color?: string;
    fontWeight?: string;
    width?: string;
    height?: string;
  };
}

interface AppProject {
  id: string;
  name: string;
  description: string;
  template: string;
  elements: AppElement[];
  backgroundImage?: string;
  logoImage?: string;
  primaryColor: string;
  secondaryColor: string;
}

const NativeApps = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeProject, setActiveProject] = useState<AppProject>({
    id: "1",
    name: "SmartRoom Hotel TV",
    description: "Aplicación para pantallas de hotel con información y servicios",
    template: "hotel-tv",
    primaryColor: "#1e40af",
    secondaryColor: "#f59e0b",
    backgroundImage: "/hero-smartroom.jpg",
    elements: [
      {
        id: "1",
        type: "text",
        content: "Bienvenido al Hotel",
        position: { x: 50, y: 20 },
        styles: { fontSize: "2rem", color: "#1e40af", fontWeight: "bold" }
      },
      {
        id: "2", 
        type: "text",
        content: "Disfruta de tu estancia",
        position: { x: 50, y: 35 },
        styles: { fontSize: "1.2rem", color: "#666" }
      },
      {
        id: "3",
        type: "text",
        content: "Servicios disponibles 24/7",
        position: { x: 50, y: 60 },
        styles: { fontSize: "1rem", color: "#333" }
      },
      {
        id: "4",
        type: "logo",
        content: "/placeholder.svg",
        position: { x: 10, y: 10 },
        styles: { width: "120px", height: "60px" }
      }
    ]
  });

  const [selectedElement, setSelectedElement] = useState<AppElement | null>(null);
  const [isEditingElement, setIsEditingElement] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'tv'>('mobile');
  const [showExternalProject, setShowExternalProject] = useState(false);
  const [uploadType, setUploadType] = useState<'background' | 'logo' | 'element'>('element');

  const handleElementClick = (element: AppElement) => {
    setSelectedElement(element);
    setIsEditingElement(true);
  };

  const handleUpdateElement = (updatedElement: AppElement) => {
    setActiveProject(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      )
    }));
    
    toast({
      title: "Elemento actualizado",
      description: "Los cambios se han guardado exitosamente."
    });
  };

  const handleImageUpload = (type: 'background' | 'logo' | 'element') => {
    setUploadType(type);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        
        if (uploadType === 'background') {
          setActiveProject(prev => ({
            ...prev,
            backgroundImage: imageUrl
          }));
        } else if (uploadType === 'logo') {
          // Actualizar o crear elemento de logo
          const logoElement = activeProject.elements.find(el => el.type === 'logo');
          if (logoElement) {
            handleUpdateElement({
              ...logoElement,
              content: imageUrl
            });
          } else {
            const newLogoElement: AppElement = {
              id: Date.now().toString(),
              type: 'logo',
              content: imageUrl,
              position: { x: 10, y: 10 },
              styles: { width: "120px", height: "60px" }
            };
            setActiveProject(prev => ({
              ...prev,
              elements: [...prev.elements, newLogoElement]
            }));
          }
        } else if (selectedElement && selectedElement.type === 'image') {
          handleUpdateElement({
            ...selectedElement,
            content: imageUrl
          });
        } else {
          // Crear nuevo elemento de imagen
          const newElement: AppElement = {
            id: Date.now().toString(),
            type: 'image',
            content: imageUrl,
            position: { x: 30, y: 50 },
            styles: { width: "200px", height: "150px" }
          };
          
          setActiveProject(prev => ({
            ...prev,
            elements: [...prev.elements, newElement]
          }));
        }
        
        toast({
          title: "Imagen cargada",
          description: "La imagen se ha agregado exitosamente."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const openExternalProject = () => {
    window.open('https://lovable.dev/projects/f9c6dd0a-7e63-49b9-b0dc-cda403509b86', '_blank');
  };

  const deleteElement = (elementId: string) => {
    setActiveProject(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId)
    }));
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
    
    toast({
      title: "Elemento eliminado",
      description: "El elemento se ha eliminado exitosamente."
    });
  };

  const renderPreviewElement = (element: AppElement) => {
    const style = {
      position: 'absolute' as const,
      left: `${element.position.x}%`,
      top: `${element.position.y}%`,
      transform: 'translate(-50%, -50%)',
      ...element.styles,
      cursor: 'pointer',
      border: selectedElement?.id === element.id ? '2px dashed #3b82f6' : 'none',
      padding: selectedElement?.id === element.id ? '4px' : '0'
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={style}
            onClick={() => handleElementClick(element)}
            className="hover:bg-blue-50 hover:bg-opacity-50 transition-colors whitespace-nowrap"
          >
            {element.content}
          </div>
        );
      case 'image':
      case 'logo':
        return (
          <img
            key={element.id}
            src={element.content}
            alt="Element"
            style={style}
            onClick={() => handleElementClick(element)}
            className="hover:opacity-80 transition-opacity object-contain"
          />
        );
      case 'background':
        return null; // Background is handled separately
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Apps Nativas</h1>
            <p className="text-muted-foreground">Editor visual para aplicaciones móviles y TV</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={openExternalProject}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Proyecto Original
            </Button>
            <Button variant="outline" onClick={() => setPreviewMode(previewMode === 'mobile' ? 'tv' : 'mobile')}>
              {previewMode === 'mobile' ? <Monitor className="h-4 w-4 mr-2" /> : <Smartphone className="h-4 w-4 mr-2" />}
              Vista {previewMode === 'mobile' ? 'TV' : 'Móvil'}
            </Button>
            <Button className="bg-gradient-primary">
              <Download className="h-4 w-4 mr-2" />
              Exportar App
            </Button>
          </div>
        </div>

        {/* Información del proyecto externo */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Proyecto Base
            </CardTitle>
            <CardDescription>
              Configuración basada en: https://lovable.dev/projects/f9c6dd0a-7e63-49b9-b0dc-cda403509b86
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Este editor permite personalizar la aplicación nativa manteniendo la funcionalidad del proyecto original.
                </p>
              </div>
              <Button variant="outline" onClick={openExternalProject}>
                <Eye className="h-4 w-4 mr-2" />
                <ExternalLink className="h-4 w-4 ml-1" />
                Abrir Proyecto
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Herramientas */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Herramientas de Edición
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="elements" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="elements">Elementos</TabsTrigger>
                  <TabsTrigger value="styles">Estilos</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>
                
                <TabsContent value="elements" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Agregar Elementos</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const newElement: AppElement = {
                            id: Date.now().toString(),
                            type: 'text',
                            content: 'Nuevo texto',
                            position: { x: 50, y: 50 },
                            styles: { fontSize: '1rem', color: '#333' }
                          };
                          setActiveProject(prev => ({
                            ...prev,
                            elements: [...prev.elements, newElement]
                          }));
                        }}
                      >
                        <Type className="h-4 w-4 mr-1" />
                        Texto
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImageUpload('element')}
                      >
                        <ImageIcon className="h-4 w-4 mr-1" />
                        Imagen
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Elementos en Pantalla</Label>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {activeProject.elements.map((element) => (
                        <div
                          key={element.id}
                          className={`p-2 border rounded cursor-pointer hover:bg-muted/50 ${
                            selectedElement?.id === element.id ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => setSelectedElement(element)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {element.type === 'text' ? element.content.substring(0, 15) + (element.content.length > 15 ? '...' : '') : 
                               element.type === 'image' ? 'Imagen' : 
                               element.type === 'logo' ? 'Logo' : element.type}
                            </span>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {element.type}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteElement(element.id);
                                }}
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="styles" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Color Primario</Label>
                      <Input
                        type="color"
                        value={activeProject.primaryColor}
                        onChange={(e) => setActiveProject(prev => ({
                          ...prev,
                          primaryColor: e.target.value
                        }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Color Secundario</Label>
                      <Input
                        type="color"
                        value={activeProject.secondaryColor}
                        onChange={(e) => setActiveProject(prev => ({
                          ...prev,
                          secondaryColor: e.target.value
                        }))}
                      />
                    </div>
                    
                    {selectedElement && (
                      <div className="pt-4 border-t">
                        <Label className="text-sm font-medium">Elemento Seleccionado</Label>
                        <div className="mt-2 space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => setIsEditingElement(true)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Propiedades
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="media" className="space-y-4">
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleImageUpload('background')}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Cambiar Fondo
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleImageUpload('logo')}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Cambiar Logo
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Vista Previa */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Vista Previa - {previewMode === 'mobile' ? 'Móvil' : 'TV'}
                </CardTitle>
                <Badge variant="outline">
                  {activeProject.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className={`relative border-2 border-dashed border-gray-300 overflow-hidden ${
                  previewMode === 'mobile' 
                    ? 'aspect-[9/16] max-w-sm mx-auto' 
                    : 'aspect-[16/9] w-full'
                }`}
                style={{
                  backgroundImage: activeProject.backgroundImage ? `url(${activeProject.backgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: activeProject.backgroundImage ? 'transparent' : '#f8f9fa'
                }}
              >
                {activeProject.elements.map(renderPreviewElement)}
                
                {/* Overlay para mostrar que es interactivo */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-5 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    Haz clic en los elementos para editarlos
                  </div>
                </div>
                
                {/* Grilla de ayuda */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dialog para editar elementos */}
        <Dialog open={isEditingElement && selectedElement !== null} onOpenChange={setIsEditingElement}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar {selectedElement?.type === 'text' ? 'Texto' : 'Elemento'}</DialogTitle>
              <DialogDescription>
                Modifica las propiedades del elemento seleccionado
              </DialogDescription>
            </DialogHeader>
            
            {selectedElement && (
              <div className="grid gap-4 py-4">
                {selectedElement.type === 'text' && (
                  <>
                    <div className="grid gap-2">
                      <Label>Contenido</Label>
                      <Textarea
                        value={selectedElement.content}
                        onChange={(e) => setSelectedElement({
                          ...selectedElement,
                          content: e.target.value
                        })}
                        placeholder="Ingresa el texto aquí..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Tamaño de Fuente</Label>
                        <Input
                          value={selectedElement.styles.fontSize || '1rem'}
                          onChange={(e) => setSelectedElement({
                            ...selectedElement,
                            styles: { ...selectedElement.styles, fontSize: e.target.value }
                          })}
                          placeholder="1rem"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Color</Label>
                        <Input
                          type="color"
                          value={selectedElement.styles.color || '#000000'}
                          onChange={(e) => setSelectedElement({
                            ...selectedElement,
                            styles: { ...selectedElement.styles, color: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Posición X (%)</Label>
                    <Input
                      type="number"
                      value={selectedElement.position.x}
                      onChange={(e) => setSelectedElement({
                        ...selectedElement,
                        position: { ...selectedElement.position, x: Number(e.target.value) }
                      })}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Posición Y (%)</Label>
                    <Input
                      type="number"
                      value={selectedElement.position.y}
                      onChange={(e) => setSelectedElement({
                        ...selectedElement,
                        position: { ...selectedElement.position, y: Number(e.target.value) }
                      })}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                
                {(selectedElement.type === 'image' || selectedElement.type === 'logo') && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Ancho</Label>
                        <Input
                          value={selectedElement.styles.width || '100px'}
                          onChange={(e) => setSelectedElement({
                            ...selectedElement,
                            styles: { ...selectedElement.styles, width: e.target.value }
                          })}
                          placeholder="100px"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Alto</Label>
                        <Input
                          value={selectedElement.styles.height || '100px'}
                          onChange={(e) => setSelectedElement({
                            ...selectedElement,
                            styles: { ...selectedElement.styles, height: e.target.value }
                          })}
                          placeholder="100px"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Cambiar Imagen</Label>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setUploadType('element');
                          fileInputRef.current?.click();
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Nueva Imagen
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditingElement(false);
                setSelectedElement(null);
              }}>
                Cancelar
              </Button>
              <Button onClick={() => {
                if (selectedElement) {
                  handleUpdateElement(selectedElement);
                  setIsEditingElement(false);
                  setSelectedElement(null);
                }
              }}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Input oculto para subir archivos */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </DashboardLayout>
  );
};

export default NativeApps;