import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Monitor, Upload, Download, FileCode, Image, Type, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditableElement {
  id: string;
  type: 'image' | 'text';
  content: string;
  originalContent: string;
  selector: string;
  tagName: string;
}

interface WebProject {
  id: string;
  name: string;
  files: FileList;
  elements: EditableElement[];
  htmlContent: string;
  projectFiles: { [filename: string]: File };
  imageUrls: { [filename: string]: string };
}

const NativeApps = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentProject, setCurrentProject] = useState<WebProject | null>(null);
  const [selectedElement, setSelectedElement] = useState<EditableElement | null>(null);
  const [editingElement, setEditingElement] = useState<EditableElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Leer archivo como texto
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsText(file);
    });
  };

  // Analizar archivos HTML y extraer elementos editables
  const parseProjectFiles = async (files: FileList): Promise<EditableElement[]> => {
    const elements: EditableElement[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        const content = await readFileAsText(file);
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        
        // Encontrar todas las imágenes
        const images = doc.querySelectorAll('img');
        images.forEach((img, index) => {
          elements.push({
            id: `img-${index}`,
            type: 'image',
            content: img.src || img.getAttribute('src') || '',
            originalContent: img.src || img.getAttribute('src') || '',
            selector: `img[src*="${img.getAttribute('src')?.split('/').pop()?.split('.')[0]}"]`,
            tagName: 'IMG'
          });
        });
        
        // Encontrar textos editables (h1-h6, p, span con texto)
        const textElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span');
        textElements.forEach((el, index) => {
          const text = el.textContent?.trim();
          if (text && text.length > 0) {
            elements.push({
              id: `text-${el.tagName.toLowerCase()}-${index}`,
              type: 'text',
              content: text,
              originalContent: text,
              selector: `${el.tagName.toLowerCase()}:nth-of-type(${index + 1})`,
              tagName: el.tagName
            });
          }
        });
      }
    }
    
    return elements;
  };

  // Cargar proyecto desde archivos
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    
    try {
      // Organizar archivos por tipo
      const projectFiles: { [filename: string]: File } = {};
      const imageUrls: { [filename: string]: string } = {};
      let htmlFile: File | null = null;
      let htmlContent = '';
      
      // Procesar todos los archivos
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        projectFiles[file.name] = file;
        
        // Identificar archivo HTML principal (index.html o el primero encontrado)
        if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
          if (file.name.toLowerCase().includes('index') || !htmlFile) {
            htmlFile = file;
            htmlContent = await readFileAsText(file);
          }
        }
        
        // Crear URLs locales para imágenes
        if (file.type.startsWith('image/') || /\.(png|jpe?g|gif|svg|webp)$/i.test(file.name)) {
          imageUrls[file.name] = URL.createObjectURL(file);
        }
      }
      
      if (!htmlFile) {
        toast({
          title: "Error",
          description: "Debes incluir al menos un archivo HTML (preferiblemente index.html)",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Procesar HTML y reemplazar rutas de imágenes con URLs locales
      let processedHTML = htmlContent;
      Object.keys(imageUrls).forEach(imageName => {
        const regex = new RegExp(`(src=["']?)([^"']*${imageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        processedHTML = processedHTML.replace(regex, `$1${imageUrls[imageName]}`);
      });
      
      const elements = await parseProjectFiles(files);
      
      // Actualizar elementos con URLs locales
      const updatedElements = elements.map(element => {
        if (element.type === 'image') {
          const imageName = element.content.split('/').pop();
          if (imageName && imageUrls[imageName]) {
            return {
              ...element,
              content: imageUrls[imageName]
            };
          }
        }
        return element;
      });
      
      const project: WebProject = {
        id: Date.now().toString(),
        name: htmlFile.name.replace(/\.(html|htm)$/, ''),
        files,
        elements: updatedElements,
        htmlContent: processedHTML,
        projectFiles,
        imageUrls
      };
      
      setCurrentProject(project);
      
      toast({
        title: "Proyecto cargado exitosamente",
        description: `${Object.keys(projectFiles).length} archivos cargados, ${updatedElements.length} elementos editables`
      });
      
    } catch (error) {
      toast({
        title: "Error al cargar proyecto",
        description: "Verifica que los archivos sean válidos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar elemento
  const updateElement = (elementId: string, newContent: string) => {
    if (!currentProject) return;
    
    const updatedElements = currentProject.elements.map(el => 
      el.id === elementId ? { ...el, content: newContent } : el
    );
    
    setCurrentProject({
      ...currentProject,
      elements: updatedElements
    });
    
    setEditingElement(null);
    
    toast({
      title: "Elemento actualizado",
      description: "Los cambios se han guardado"
    });
  };

  // Descargar proyecto modificado como ZIP
  const downloadProject = async () => {
    if (!currentProject) return;
    
    try {
      // Crear una copia del HTML con los cambios aplicados
      let modifiedHTML = currentProject.htmlContent;
      
      currentProject.elements.forEach(element => {
        if (element.content !== element.originalContent) {
          if (element.type === 'image') {
            // Para imágenes, restaurar la ruta original
            const originalImageName = element.originalContent.split('/').pop();
            if (originalImageName) {
              const regex = new RegExp(`src=["']${element.content}["']`, 'g');
              modifiedHTML = modifiedHTML.replace(regex, `src="${originalImageName}"`);
            }
          } else {
            // Reemplazar contenido de texto
            modifiedHTML = modifiedHTML.replace(
              new RegExp(`>${element.originalContent}<`, 'g'),
              `>${element.content}<`
            );
          }
        }
      });
      
      // Crear y descargar proyecto completo
      const zip = new (window as any).JSZip();
      
      // Agregar HTML modificado
      const htmlFileName = Object.keys(currentProject.projectFiles).find(name => 
        name.endsWith('.html') || name.endsWith('.htm')
      ) || 'index.html';
      zip.file(htmlFileName, modifiedHTML);
      
      // Agregar todos los demás archivos
      for (const [filename, file] of Object.entries(currentProject.projectFiles)) {
        if (!filename.endsWith('.html') && !filename.endsWith('.htm')) {
          const content = await file.arrayBuffer();
          zip.file(filename, content);
        }
      }
      
      // Generar y descargar ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject.name}-android-tv.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Proyecto descargado",
        description: "El proyecto completo se ha descargado como ZIP"
      });
    } catch (error) {
      // Fallback: descargar solo HTML
      let modifiedHTML = currentProject.htmlContent;
      
      currentProject.elements.forEach(element => {
        if (element.content !== element.originalContent && element.type === 'text') {
          modifiedHTML = modifiedHTML.replace(
            new RegExp(`>${element.originalContent}<`, 'g'),
            `>${element.content}<`
          );
        }
      });
      
      const blob = new Blob([modifiedHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject.name}-android-tv.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "HTML descargado",
        description: "El archivo HTML modificado se ha descargado (ZIP no disponible)"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Editor Web para Android TV</h1>
            <p className="text-muted-foreground mt-1">
              Carga tu proyecto web y edita imágenes y textos para hoteles Android TV
            </p>
          </div>
          {currentProject && (
            <Button onClick={downloadProject} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Descargar Proyecto
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de carga */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Cargar Proyecto
                </CardTitle>
                <CardDescription>
                  Selecciona todos los archivos de tu proyecto web (HTML, CSS, JS, imágenes)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    {isLoading ? "Cargando..." : "Seleccionar Archivos"}
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html,.htm,.css,.js,.png,.jpg,.jpeg,.gif,.svg,.webp,.ico,.woff,.woff2,.ttf"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lista de elementos editables */}
            {currentProject && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    Elementos Editables ({currentProject.elements.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {currentProject.elements.map((element) => (
                    <div
                      key={element.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedElement?.id === element.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedElement(element)}
                    >
                      <div className="flex items-center gap-2">
                        {element.type === 'image' ? (
                          <Image className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Type className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm font-medium">
                          {element.type === 'image' ? 'Imagen' : 'Texto'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {element.type === 'image' 
                          ? element.content.split('/').pop() || 'imagen'
                          : element.content
                        }
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Navegador Web - Android TV */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Navegador Web - Android TV
                </CardTitle>
                <CardDescription>
                  {currentProject 
                    ? `${currentProject.name} - Vista completa del proyecto web`
                    : "Sube un proyecto para ver la vista previa del navegador"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-lg overflow-hidden relative" style={{ height: '700px' }}>
                  {/* Android TV Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-black/30 flex items-center justify-between px-4 text-white text-xs z-20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Android TV Browser</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>WiFi</span>
                      <span>20:30</span>
                    </div>
                  </div>

                  {/* Browser Navigation Bar */}
                  <div className="absolute top-8 left-0 right-0 h-10 bg-white/10 backdrop-blur-sm flex items-center px-4 z-20">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <div className="ml-4 bg-white/20 px-3 py-1 rounded-full text-xs flex-1 max-w-md">
                        🌐 {currentProject?.name || 'proyecto'}.html
                      </div>
                    </div>
                  </div>

                  {/* Web Content Area */}
                  <div className="absolute top-18 left-2 right-2 bottom-2">
                    {currentProject ? (
                      <div className="h-full w-full bg-white rounded-lg overflow-hidden relative shadow-2xl">
                        <iframe
                          srcDoc={currentProject.htmlContent}
                          className="w-full h-full border-0"
                          style={{ 
                            width: '100%',
                            height: '100%',
                            minHeight: '600px'
                          }}
                          sandbox="allow-scripts allow-same-origin allow-forms"
                          title="Vista previa del proyecto web"
                          onLoad={(e) => {
                            const iframe = e.target as HTMLIFrameElement;
                            try {
                              const doc = iframe.contentDocument || iframe.contentWindow?.document;
                              if (doc) {
                                // Ajustar el viewport del contenido
                                const viewport = doc.querySelector('meta[name="viewport"]');
                                if (!viewport) {
                                  const meta = doc.createElement('meta');
                                  meta.name = 'viewport';
                                  meta.content = 'width=device-width, initial-scale=1.0';
                                  doc.head.appendChild(meta);
                                }
                                
                                // Aplicar estilos responsivos
                                const style = doc.createElement('style');
                                style.textContent = `
                                  body { 
                                    margin: 0 !important; 
                                    padding: 20px !important;
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                                    line-height: 1.6 !important;
                                    overflow-x: hidden !important;
                                  }
                                  * { 
                                    max-width: 100% !important; 
                                    box-sizing: border-box !important;
                                  }
                                  img { 
                                    height: auto !important; 
                                    object-fit: contain !important;
                                  }
                                  .container, .wrapper { 
                                    max-width: 100% !important; 
                                    margin: 0 auto !important;
                                  }
                                `;
                                doc.head.appendChild(style);
                              }
                            } catch (error) {
                              console.log('No se pudo acceder al contenido del iframe');
                            }
                          }}
                        />
                        
                        {/* Element Selection Overlay */}
                        <div className="absolute inset-0 pointer-events-none">
                          {selectedElement && (
                            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm z-10 shadow-lg">
                              ✏️ {selectedElement.type === 'image' ? 'Imagen' : 'Texto'} seleccionado
                              <div className="text-xs mt-1 opacity-80">
                                {selectedElement.type === 'image' 
                                  ? selectedElement.content.split('/').pop()?.slice(0, 20) + '...'
                                  : selectedElement.content.slice(0, 30) + '...'
                                }
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Zoom Controls */}
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                          <button 
                            className="bg-black/50 text-white p-2 rounded-lg text-xs hover:bg-black/70 transition-colors"
                            onClick={() => {
                              const iframe = document.querySelector('iframe');
                              if (iframe) {
                                const currentScale = parseFloat(iframe.style.transform.replace(/[^0-9.]/g, '') || '1');
                                const newScale = Math.min(currentScale + 0.1, 2);
                                iframe.style.transform = `scale(${newScale})`;
                                iframe.style.transformOrigin = 'top left';
                              }
                            }}
                          >
                            🔍+
                          </button>
                          <button 
                            className="bg-black/50 text-white p-2 rounded-lg text-xs hover:bg-black/70 transition-colors"
                            onClick={() => {
                              const iframe = document.querySelector('iframe');
                              if (iframe) {
                                const currentScale = parseFloat(iframe.style.transform.replace(/[^0-9.]/g, '') || '1');
                                const newScale = Math.max(currentScale - 0.1, 0.5);
                                iframe.style.transform = `scale(${newScale})`;
                                iframe.style.transformOrigin = 'top left';
                              }
                            }}
                          >
                            🔍-
                          </button>
                          <button 
                            className="bg-black/50 text-white p-2 rounded-lg text-xs hover:bg-black/70 transition-colors"
                            onClick={() => {
                              const iframe = document.querySelector('iframe');
                              if (iframe) {
                                iframe.style.transform = 'scale(1)';
                                iframe.style.transformOrigin = 'top left';
                              }
                            }}
                          >
                            🎯
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-white">
                          <FileCode className="h-20 w-20 text-white/30 mx-auto mb-6" />
                          <h3 className="text-2xl font-medium text-white/80 mb-3">
                            Sin proyecto cargado
                          </h3>
                          <p className="text-white/60 text-lg">
                            Carga tu proyecto web para ver la vista previa completa
                          </p>
                          <div className="mt-6 text-white/50 text-sm space-y-1">
                            <p>✓ Carga HTML, CSS, JS e imágenes</p>
                            <p>✓ Vista previa en tiempo real</p>
                            <p>✓ Edición de elementos visuales</p>
                            <p>✓ Zoom y navegación completa</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  {currentProject && (
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
                      📁 {Object.keys(currentProject.projectFiles).length} archivos • 
                      ✏️ {currentProject.elements.length} elementos editables
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Editor de elemento */}
        {selectedElement && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedElement.type === 'image' ? (
                  <Image className="h-5 w-5" />
                ) : (
                  <Type className="h-5 w-5" />
                )}
                Editar {selectedElement.type === 'image' ? 'Imagen' : 'Texto'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Contenido actual:</Label>
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      {selectedElement.type === 'image' ? (
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          <span className="text-sm">{selectedElement.content.split('/').pop()}</span>
                        </div>
                      ) : (
                        <p className="text-sm">{selectedElement.content}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="new-content">
                      {selectedElement.type === 'image' ? 'Nueva URL de imagen:' : 'Nuevo texto:'}
                    </Label>
                    <Input
                      id="new-content"
                      value={editingElement?.content || selectedElement.content}
                      onChange={(e) => setEditingElement({
                        ...selectedElement,
                        content: e.target.value
                      })}
                      placeholder={selectedElement.type === 'image' 
                        ? 'https://ejemplo.com/imagen.jpg' 
                        : 'Nuevo texto aquí...'
                      }
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => updateElement(
                        selectedElement.id, 
                        editingElement?.content || selectedElement.content
                      )}
                      disabled={!editingElement}
                    >
                      Guardar Cambios
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedElement(null);
                        setEditingElement(null);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Vista previa:</Label>
                  <div className="mt-2 p-4 bg-slate-900 rounded-lg text-white">
                    {selectedElement.type === 'image' ? (
                      <div className="w-full h-32 bg-white/10 rounded flex items-center justify-center">
                        <img 
                          src={editingElement?.content || selectedElement.content}
                          alt="Preview" 
                          className="max-w-full max-h-full object-contain rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <p className="text-lg">
                        {editingElement?.content || selectedElement.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NativeApps;