import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileCode, Layers, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectFileUploaderProps {
  onFilesSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export const ProjectFileUploader = ({ onFilesSelected, isLoading }: ProjectFileUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const input = fileInputRef.current;
      if (input) {
        input.files = files;
        onFilesSelected({ target: input } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Cargar Proyecto Web para Android TV
          </CardTitle>
          <CardDescription>
            Sube tus archivos HTML, CSS y JS existentes. El sistema detectará automáticamente las imágenes y textos editables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="min-h-32 flex flex-col items-center justify-center p-8 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Arrastra tus archivos aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Archivos soportados: HTML, CSS, JS
                </p>
              </div>
            </div>
            
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Procesando archivos...</span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".html,.css,.js,.htm"
            onChange={onFilesSelected}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Instrucciones detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <FileCode className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Archivos HTML</h3>
            </div>
            <p className="text-sm text-blue-700">
              Estructura principal de tu página web. Se detectarán automáticamente títulos, párrafos e imágenes.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Layers className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-green-900">Estilos CSS</h3>
            </div>
            <p className="text-sm text-green-700">
              Los estilos se mantienen intactos. Solo editarás el contenido, no el diseño.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium text-purple-900">Para Android TV</h3>
            </div>
            <p className="text-sm text-purple-700">
              Optimizado para pantallas de hotel con navegación por control remoto.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};