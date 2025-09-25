export interface ProjectElement {
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

export type ProjectType = 'web' | 'android';

export interface WebProject {
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
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  originalFiles?: File[];
}

export interface ProjectTemplate {
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