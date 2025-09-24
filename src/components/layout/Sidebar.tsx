import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  DollarSign
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
    title: "Apps Nativas",
    icon: Smartphone,
    href: "/native-apps",
  },
];

export const Sidebar = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const location = useLocation();

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
    </div>
  );
};