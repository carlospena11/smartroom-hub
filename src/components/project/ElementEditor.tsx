import { useState, useEffect } from "react";
import { ProjectElement } from "../types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Type, Image, Palette, Move, Save, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ElementEditorProps {
  element: ProjectElement;
  onUpdate: (element: ProjectElement) => void;
  onClose: () => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export const ElementEditor = ({ element, onUpdate, onClose, onImageUpload }: ElementEditorProps) => {
  const { toast } = useToast();
  const [editedElement, setEditedElement] = useState<ProjectElement>(element);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    setEditedElement(element);
  }, [element]);

  const handleSave = () => {
    onUpdate(editedElement);
    onClose();
    toast({
      title: "Elemento actualizado",
      description: "Los cambios se han guardado correctamente."
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    
    try {
      if (onImageUpload) {
        const imageUrl = await onImageUpload(file);
        setEditedElement(prev => ({
          ...prev,
          content: imageUrl
        }));
      } else {
        // Fallback: usar FileReader para preview local
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setEditedElement(prev => ({
            ...prev,
            content: imageUrl
          }));
        };
        reader.readAsDataURL(file);
      }
      
      toast({
        title: "Imagen cargada",
        description: "La imagen se ha actualizado correctamente."
      });
    } catch (error) {
      toast({
        title: "Error al cargar imagen",
        description: "No se pudo cargar la imagen. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const fontSizes = [
    { label: "Muy pequeño", value: "0.75rem" },
    { label: "Pequeño", value: "1rem" },
    { label: "Mediano", value: "1.25rem" },
    { label: "Grande", value: "1.5rem" },
    { label: "Muy grande", value: "2rem" },
    { label: "Enorme", value: "3rem" }
  ];

  const colors = [
    { label: "Blanco", value: "#ffffff" },
    { label: "Negro", value: "#000000" },
    { label: "Azul", value: "#1e40af" },
    { label: "Verde", value: "#059669" },
    { label: "Rojo", value: "#dc2626" },
    { label: "Amarillo", value: "#d97706" },
    { label: "Gris", value: "#6b7280" }
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          {element.type === 'text' ? <Type className="h-4 w-4" /> : <Image className="h-4 w-4" />}
          Editar {element.type === 'text' ? 'Texto' : 'Imagen'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="style">Estilo</TabsTrigger>
            <TabsTrigger value="position">Posición</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            {element.type === 'text' ? (
              <div className="space-y-2">
                <Label htmlFor="text-content">Texto</Label>
                <Textarea
                  id="text-content"
                  value={editedElement.content}
                  onChange={(e) => setEditedElement(prev => ({
                    ...prev,
                    content: e.target.value
                  }))}
                  placeholder="Ingresa el texto..."
                  rows={3}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Imagen actual</Label>
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={editedElement.content}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image-upload">Cambiar imagen</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                    />
                    {isUploadingImage && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image-url">O URL de imagen</Label>
                  <Input
                    id="image-url"
                    value={editedElement.content}
                    onChange={(e) => setEditedElement(prev => ({
                      ...prev,
                      content: e.target.value
                    }))}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="style" className="space-y-4">
            {element.type === 'text' && (
              <>
                <div className="space-y-2">
                  <Label>Tamaño de fuente</Label>
                  <Select
                    value={editedElement.styles.fontSize || "1rem"}
                    onValueChange={(value) => setEditedElement(prev => ({
                      ...prev,
                      styles: { ...prev.styles, fontSize: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map(size => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Select
                    value={editedElement.styles.color || "#ffffff"}
                    onValueChange={(value) => setEditedElement(prev => ({
                      ...prev,
                      styles: { ...prev.styles, color: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: color.value }}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="width">Ancho</Label>
                <Input
                  id="width"
                  value={editedElement.styles.width || "auto"}
                  onChange={(e) => setEditedElement(prev => ({
                    ...prev,
                    styles: { ...prev.styles, width: e.target.value }
                  }))}
                  placeholder="200px"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Alto</Label>
                <Input
                  id="height"
                  value={editedElement.styles.height || "auto"}
                  onChange={(e) => setEditedElement(prev => ({
                    ...prev,
                    styles: { ...prev.styles, height: e.target.value }
                  }))}
                  placeholder="auto"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="position" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="pos-x">Posición X (%)</Label>
                <Input
                  id="pos-x"
                  type="number"
                  min="0"
                  max="100"
                  value={editedElement.position.x}
                  onChange={(e) => setEditedElement(prev => ({
                    ...prev,
                    position: { ...prev.position, x: parseInt(e.target.value) || 0 }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pos-y">Posición Y (%)</Label>
                <Input
                  id="pos-y"
                  type="number"
                  min="0"
                  max="100"
                  value={editedElement.position.y}
                  onChange={(e) => setEditedElement(prev => ({
                    ...prev,
                    position: { ...prev.position, y: parseInt(e.target.value) || 0 }
                  }))}
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>• X: 0% = izquierda, 100% = derecha</p>
              <p>• Y: 0% = arriba, 100% = abajo</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};