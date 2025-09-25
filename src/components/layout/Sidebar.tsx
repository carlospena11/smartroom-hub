import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Building2, 
  Store, 
  FolderOpen, 
  Calendar,
  Users,
  Key,
  Activity,
  Settings,
  Smartphone,
  Hotel,
  Bed,
  Monitor,
  Radio,
  CalendarDays,
  DollarSign,
  BookOpen,
  Star
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Contenidos",
    icon: FolderOpen,
    children: [
      {
        title: "Hoteles",
        icon: Hotel,
        children: [
          { title: "Gestión", icon: Building2, href: "/hotels" },
          { title: "Habitaciones", icon: Bed, href: "/rooms" },
        ]
      },
      {
        title: "Negocios",
        icon: Store,
        children: [
          { title: "Gestión", icon: Store, href: "/businesses" },
          { title: "Tótems", icon: Monitor, href: "/totems" },
          { title: "Publicidad", icon: Radio, href: "/advertising" },
          { title: "Eventos", icon: CalendarDays, href: "/events" },
        ]
      }
    ]
  },
  {
    title: "Biblioteca de Medios",
    icon: FolderOpen,
    href: "/media",
  },
  {
    title: "Campañas",
    icon: Calendar,
    href: "/campaigns",
  },
  {
    title: "CRM",
    icon: DollarSign,
    href: "/crm",
  },
  {
    title: "Usuarios",
    icon: Users,
    href: "/users",
  },
  {
    title: "API Keys",
    icon: Key,
    href: "/api-keys",
  },
  {
    title: "Auditoría",
    icon: Activity,
    href: "/audit",
  },
  {
    title: "Ajustes",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "Proyectos",
    icon: Smartphone,
    href: "/native-apps",
  },
];

interface ProjectTemplate {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  is_public: boolean;
  created_at: string;
}

export const Sidebar = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const location = useLocation();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('project_templates')
        .select('id, name, description, tags, is_public, created_at')
        .order('created_at', { ascending: false })
        .limit(5); // Solo mostrar las 5 más recientes

      if (error) throw error;
      
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const toggleExpanded = (title: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedItems(newExpanded);
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.title);
    const Icon = item.icon;
    const isActive = item.href && location.pathname === item.href;

    if (hasChildren) {
      return (
        <div key={item.title} className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-smooth",
              level > 0 && "ml-4 w-[calc(100%-1rem)]",
              level > 1 && "ml-8 w-[calc(100%-2rem)]"
            )}
            onClick={() => toggleExpanded(item.title)}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left text-sm">{item.title}</span>
            <div className={cn(
              "transition-transform duration-200",
              isExpanded && "rotate-90"
            )}>
              →
            </div>
          </Button>
          
          {isExpanded && (
            <div className="space-y-1">
              {item.children?.map(child => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.title} className="space-y-1">
        <Button
          variant="ghost"
          asChild
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-smooth",
            level > 0 && "ml-4 w-[calc(100%-1rem)]",
            level > 1 && "ml-8 w-[calc(100%-2rem)]",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
        >
          <Link to={item.href || "#"}>
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left text-sm">{item.title}</span>
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border shadow-elegant">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">SmartRoom</h1>
            <p className="text-xs text-sidebar-foreground/60">CMS</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navItems.map(item => renderNavItem(item))}
      </nav>
      
      {/* Sección de Plantillas Guardadas */}
      <div className="border-t border-sidebar-border">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-sidebar-foreground/60" />
            <span className="text-sm font-medium text-sidebar-foreground">Plantillas Guardadas</span>
            <Badge variant="outline" className="text-xs">
              {templates.length}
            </Badge>
          </div>
          
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {templates.length > 0 ? (
              templates.map((template) => (
                <Link
                  key={template.id}
                  to={`/native-apps?template=${template.id}`}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent transition-colors group"
                >
                  <Star className="h-3 w-3 text-sidebar-foreground/40 group-hover:text-sidebar-accent-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-sidebar-foreground/80 truncate">
                      {template.name}
                    </div>
                    {template.tags.length > 0 && (
                      <div className="text-xs text-sidebar-foreground/50 truncate">
                        {template.tags.slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>
                  {template.is_public && (
                    <Badge variant="secondary" className="text-xs px-1 h-4">
                      P
                    </Badge>
                  )}
                </Link>
              ))
            ) : (
              <div className="text-xs text-sidebar-foreground/50 text-center py-2">
                Sin plantillas
              </div>
            )}
          </div>
          
          {templates.length > 0 && (
            <Link
              to="/native-apps"
              className="text-xs text-sidebar-foreground/60 hover:text-sidebar-accent-foreground block text-center mt-2 py-1"
            >
              Ver todas →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};