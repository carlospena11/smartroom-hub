import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Upload, Download, Eye, Palette, Image as ImageIcon, Type, ExternalLink, Plus, Edit3, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectElement {
  id: string;
  type: 'text' | 'image' | 'logo';
  content: string;
  originalContent?: string;
  selector?: string;
  position: { x: number; y: number };
  styles: {
    fontSize?: string;
    color?: string;
    fontWeight?: string;
    width?: string;
    height?: string;
  };
}

interface WebProject {
  id: string;
  name: string;
  url: string;
  description: string;
  elements: ProjectElement[];
  backgroundImage?: string;
  isLoaded: boolean;
}

const NativeApps = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  
  const [projects, setProjects] = useState<WebProject[]>([
    {
      id: "1",
      name: "Proyecto Demo",
      url: "https://lovable.dev/projects/f9c6dd0a-7e63-49b9-b0dc-cda403509b86",
      description: "Proyecto base para edición",
      isLoaded: true,
      elements: [
        {
          id: "1",
          type: "text",
          content: "Bienvenido a SmartRoom",
          originalContent: "Bienvenido a SmartRoom",
          position: { x: 50, y: 20 },
          styles: { fontSize: "2rem", color: "#1e40af", fontWeight: "bold" }
        },
        {
          id: "2", 
          type: "text",
          content: "Gestión inteligente para hoteles",
          originalContent: "Gestión inteligente para hoteles",
          position: { x: 50, y: 35 },
          styles: { fontSize: "1.2rem", color: "#666" }
        },
        {
          id: "3",
          type: "logo",
          content: "/placeholder.svg",
          originalContent: "/placeholder.svg",
          position: { x: 10, y: 10 },
          styles: { width: "120px", height: "60px" }
        }
      ]
    }
  ]);
  
  const [activeProject, setActiveProject] = useState<WebProject | null>(projects[0]);
  const [selectedElement, setSelectedElement] = useState<ProjectElement | null>(null);
  const [isEditingElement, setIsEditingElement] = useState(false);
  const [uploadType, setUploadType] = useState<'background' | 'logo' | 'element'>('element');
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjectUrl, setNewProjectUrl] = useState("");
  const [newProjectName, setNewProjectName] = useState("");

  const handleLoadProject = async () => {
    if (!newProjectUrl || !newProjectName) {
      toast({
        title: "Error",
        description: "Por favor ingresa una URL y nombre válidos.",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingProject(true);
    
    // Simular carga del proyecto
    setTimeout(() => {
      const newProject: WebProject = {
        id: Date.now().toString(),
        name: newProjectName,
        url: newProjectUrl,
        description: "Proyecto cargado desde URL",
        isLoaded: true,
        elements: [
          {
            id: Date.now().toString(),
            type: "text",
            content: "Título principal",
            originalContent: "Título principal",
            position: { x: 50, y: 25 },
            styles: { fontSize: "2rem", color: "#333", fontWeight: "bold" }
          },
          {
            id: (Date.now() + 1).toString(),
            type: "text",
            content: "Subtítulo",
            originalContent: "Subtítulo",
            position: { x: 50, y: 40 },
            styles: { fontSize: "1.2rem", color: "#666" }
          }
        ]
      };
      
      setProjects(prev => [...prev, newProject]);
      setActiveProject(newProject);
      setShowAddProject(false);
      setNewProjectUrl("");
      setNewProjectName("");
      setIsLoadingProject(false);
      
      toast({
        title: "Proyecto cargado",
        description: `${newProjectName} se ha cargado exitosamente.`
      });
    }, 2000);
  };

  const handleElementClick = (element: ProjectElement) => {
    setSelectedElement(element);
    setIsEditingElement(true);
  };

  const handleUpdateElement = (updatedElement: ProjectElement) => {
    if (!activeProject) return;
    
    const updatedProject = {
      ...activeProject,
      elements: activeProject.elements.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      )
    };
    
    setActiveProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === activeProject.id ? updatedProject : p));
    
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
    if (file && activeProject) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        
        if (uploadType === 'background') {
          const updatedProject = {
            ...activeProject,
            backgroundImage: imageUrl
          };
          setActiveProject(updatedProject);
          setProjects(prev => prev.map(p => p.id === activeProject.id ? updatedProject : p));
        } else if (uploadType === 'logo') {
          const logoElement = activeProject.elements.find(el => el.type === 'logo');
          if (logoElement) {
            handleUpdateElement({
              ...logoElement,
              content: imageUrl
            });
          } else {
            const newLogoElement: ProjectElement = {
              id: Date.now().toString(),
              type: 'logo',
              content: imageUrl,
              position: { x: 10, y: 10 },
              styles: { width: "120px", height: "60px" }
            };
            const updatedProject = {
              ...activeProject,
              elements: [...activeProject.elements, newLogoElement]
            };
            setActiveProject(updatedProject);
            setProjects(prev => prev.map(p => p.id === activeProject.id ? updatedProject : p));
          }
        } else if (selectedElement && selectedElement.type === 'image') {
          handleUpdateElement({
            ...selectedElement,
            content: imageUrl
          });
        } else {
          const newElement: ProjectElement = {
            id: Date.now().toString(),
            type: 'image',
            content: imageUrl,
            position: { x: 30, y: 50 },
            styles: { width: "200px", height: "150px" }
          };
          
          const updatedProject = {
            ...activeProject,
            elements: [...activeProject.elements, newElement]
          };
          setActiveProject(updatedProject);
          setProjects(prev => prev.map(p => p.id === activeProject.id ? updatedProject : p));
        }
        
        toast({
          title: "Imagen cargada",
          description: "La imagen se ha agregado exitosamente."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteElement = (elementId: string) => {
    if (!activeProject) return;
    
    const updatedProject = {
      ...activeProject,
      elements: activeProject.elements.filter(el => el.id !== elementId)
    };
    
    setActiveProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === activeProject.id ? updatedProject : p));
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
    
    toast({
      title: "Elemento eliminado",
      description: "El elemento se ha eliminado exitosamente."
    });
  };

  const addTextElement = () => {
    if (!activeProject) return;
    
    const newElement: ProjectElement = {
      id: Date.now().toString(),
      type: 'text',
      content: 'Nuevo texto',
      position: { x: 50, y: 50 },
      styles: { fontSize: '1rem', color: '#333' }
    };
    
    const updatedProject = {
      ...activeProject,
      elements: [...activeProject.elements, newElement]
    };
    
    setActiveProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === activeProject.id ? updatedProject : p));
  };

  const renderPreviewElement = (element: ProjectElement) => {
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
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Proyectos</h1>
            <p className="text-muted-foreground">Editor visual para páginas web - Solo imágenes y textos</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAddProject(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Cargar Proyecto
            </Button>
            {activeProject && (
              <Button className="bg-gradient-primary">
                <Download className="h-4 w-4 mr-2" />
                Exportar Cambios
              </Button>
            )}
          </div>
        </div>

        {/* Lista de Proyectos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Proyectos Cargados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    activeProject?.id === project.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setActiveProject(project)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{project.name}</h3>
                    <Badge variant={project.isLoaded ? "default" : "secondary"}>
                      {project.isLoaded ? "Cargado" : "Pendiente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    <span className="text-xs text-muted-foreground truncate">{project.url}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {activeProject && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel de Herramientas */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Editor de Elementos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="elements" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="elements">Elementos</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="elements" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Agregar Elementos</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={addTextElement}
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
                      <Label>Elementos ({activeProject.elements.length})</Label>
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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleElementClick(element);
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteElement(element.id);
                                  }}
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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
                    Vista Previa - {activeProject.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {activeProject.elements.length} elementos
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => window.open(activeProject.url, '_blank')}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="relative border-2 border-dashed border-gray-300 aspect-[16/9] w-full overflow-hidden bg-white"
                  style={{
                    backgroundImage: activeProject.backgroundImage ? `url(${activeProject.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Grid de ayuda */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="w-full h-full" style={{
                      backgroundImage: `
                        linear-gradient(to right, #ccc 1px, transparent 1px),
                        linear-gradient(to bottom, #ccc 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  
                  {/* Elementos renderizados */}
                  {activeProject.elements.map(element => renderPreviewElement(element))}
                  
                  {/* Indicador de área vacía */}
                  {activeProject.elements.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Agrega elementos para comenzar a editar</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  Click en cualquier elemento para editarlo • Usa las herramientas de la izquierda para agregar contenido
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dialog para cargar proyecto */}
        <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cargar Nuevo Proyecto</DialogTitle>
              <DialogDescription>
                Ingresa la URL del proyecto web que quieres editar
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Nombre del proyecto</Label>
                <Input
                  id="projectName"
                  placeholder="Mi proyecto web"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectUrl">URL del proyecto</Label>
                <Input
                  id="projectUrl"
                  placeholder="https://example.com"
                  value={newProjectUrl}
                  onChange={(e) => setNewProjectUrl(e.target.value)}
                  ref={urlInputRef}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddProject(false)}>
                Cancelar
              </Button>
              <Button onClick={handleLoadProject} disabled={isLoadingProject}>
                {isLoadingProject ? "Cargando..." : "Cargar Proyecto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para editar elemento */}
        <Dialog open={isEditingElement} onOpenChange={setIsEditingElement}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Elemento</DialogTitle>
              <DialogDescription>
                Modifica las propiedades del elemento seleccionado
              </DialogDescription>
            </DialogHeader>
            {selectedElement && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de elemento</Label>
                  <Badge variant="outline">{selectedElement.type}</Badge>
                </div>
                
                {selectedElement.type === 'text' && (
                  <div className="space-y-2">
                    <Label htmlFor="content">Texto</Label>
                    <Textarea
                      id="content"
                      value={selectedElement.content}
                      onChange={(e) => setSelectedElement({
                        ...selectedElement,
                        content: e.target.value
                      })}
                    />
                  </div>
                )}
                
                {selectedElement.type === 'text' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fontSize">Tamaño de fuente</Label>
                        <Input
                          id="fontSize"
                          value={selectedElement.styles.fontSize || '1rem'}
                          onChange={(e) => setSelectedElement({
                            ...selectedElement,
                            styles: { ...selectedElement.styles, fontSize: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
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
                
                {(selectedElement.type === 'image' || selectedElement.type === 'logo') && (
                  <>
                    <div className="space-y-2">
                      <Label>Imagen actual</Label>
                      <img src={selectedElement.content} alt="Current" className="max-w-full h-32 object-contain border rounded" />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImageUpload('element')}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Cambiar imagen
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width">Ancho</Label>
                        <Input
                          id="width"
                          value={selectedElement.styles.width || 'auto'}
                          onChange={(e) => setSelectedElement({
                            ...selectedElement,
                            styles: { ...selectedElement.styles, width: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Alto</Label>
                        <Input
                          id="height"
                          value={selectedElement.styles.height || 'auto'}
                          onChange={(e) => setSelectedElement({
                            ...selectedElement,
                            styles: { ...selectedElement.styles, height: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="posX">Posición X (%)</Label>
                    <Input
                      id="posX"
                      type="number"
                      min="0"
                      max="100"
                      value={selectedElement.position.x}
                      onChange={(e) => setSelectedElement({
                        ...selectedElement,
                        position: { ...selectedElement.position, x: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="posY">Posición Y (%)</Label>
                    <Input
                      id="posY"
                      type="number"
                      min="0"
                      max="100"
                      value={selectedElement.position.y}
                      onChange={(e) => setSelectedElement({
                        ...selectedElement,
                        position: { ...selectedElement.position, y: Number(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditingElement(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                if (selectedElement) {
                  handleUpdateElement(selectedElement);
                  setIsEditingElement(false);
                }
              }}>
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Input oculto para subir archivos */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
    </DashboardLayout>
  );
};

export default NativeApps;