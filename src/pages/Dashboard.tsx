import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  DollarSign, 
  Bed,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  Calendar as CalendarIcon,
  Monitor
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, parseISO } from "date-fns";

// Mock CRM data
const crmData = {
  stats: {
    hotels: { total: 47, trend: { value: 15.8, isPositive: true } },
    rooms: { total: 1248, trend: { value: 12.3, isPositive: true } },
    activeServices: { total: 142, trend: { value: 18.7, isPositive: true } },
    monthlyRevenue: { total: 186750, trend: { value: 23.4, isPositive: true } },
    invoices: { pending: 8, overdue: 2, paid: 65 }
  },
  platformExpirations: [
    { platform: "Netflix", hotel: "Hotel Plaza Premium", expirationDate: "2024-02-15", status: "active" },
    { platform: "Amazon Prime", hotel: "Resort Costa Azul", expirationDate: "2024-02-20", status: "warning" },
    { platform: "HBO Max", hotel: "Hotel Boutique Garden", expirationDate: "2024-02-28", status: "active" },
    { platform: "Disney+", hotel: "Centro Comercial Norte", expirationDate: "2024-03-05", status: "critical" },
    { platform: "YouTube Premium", hotel: "Complejo Turístico Sol", expirationDate: "2024-03-12", status: "active" },
    { platform: "Spotify", hotel: "Hotel Plaza Premium", expirationDate: "2024-03-18", status: "warning" },
  ],
  recentInvoices: [
    { id: "INV-2024-067", client: "Hotel Plaza Premium", amount: 12500, status: "paid", dueDate: "2024-01-15" },
    { id: "INV-2024-068", client: "Resort Costa Azul", amount: 18900, status: "pending", dueDate: "2024-01-25" },
    { id: "INV-2024-069", client: "Centro Comercial Norte", amount: 7800, status: "overdue", dueDate: "2024-01-10" },
    { id: "INV-2024-070", client: "Hotel Boutique Garden", amount: 15600, status: "paid", dueDate: "2024-01-18" },
    { id: "INV-2024-071", client: "Complejo Turístico Sol", amount: 22400, status: "pending", dueDate: "2024-01-28" },
  ]
};

export const Dashboard = () => {
  const getInvoiceStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-tertiary" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-tertiary/20 text-tertiary">Pagada</Badge>;
      case "pending":
        return <Badge className="bg-warning/20 text-warning-foreground">Pendiente</Badge>;
      case "overdue":
        return <Badge variant="destructive">Vencida</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getPlatformStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-tertiary/20 text-tertiary";
      case "warning":
        return "bg-warning/20 text-warning-foreground";
      case "critical":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getExpirationsForDate = (date: Date) => {
    return crmData.platformExpirations.filter(exp => 
      isSameDay(parseISO(exp.expirationDate), date)
    );
  };

  const hasExpirations = (date: Date) => {
    return getExpirationsForDate(date).length > 0;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Hoteles"
          value={crmData.stats.hotels.total}
          icon={Building2}
          description="Hoteles registrados"
          trend={crmData.stats.hotels.trend}
          variant="primary"
        />
        
        <StatsCard
          title="Total Habitaciones"
          value={crmData.stats.rooms.total}
          icon={Bed}
          description="Habitaciones configuradas"
          trend={crmData.stats.rooms.trend}
          variant="secondary"
        />

        <StatsCard
          title="Servicios Activos"
          value={crmData.stats.activeServices.total}
          icon={CheckCircle}
          description="Servicios contratados"
          trend={crmData.stats.activeServices.trend}
        />
      </div>

      {/* Stats Grid - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Facturas Pagadas"
          value={crmData.stats.invoices.paid}
          icon={CheckCircle}
          description="Este mes"
          trend={{ value: 15.2, isPositive: true }}
        />
        
        <StatsCard
          title="Facturas Pendientes"
          value={crmData.stats.invoices.pending}
          icon={Clock}
          description={`${crmData.stats.invoices.overdue} vencidas`}
        />
        
        <StatsCard
          title="Ingresos Mensuales"
          value={`$${crmData.stats.monthlyRevenue.total.toLocaleString()}`}
          icon={DollarSign}
          description="Facturación recurrente"
          trend={crmData.stats.monthlyRevenue.trend}
          variant="primary"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Facturas Recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {crmData.recentInvoices.map((invoice, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                <div className="flex items-center gap-3">
                  {getInvoiceStatusIcon(invoice.status)}
                  <div>
                    <p className="font-medium text-foreground">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{invoice.client}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${invoice.amount.toLocaleString()}</p>
                  {getInvoiceStatusBadge(invoice.status)}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              Ver Todas las Facturas
            </Button>
          </CardContent>
        </Card>

        {/* Platform Expirations Calendar */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Vencimiento de Plataformas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              className="rounded-md border p-3 pointer-events-auto"
              modifiers={{
                hasExpiration: (date) => hasExpirations(date)
              }}
              modifiersStyles={{
                hasExpiration: {
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))',
                  fontWeight: 'bold'
                }
              }}
            />
            
            {/* Platform expiration list */}
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Próximos Vencimientos:</h4>
              {crmData.platformExpirations.slice(0, 3).map((exp, index) => (
                <div key={index} className="flex justify-between items-center text-xs p-2 rounded border">
                  <div>
                    <span className="font-medium">{exp.platform}</span>
                    <div className="text-muted-foreground">{exp.hotel}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground">{format(parseISO(exp.expirationDate), 'dd/MM')}</div>
                    <Badge className={getPlatformStatusColor(exp.status)} variant="outline">
                      {exp.status === 'critical' ? 'Crítico' : exp.status === 'warning' ? 'Alerta' : 'Activo'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
};