import { WebProject, ProjectElement } from "../types/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Smartphone, Trash2, Eye, FileCode, Layers, Upload } from "lucide-react";
import { ProjectFileUploader } from "./ProjectFileUploader";
import { AndroidTVPreview } from "./AndroidTVPreview";
import { ElementEditor } from "./ElementEditor";
import { useState } from "react";

interface ProjectManagerProps {
  projects: WebProject[];
  activeProject: WebProject | null;
  selectedElement: ProjectElement | null;
  isEditingElement: boolean;
  isLoadingProject: boolean;
  showProjectUploader: boolean;
  onProjectSelect: (project: WebProject) => void;
  onProjectDelete: (projectId: string) => void;
  onElementClick: (element: ProjectElement) => void;
  onElementUpdate: (element: ProjectElement) => void;
  onFilesUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCloseEditor: () => void;
  onToggleUploader: () => void;
}

export const ProjectManager = ({
  projects,
  activeProject,
  selectedElement,
  isEditingElement,
  isLoadingProject,
  showProjectUploader,
  onProjectSelect,
  onProjectDelete,
  onElementClick,
  onElementUpdate,
  onFilesUpload,
  onCloseEditor,
  onToggleUploader
}: ProjectManagerProps) => {
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Panel de Proyectos */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Proyectos</h2>
          <Button onClick={onToggleUploader} size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Cargar
          </Button>
        </div>

        {showProjectUploader && (
          <ProjectFileUploader
            onFilesSelected={onFilesUpload}
            isLoading={isLoadingProject}
          />
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {projects.map((project) => (
            <Card
              key={project.id}
              className={`cursor-pointer transition-colors ${
                activeProject?.id === project.id 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onProjectSelect(project)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {project.type === 'android' ? (
                        <Smartphone className="h-4 w-4 text-green-600" />
                      ) : (
                        <Monitor className="h-4 w-4 text-blue-600" />
                      )}
                      <h3 className="font-medium text-sm">{project.name}</h3>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {project.elements.length} elementos
                      </Badge>
                      <Badge 
                        variant={project.type === 'android' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {project.type === 'android' ? 'Android TV' : 'Web'}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onProjectDelete(project.id);
                    }}
                    className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview del Proyecto */}
      <div className="lg:col-span-2">
        {activeProject ? (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview - {activeProject.name}
              </CardTitle>
              <CardDescription>
                Vista previa optimizada para Android TV. Haz clic en cualquier elemento para editarlo.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video w-full">
                <AndroidTVPreview
                  project={activeProject}
                  selectedElement={selectedElement}
                  onElementClick={onElementClick}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center">
              <FileCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No hay proyecto seleccionado
              </h3>
              <p className="text-gray-500 mb-4">
                Carga un proyecto web para comenzar a editarlo
              </p>
              <Button onClick={onToggleUploader}>
                <Upload className="h-4 w-4 mr-2" />
                Cargar Proyecto
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Editor de Elementos */}
      <div className="lg:col-span-1">
        {isEditingElement && selectedElement ? (
          <ElementEditor
            element={selectedElement}
            onUpdate={onElementUpdate}
            onClose={onCloseEditor}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Editor
              </CardTitle>
              <CardDescription>
                Selecciona un elemento en el preview para editarlo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeProject && (
                <div className="space-y-4">
                  <div className="text-sm">
                    <p><strong>Proyecto:</strong> {activeProject.name}</p>
                    <p><strong>Tipo:</strong> {activeProject.type === 'android' ? 'Android TV' : 'Web'}</p>
                    <p><strong>Elementos:</strong> {activeProject.elements.length}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Elementos disponibles:</h4>
                    <div className="space-y-1">
                      {activeProject.elements.map((element) => (
                        <Button
                          key={element.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-2"
                          onClick={() => onElementClick(element)}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs truncate">
                              {element.type === 'text' 
                                ? element.content.substring(0, 30) + (element.content.length > 30 ? '...' : '')
                                : `Imagen ${element.id}`
                              }
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};