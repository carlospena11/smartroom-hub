import { ProjectElement, WebProject } from "../types/project";

interface AndroidTVPreviewProps {
  project: WebProject;
  selectedElement: ProjectElement | null;
  onElementClick: (element: ProjectElement) => void;
}

export const AndroidTVPreview = ({ project, selectedElement, onElementClick }: AndroidTVPreviewProps) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-lg overflow-hidden relative">
      {/* Android TV Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-black/30 flex items-center justify-between px-4 text-white text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Android TV</span>
        </div>
        <div className="flex items-center gap-3">
          <span>WiFi</span>
          <span>20:30</span>
        </div>
      </div>

      {/* Background Image */}
      {project.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${project.backgroundImage})` }}
        />
      )}

      {/* Content Area */}
      <div className="relative pt-8 h-full">
        {project.elements.map((element) => (
          <div
            key={element.id}
            className={`absolute cursor-pointer transition-all duration-200 ${
              selectedElement?.id === element.id 
                ? 'ring-4 ring-blue-400 ring-opacity-70 bg-blue-400/10' 
                : 'hover:ring-2 hover:ring-blue-300 hover:ring-opacity-50'
            }`}
            style={{
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
              transform: 'translate(-50%, -50%)',
              ...element.styles
            }}
            onClick={() => onElementClick(element)}
          >
            {element.type === 'text' ? (
              <div 
                className="text-white px-4 py-2 rounded-lg bg-black/20 backdrop-blur-sm"
                style={{
                  fontSize: element.styles.fontSize || '1rem',
                  color: element.styles.color || '#ffffff',
                  fontWeight: element.styles.fontWeight || 'normal'
                }}
              >
                {element.content}
              </div>
            ) : element.type === 'image' || element.type === 'logo' ? (
              <img
                src={element.content}
                alt="Elemento de imagen"
                className="rounded-lg shadow-lg"
                style={{
                  width: element.styles.width || '200px',
                  height: element.styles.height || 'auto',
                  maxWidth: '300px',
                  maxHeight: '200px',
                  objectFit: 'cover'
                }}
              />
            ) : null}
            
            {/* Element Type Indicator */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              {element.type === 'text' ? 'T' : 'I'}
            </div>
          </div>
        ))}

        {/* Android TV Navigation Hint */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/50 text-sm bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
          🎮 Navegación con control remoto Android TV
        </div>
      </div>

      {/* Element Count Info */}
      <div className="absolute top-10 left-4 text-white/80 text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
        {project.elements.length} elementos editables
      </div>
    </div>
  );
};