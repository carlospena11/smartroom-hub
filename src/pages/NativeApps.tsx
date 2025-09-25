import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Upload, Download, Eye, Palette, Image as ImageIcon, Type, ExternalLink, Plus, Edit3, Trash2, Save, BookOpen, Users, Star, Smartphone, Monitor, FolderOpen, Tv } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

type ProjectType = 'web' | 'android';

interface WebProject {
  id: string;
  name: string;
  url: string;
  description: string;
  type: ProjectType;
  elements: ProjectElement[];
  backgroundImage?: string;
  isLoaded: boolean;
  isSaved?: boolean;
  templateId?: string;
  tags?: string[];
}

interface ProjectTemplate {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  elements: ProjectElement[];
  background_image?: string | null;
  tags: string[];
  is_public: boolean;
  created_at: string;
  thumbnail_url?: string | null;
}

// Proyectos demo iniciales
const demoProjects: WebProject[] = [
  {
    id: "demo-web-1",
    name: "Hotel Web App",
    url: "https://lovable.dev/projects/web-demo",
    description: "Aplicación web para hotel - Vista responsive",
    type: "web",
    isLoaded: true,
    isSaved: false,
    elements: [
      {
        id: "demo-text-1",
        type: "text",
        content: "Bienvenido a SmartRoom",
        originalContent: "Bienvenido a SmartRoom",
        position: { x: 50, y: 20 },
        styles: { fontSize: "2rem", color: "#1e40af", fontWeight: "bold" }
      },
      {
        id: "demo-text-2", 
        type: "text",
        content: "Gestión inteligente para hoteles",
        originalContent: "Gestión inteligente para hoteles",
        position: { x: 50, y: 35 },
        styles: { fontSize: "1.2rem", color: "#666" }
      },
      {
        id: "demo-logo-1",
        type: "logo",
        content: "/placeholder.svg",
        originalContent: "/placeholder.svg",
        position: { x: 15, y: 15 },
        styles: { width: "120px", height: "60px" }
      }
    ]
  },
  {
    id: "demo-android-1", 
    name: "Android TV App",
    url: "https://lovable.dev/projects/android-demo",
    description: "App nativa para Android TV - Vista horizontal",
    type: "android",
    isLoaded: true,
    isSaved: false,
    elements: [
      {
        id: "demo-android-text-1",
        type: "text",
        content: "SmartRoom TV",
        originalContent: "SmartRoom TV",
        position: { x: 50, y: 25 },
        styles: { fontSize: "3rem", color: "#ffffff", fontWeight: "bold" }
      },
      {
        id: "demo-android-text-2",
        type: "text", 
        content: "Experiencia Android TV",
        originalContent: "Experiencia Android TV",
        position: { x: 50, y: 45 },
        styles: { fontSize: "1.5rem", color: "#cccccc" }
      },
      {
        id: "demo-android-logo-1",
        type: "logo",
        content: "/placeholder.svg",
        originalContent: "/placeholder.svg", 
        position: { x: 10, y: 10 },
        styles: { width: "100px", height: "50px" }
      }
    ]
  }
];

const NativeApps = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  
  const [projects, setProjects] = useState<WebProject[]>(demoProjects);
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [activeProject, setActiveProject] = useState<WebProject | null>(demoProjects[0]);
  const [selectedElement, setSelectedElement] = useState<ProjectElement | null>(null);
  const [isEditingElement, setIsEditingElement] = useState(false);
  const [uploadType, setUploadType] = useState<'background' | 'logo' | 'element'>('element');
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [newProjectUrl, setNewProjectUrl] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectType, setNewProjectType] = useState<ProjectType>("web");
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateTags, setTemplateTags] = useState("");
  const [isPublicTemplate, setIsPublicTemplate] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('project_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convertir los datos de Supabase al formato esperado
      const formattedTemplates: ProjectTemplate[] = (data || []).map(template => ({
        ...template,
        elements: Array.isArray(template.elements) ? template.elements as unknown as ProjectElement[] : [],
        description: template.description || "",
        url: template.url || ""
      }));
      
      setTemplates(formattedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      // No mostrar error si no hay plantillas, es normal al inicio
    }
  };

  const saveAsTemplate = async () => {
    if (!activeProject || !templateName) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const tagsArray = templateTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      // Obtener el usuario actual
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        toast({
          title: "Error de autenticación",
          description: "Debes estar autenticado para guardar plantillas.",
          variant: "destructive"
        });
        return;
      }

      // Obtener el tenant_id del usuario actual
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('user_id', userData.user.id)
        .single();

      if (profileError || !profile?.tenant_id) {
        toast({
          title: "Error",
          description: "No se pudo obtener información del tenant. Intenta más tarde.",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('project_templates')
        .insert({
          name: templateName,
          description: templateDescription,
          url: activeProject.url,
          elements: activeProject.elements as any, // Cast para Json type
          background_image: activeProject.backgroundImage,
          tags: tagsArray,
          is_public: isPublicTemplate,
          tenant_id: profile.tenant_id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Plantilla guardada",
        description: `${templateName} se ha guardado en el repositorio.`
      });

      setShowSaveTemplate(false);
      setTemplateName("");
      setTemplateDescription("");
      setTemplateTags("");
      setIsPublicTemplate(false);
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la plantilla. Verifica tu conexión.",
        variant: "destructive"
      });
    }
  };

  const loadFromTemplate = (template: ProjectTemplate) => {
    const newProject: WebProject = {
      id: Date.now().toString(),
      name: `${template.name} - Copia`,
      url: template.url || "",
      type: "web", // Por defecto web, se puede mejorar guardando el tipo en la plantilla
      description: template.description || "Proyecto cargado desde plantilla",
      isLoaded: true,
      isSaved: false,
      templateId: template.id,
      tags: template.tags,
      elements: template.elements,
      backgroundImage: template.background_image || undefined
    };
    
    setProjects(prev => [...prev, newProject]);
    setActiveProject(newProject);
    setShowTemplates(false);
    
    toast({
      title: "Plantilla cargada",
      description: `${template.name} se ha cargado exitosamente.`
    });
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('project_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      toast({
        title: "Plantilla eliminada",
        description: "La plantilla se ha eliminado del repositorio."
      });

      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la plantilla.",
        variant: "destructive"
      });
    }
  };

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
        type: newProjectType,
        description: `Proyecto ${newProjectType === 'web' ? 'web' : 'Android TV'} cargado desde URL`,
        isLoaded: true,
        isSaved: false,
        elements: [
          {
            id: Date.now().toString(),
            type: "text",
            content: newProjectType === 'web' ? "Título principal" : "App Android TV",
            originalContent: newProjectType === 'web' ? "Título principal" : "App Android TV",
            position: { x: 50, y: 25 },
            styles: { 
              fontSize: newProjectType === 'web' ? "2rem" : "3rem", 
              color: newProjectType === 'web' ? "#333" : "#ffffff", 
              fontWeight: "bold" 
            }
          },
          {
            id: (Date.now() + 1).toString(),
            type: "text",
            content: newProjectType === 'web' ? "Subtítulo" : "Experiencia de usuario mejorada",
            originalContent: newProjectType === 'web' ? "Subtítulo" : "Experiencia de usuario mejorada",
            position: { x: 50, y: 40 },
            styles: { 
              fontSize: newProjectType === 'web' ? "1.2rem" : "1.5rem", 
              color: newProjectType === 'web' ? "#666" : "#cccccc" 
            }
          }
        ]
      };
      
      console.log('New project created:', newProject);
      setProjects(prev => [...prev, newProject]);
      setActiveProject(newProject);
      setShowAddProject(false);
      setNewProjectUrl("");
      setNewProjectName("");
      setNewProjectType("web");
      setIsLoadingProject(false);
      
      toast({
        title: "Proyecto cargado",
        description: `${newProjectName} se ha cargado exitosamente.`
      });
    }, 2000);
  };

  const handleLoadProjectFromFile = () => {
    projectFileInputRef.current?.click();
  };

  const handleProjectFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          let projectData;
          
          if (file.type === 'application/json' || file.name.endsWith('.json')) {
            projectData = JSON.parse(content);
          } else {
            // Simular extracción de otros formatos
            projectData = {
              name: file.name.replace(/\.[^/.]+$/, ""),
              type: "web",
              description: "Proyecto cargado desde archivo local",
              elements: []
            };
          }
          
          const newProject: WebProject = {
            id: Date.now().toString(),
            name: projectData.name || `Proyecto ${file.name}`,
            url: projectData.url || "",
            type: projectData.type || "web",
            description: projectData.description || "Proyecto cargado desde archivo local",
            isLoaded: true,
            isSaved: false,
            elements: projectData.elements || []
          };
          
          setProjects(prev => [...prev, newProject]);
          setActiveProject(newProject);
          
          toast({
            title: "Proyecto cargado",
            description: `${newProject.name} se ha cargado desde el archivo.`
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo cargar el archivo. Verifica el formato.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const deleteProject = (projectId: string) => {
    console.log('Deleting project:', projectId);
    
    setProjects(prev => prev.filter(p => p.id !== projectId));
    
    if (activeProject?.id === projectId) {
      const remainingProjects = projects.filter(p => p.id !== projectId);
      setActiveProject(remainingProjects.length > 0 ? remainingProjects[0] : null);
    }
    
    toast({
      title: "Proyecto eliminado",
      description: "El proyecto se ha eliminado de la lista."
    });
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
      ),
      isSaved: false
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
            backgroundImage: imageUrl,
            isSaved: false
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
              elements: [...activeProject.elements, newLogoElement],
              isSaved: false
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
            elements: [...activeProject.elements, newElement],
            isSaved: false
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
      elements: activeProject.elements.filter(el => el.id !== elementId),
      isSaved: false
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
      elements: [...activeProject.elements, newElement],
      isSaved: false
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
      border: selectedElement?.id === element.id ? '2px dashed #3b82f6' : '1px solid rgba(0,123,255,0.3)',
      padding: selectedElement?.id === element.id ? '4px' : '2px',
      backgroundColor: 'rgba(255,255,255,0.9)',
      zIndex: 10,
      borderRadius: '4px'
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
            <p className="text-muted-foreground">Editor visual y repositorio de plantillas para clientes</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowTemplates(true)}>
              <BookOpen className="h-4 w-4 mr-2" />
              Repositorio ({templates.length})
            </Button>
            <Button variant="outline" onClick={() => setShowAddProject(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Cargar desde URL
            </Button>
            <Button variant="outline" onClick={handleLoadProjectFromFile}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Cargar Archivo
            </Button>
            {activeProject && (
              <>
                <Button variant="outline" onClick={() => setShowSaveTemplate(true)}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Plantilla
                </Button>
                <Button className="bg-gradient-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </>
            )}
          </div>
          
          {/* Input oculto para cargar archivos */}
          <input
            ref={projectFileInputRef}
            type="file"
            accept=".json,.zip,.rar,.tar"
            onChange={handleProjectFileChange}
            className="hidden"
          />
        </div>

        {/* Lista de Proyectos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Proyectos Activos ({projects.length})
            </CardTitle>
            <CardDescription>
              Haz click en un proyecto para seleccionarlo y editarlo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    activeProject?.id === project.id ? 'border-primary bg-primary/5 shadow-md' : 'hover:border-primary/50'
                  }`}
                  onClick={() => setActiveProject(project)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{project.name}</h3>
                    <div className="flex items-center gap-1">
                      <Badge variant={project.isLoaded ? "default" : "secondary"}>
                        {project.isLoaded ? "Cargado" : "Pendiente"}
                      </Badge>
                      {!project.isSaved && project.isLoaded && (
                        <Badge variant="outline" className="text-xs">
                          Modificado
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
                            deleteProject(project.id);
                          }
                        }}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive ml-1"
                        title="Eliminar proyecto"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                    {project.type === 'web' ? (
                      <Globe className="h-3 w-3" />
                    ) : (
                      <Smartphone className="h-3 w-3" />
                    )}
                    <span className="text-xs text-muted-foreground truncate">{project.url || 'Proyecto local'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {project.elements.length} elementos • {project.type === 'web' ? 'Web' : 'Android TV'}
                    </span>
                    {project.templateId && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-2 w-2 mr-1" />
                        Plantilla
                      </Badge>
                    )}
                  </div>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
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

            {/* Simulador Web/Android TV */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {activeProject.type === 'web' ? (
                      <Globe className="h-5 w-5" />
                    ) : (
                      <Tv className="h-5 w-5" />
                    )}
                    Simulador {activeProject.type === 'web' ? 'Web' : 'Android TV'} - {activeProject.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={activeProject.type === 'web' ? 'default' : 'secondary'}>
                      {activeProject.type === 'web' ? 'Web App' : 'Android TV'}
                    </Badge>
                    <Badge variant="outline">
                      {activeProject.elements.length} elementos
                    </Badge>
                    {activeProject.templateId && (
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Plantilla
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => window.open(activeProject.url, '_blank')}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className={`relative border-2 border-dashed border-gray-300 w-full overflow-hidden transition-all ${
                    activeProject.type === 'web' 
                      ? 'aspect-[4/3] bg-white' 
                      : 'aspect-[16/9] bg-gradient-to-r from-gray-900 to-gray-700'
                  }`}
                  style={{
                    backgroundImage: activeProject.backgroundImage ? `url(${activeProject.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Simulador específico por tipo */}
                  {activeProject.type === 'android' && (
                    <>
                      {/* Barra de estado Android TV */}
                      <div className="absolute top-0 left-0 right-0 h-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
                        <div className="flex items-center justify-between px-4 h-full text-white/70 text-xs">
                          <span>Android TV</span>
                          <span>12:30 PM</span>
                        </div>
                      </div>
                      
                      {/* Indicadores de navegación Android TV */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center">
                          <div className="w-3 h-3 rounded bg-white/50" />
                        </div>
                        <div className="text-white/50 text-xs">Control remoto</div>
                      </div>
                    </>
                  )}
                  
                  {activeProject.type === 'web' && (
                    <>
                      {/* Barra de navegador web */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 border-b flex items-center px-4 gap-2">
                        <div className="flex gap-1">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-1 bg-white rounded px-2 py-1 text-xs text-gray-600">
                          {activeProject.url || 'localhost:3000'}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Grid de ayuda */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
                    top: activeProject.type === 'web' ? '32px' : '24px' 
                  }}>
                    <div className="w-full h-full" style={{
                      backgroundImage: `
                        linear-gradient(to right, ${activeProject.type === 'web' ? '#ccc' : '#fff'} 1px, transparent 1px),
                        linear-gradient(to bottom, ${activeProject.type === 'web' ? '#ccc' : '#fff'} 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  
                  {/* Elementos renderizados */}
                  <div className="absolute inset-0" style={{ 
                    top: activeProject.type === 'web' ? '32px' : '24px',
                    bottom: activeProject.type === 'android' ? '40px' : '0'
                  }}>
                    {activeProject.elements.map(element => renderPreviewElement(element))}
                  </div>
                  
                  {/* Indicador de área vacía */}
                  {activeProject.elements.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground" style={{
                      top: activeProject.type === 'web' ? '32px' : '24px',
                      bottom: activeProject.type === 'android' ? '40px' : '0'
                    }}>
                      <div className="text-center">
                        {activeProject.type === 'web' ? (
                          <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        ) : (
                          <Tv className="h-12 w-12 mx-auto mb-2 opacity-50 text-white/50" />
                        )}
                        <p className={activeProject.type === 'web' ? 'text-gray-500' : 'text-white/50'}>
                          Agrega elementos para comenzar a editar
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  Simulador {activeProject.type === 'web' ? 'Web Responsivo' : 'Android TV'} • 
                  Click en elementos para editarlos • 
                  Usa las herramientas de la izquierda
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dialog para repositorio de plantillas */}
        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Repositorio de Plantillas ({templates.length})
              </DialogTitle>
              <DialogDescription>
                Selecciona una plantilla para aplicar a un cliente
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => loadFromTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{template.name}</h3>
                    <div className="flex items-center gap-1">
                      {template.is_public && (
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          Público
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
                            deleteTemplate(template.id);
                          }
                        }}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {template.elements.length} elementos • {new Date(template.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            {templates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay plantillas guardadas</p>
                <p className="text-sm">Crea un proyecto y guárdalo como plantilla</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog para guardar plantilla */}
        <Dialog open={showSaveTemplate} onOpenChange={setShowSaveTemplate}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Guardar como Plantilla</DialogTitle>
              <DialogDescription>
                Guarda este proyecto en el repositorio para aplicarlo a otros clientes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Nombre de la plantilla *</Label>
                <Input
                  id="templateName"
                  placeholder="Plantilla Hotel Luxury"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateDescription">Descripción</Label>
                <Textarea
                  id="templateDescription"
                  placeholder="Plantilla moderna para hoteles de lujo..."
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateTags">Tags (separados por comas)</Label>
                <Input
                  id="templateTags"
                  placeholder="hotel, lujo, moderno"
                  value={templateTags}
                  onChange={(e) => setTemplateTags(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublicTemplate}
                  onChange={(e) => setIsPublicTemplate(e.target.checked)}
                />
                <Label htmlFor="isPublic">Hacer público (otros tenants pueden usarlo)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveTemplate(false)}>
                Cancelar
              </Button>
              <Button onClick={saveAsTemplate}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Plantilla
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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