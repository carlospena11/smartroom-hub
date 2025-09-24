import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  DollarSign, 
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp
} from "lucide-react";

// Mock CRM data
const crmData = {
  stats: {
    clients: { total: 47, trend: { value: 15.8, isPositive: true } },
    monthlyRevenue: { total: 186750, trend: { value: 23.4, isPositive: true } },
    activeServices: { total: 142, trend: { value: 18.7, isPositive: true } },
    invoices: { pending: 8, overdue: 2, paid: 65 }
  },
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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-xl p-8 text-primary-foreground shadow-glow">
        <h1 className="text-3xl font-bold mb-2">Resumen CRM</h1>
        <p className="text-lg opacity-90">
          Gestiona clientes, servicios y facturación desde un solo lugar
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
            <Building2 className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <FileText className="h-4 w-4 mr-2" />
            Crear Factura
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Total Clientes"
          value={crmData.stats.clients.total}
          icon={Users}
          description="Clientes activos"
          trend={crmData.stats.clients.trend}
          variant="primary"
        />
        
        <StatsCard
          title="Ingresos Mensuales"
          value={`$${crmData.stats.monthlyRevenue.total.toLocaleString()}`}
          icon={DollarSign}
          description="Facturación recurrente"
          trend={crmData.stats.monthlyRevenue.trend}
          variant="secondary"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Servicios Activos"
          value={crmData.stats.activeServices.total}
          icon={CheckCircle}
          description="Servicios contratados"
          trend={crmData.stats.activeServices.trend}
        />
        
        <StatsCard
          title="Facturas Pendientes"
          value={crmData.stats.invoices.pending}
          icon={Clock}
          description={`${crmData.stats.invoices.overdue} vencidas`}
        />
        
        <StatsCard
          title="Facturas Pagadas"
          value={crmData.stats.invoices.paid}
          icon={TrendingUp}
          description="Este mes"
          trend={{ value: 15.2, isPositive: true }}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
};