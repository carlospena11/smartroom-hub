import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Globe, Upload, Download, Save, BookOpen, Trash2, FileCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProjectManager } from "@/components/project/ProjectManager";
import { WebProject, ProjectElement, ProjectTemplate, ProjectType } from "@/components/types/project";

// Demo projects
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
        id: "demo-logo-1",
        type: "logo",
        content: "/placeholder.svg",
        originalContent: "/placeholder.svg",
        position: { x: 15, y: 15 },
        styles: { width: "120px", height: "60px" }
      }
    ]
  }
];

const NativeApps = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  
  const [projects, setProjects] = useState<WebProject[]>(demoProjects);
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [activeProject, setActiveProject] = useState<WebProject | null>(demoProjects[0]);
  const [selectedElement, setSelectedElement] = useState<ProjectElement | null>(null);
  const [isEditingElement, setIsEditingElement] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateTags, setTemplateTags] = useState("");
  const [isPublicTemplate, setIsPublicTemplate] = useState(false);
  const [showProjectUploader, setShowProjectUploader] = useState(false);

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
      
      const formattedTemplates: ProjectTemplate[] = (data || []).map(template => ({
        ...template,
        elements: Array.isArray(template.elements) ? template.elements as unknown as ProjectElement[] : [],
        description: template.description || "",
        url: template.url || ""
      }));
      
      setTemplates(formattedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const parseHTMLContent = (htmlContent: string): ProjectElement[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const elements: ProjectElement[] = [];
    
    const images = doc.querySelectorAll('img');
    images.forEach((img, index) => {
      elements.push({
        id: `img-${index}`,
        type: 'image',
        content: img.src || '/placeholder.svg',
        originalContent: img.src || '/placeholder.svg',
        selector: `img:nth-of-type(${index + 1})`,
        position: { x: 20 + (index % 3) * 30, y: 20 + Math.floor(index / 3) * 20 },
        styles: {
          width: img.width ? `${img.width}px` : '200px',
          height: img.height ? `${img.height}px` : 'auto'
        }
      });
    });
    
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      elements.push({
        id: `heading-${index}`,
        type: 'text',
        content: heading.textContent || 'Título',
        originalContent: heading.textContent || 'Título',
        selector: `${heading.tagName.toLowerCase()}:nth-of-type(${index + 1})`,
        position: { x: 10, y: 10 + index * 15 },
        styles: {
          fontSize: heading.tagName === 'H1' ? '2.5rem' : heading.tagName === 'H2' ? '2rem' : '1.5rem',
          color: '#1e40af',
          fontWeight: 'bold'
        }
      });
    });
    
    return elements;
  };

  const handleProjectFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoadingProject(true);
    
    const processFiles = async () => {
      try {
        let htmlContent = '';
        const allFiles = Array.from(files);
        let projectName = 'Proyecto Web';

        for (const file of allFiles) {
          const reader = new FileReader();
          const content = await new Promise<string>((resolve) => {
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsText(file);
          });

          if (file.name.endsWith('.html')) {
            htmlContent = content;
            projectName = file.name.replace('.html', '');
          }
        }

        const elements = htmlContent ? parseHTMLContent(htmlContent) : [
          {
            id: 'default-title',
            type: 'text' as const,
            content: 'Título Principal',
            originalContent: 'Título Principal',
            position: { x: 50, y: 25 },
            styles: { fontSize: '2.5rem', color: '#1e40af', fontWeight: 'bold' }
          }
        ];

        const newProject: WebProject = {
          id: Date.now().toString(),
          name: projectName,
          url: '',
          type: 'android',
          description: `Proyecto web cargado para Android TV - ${allFiles.length} archivo(s)`,
          isLoaded: true,
          isSaved: false,
          elements,
          htmlContent,
          originalFiles: allFiles
        };

        setProjects(prev => [...prev, newProject]);
        setActiveProject(newProject);
        setIsLoadingProject(false);
        
        toast({
          title: "Proyecto cargado exitosamente",
          description: `${projectName} listo para editar en Android TV. Elementos detectados: ${elements.length}`
        });
        
      } catch (error) {
        console.error('Error loading project:', error);
        toast({
          title: "Error al cargar proyecto",
          description: "Verifica que los archivos sean HTML, CSS o JS válidos.",
          variant: "destructive"
        });
        setIsLoadingProject(false);
      }
    };

    processFiles();
  };

  const deleteProject = (projectId: string) => {
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
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        toast({
          title: "Error de autenticación",
          description: "Debes estar autenticado para guardar plantillas.",
          variant: "destructive"
        });
        return;
      }

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
          elements: activeProject.elements as any,
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
      type: "android",
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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Editor de Proyectos para Android TV</h1>
            <p className="text-gray-600 mt-1">
              Carga proyectos web existentes y edita solo imágenes y textos para hoteles Android TV
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowTemplates(true)}>
              <BookOpen className="h-4 w-4 mr-2" />
              Templates ({templates.length})
            </Button>
            {activeProject && (
              <Button variant="outline" onClick={() => setShowSaveTemplate(true)}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Template
              </Button>
            )}
          </div>
        </div>

        <ProjectManager
          projects={projects}
          activeProject={activeProject}
          selectedElement={selectedElement}
          isEditingElement={isEditingElement}
          isLoadingProject={isLoadingProject}
          showProjectUploader={showProjectUploader}
          onProjectSelect={setActiveProject}
          onProjectDelete={deleteProject}
          onElementClick={handleElementClick}
          onElementUpdate={handleUpdateElement}
          onFilesUpload={handleProjectFileChange}
          onCloseEditor={() => {
            setSelectedElement(null);
            setIsEditingElement(false);
          }}
          onToggleUploader={() => setShowProjectUploader(!showProjectUploader)}
        />

        {/* Dialogs */}
        <input
          ref={projectFileInputRef}
          type="file"
          accept=".html,.css,.js,.htm"
          multiple
          onChange={handleProjectFileChange}
          className="hidden"
        />

        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Repositorio de Plantillas ({templates.length})
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card key={template.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                        <CardDescription className="text-xs mt-1 line-clamp-2">
                          {template.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => loadFromTemplate(template)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Cargar Plantilla
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showSaveTemplate} onOpenChange={setShowSaveTemplate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Guardar como Plantilla</DialogTitle>
              <DialogDescription>
                Guarda el proyecto actual como plantilla reutilizable
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Nombre de la plantilla *</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Mi plantilla de hotel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-description">Descripción</Label>
                <Textarea
                  id="template-description"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Plantilla para aplicaciones de hotel Android TV..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-tags">Tags (separados por comas)</Label>
                <Input
                  id="template-tags"
                  value={templateTags}
                  onChange={(e) => setTemplateTags(e.target.value)}
                  placeholder="hotel, android tv, hospitalidad"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveTemplate(false)}>
                Cancelar
              </Button>
              <Button onClick={saveAsTemplate} disabled={!templateName}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Plantilla
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default NativeApps;