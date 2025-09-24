import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  action: string;
  entity: string;
  entityName: string;
  timestamp: Date;
  type: "create" | "update" | "delete";
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    user: { name: "Admin User", initials: "AU" },
    action: "creó",
    entity: "Hotel",
    entityName: "Hotel Boutique Plaza",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: "create"
  },
  {
    id: "2", 
    user: { name: "Editor User", initials: "EU" },
    action: "actualizó",
    entity: "Habitación",
    entityName: "Suite Presidential 301",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    type: "update"
  },
  {
    id: "3",
    user: { name: "Content Manager", initials: "CM" },
    action: "subió",
    entity: "Media",
    entityName: "banner-promocional.jpg",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    type: "create"
  },
];

export const RecentActivity = () => {
  const getTypeColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "create":
        return "bg-tertiary/20 text-tertiary";
      case "update":
        return "bg-secondary/20 text-secondary-foreground";
      case "delete":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {activity.user.initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{activity.user.name}</span>
                <span className="text-sm text-muted-foreground">{activity.action}</span>
                <Badge variant="outline" className={getTypeColor(activity.type)}>
                  {activity.entity}
                </Badge>
              </div>
              
              <p className="text-sm font-medium text-foreground">
                {activity.entityName}
              </p>
              
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(activity.timestamp, { 
                  addSuffix: true, 
                  locale: es 
                })}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};