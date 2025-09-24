import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, DollarSign, FileText, Hotel, Calendar, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  hotel_id: string;
  hotel_name: string;
  hotel_telefono: string;
  responsable_administrativo: string;
  facturacion_nombre: string;
  nombre: string;
  descripcion: string;
  precio_unitario: number;
  cantidad_habitaciones: number;
  cantidad_tv: number;
  precio_total: number;
  tipo: "software" | "hardware" | "soporte" | "consultoria";
  status: "activo" | "suspendido" | "cancelado";
  fecha_inicio: string;
  fecha_caducidad: string;
  fecha_renovacion?: string;
}

interface Invoice {
  id: string;
  hotel_id: string;
  hotel_name: string;
  numero_factura: string;
  servicios: string[];
  monto_total: number;
  fecha_emision: string;
  fecha_vencimiento: string;
  status: "pendiente" | "pagada" | "vencida";
  metodo_pago?: string;
  fecha_pago?: string;
}

interface Payment {
  id: string;
  invoice_id: string;
  hotel_name: string;
  numero_factura: string;
  monto: number;
  fecha_pago: string;
  metodo_pago: "transferencia" | "tarjeta" | "efectivo" | "cheque";
  referencia?: string;
  notas?: string;
}

const CRM = () => {
  const { toast } = useToast();
  
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      hotel_id: "1",
      hotel_name: "Hotel Plaza Central",
      hotel_telefono: "+1-555-0123",
      responsable_administrativo: "María González",
      facturacion_nombre: "Hotel Plaza Central S.A.",
      nombre: "SmartRoom Basic",
      descripcion: "Gestión básica de contenido y dispositivos",
      precio_unitario: 50,
      cantidad_habitaciones: 45,
      cantidad_tv: 50,
      precio_total: 4750,
      tipo: "software",
      status: "activo",
      fecha_inicio: "2024-01-01",
      fecha_caducidad: "2024-12-31",
      fecha_renovacion: "2024-04-01"
    },
    {
      id: "2",
      hotel_id: "2", 
      hotel_name: "Resort Marina Bay",
      hotel_telefono: "+1-555-0456",
      responsable_administrativo: "Carlos Ruiz",
      facturacion_nombre: "Resort Marina Bay LLC",
      nombre: "SmartRoom Premium + Soporte",
      descripcion: "Gestión avanzada con soporte 24/7",
      precio_unitario: 75,
      cantidad_habitaciones: 60,
      cantidad_tv: 65,
      precio_total: 9375,
      tipo: "software",
      status: "activo",
      fecha_inicio: "2024-02-01",
      fecha_caducidad: "2024-12-31",
      fecha_renovacion: "2024-05-01"
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      hotel_id: "1",
      hotel_name: "Hotel Plaza Central",
      numero_factura: "INV-2024-001",
      servicios: ["SmartRoom Basic"],
      monto_total: 4750,
      fecha_emision: "2024-03-01",
      fecha_vencimiento: "2024-03-31",
      status: "pagada",
      metodo_pago: "transferencia",
      fecha_pago: "2024-03-15"
    },
    {
      id: "2",
      hotel_id: "2",
      hotel_name: "Resort Marina Bay",
      numero_factura: "INV-2024-002",
      servicios: ["SmartRoom Premium + Soporte"],
      monto_total: 9375,
      fecha_emision: "2024-03-01",
      fecha_vencimiento: "2024-03-31",
      status: "pendiente"
    }
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      invoice_id: "1",
      hotel_name: "Hotel Plaza Central",
      numero_factura: "INV-2024-001",
      monto: 4750,
      fecha_pago: "2024-03-15",
      metodo_pago: "transferencia",
      referencia: "TXN-240315-001",
      notas: "Pago mensual marzo 2024"
    }
  ]);

  const [activeTab, setActiveTab] = useState("services");
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const [serviceFormData, setServiceFormData] = useState({
    hotel_id: "1",
    hotel_telefono: "",
    responsable_administrativo: "",
    facturacion_nombre: "",
    nombre: "",
    descripcion: "",
    precio_unitario: "",
    cantidad_habitaciones: "",
    cantidad_tv: "",
    fecha_caducidad: "",
    tipo: "software" as Service["tipo"]
  });

  const [invoiceFormData, setInvoiceFormData] = useState({
    hotel_id: "1",
    servicios: [] as string[],
    fecha_vencimiento: ""
  });

  const [paymentFormData, setPaymentFormData] = useState({
    invoice_id: "",
    monto: "",
    metodo_pago: "transferencia" as Payment["metodo_pago"],
    referencia: "",
    notas: ""
  });

  const getServiceStatusBadge = (status: Service["status"]) => {
    const config = {
      activo: { label: "Activo", variant: "default" as const },
      suspendido: { label: "Suspendido", variant: "secondary" as const },
      cancelado: { label: "Cancelado", variant: "destructive" as const }
    };
    return config[status];
  };

  const getInvoiceStatusBadge = (status: Invoice["status"]) => {
    const config = {
      pendiente: { label: "Pendiente", variant: "secondary" as const },
      pagada: { label: "Pagada", variant: "default" as const },
      vencida: { label: "Vencida", variant: "destructive" as const }
    };
    return config[status];
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceFormData({
      hotel_id: service.hotel_id,
      hotel_telefono: service.hotel_telefono,
      responsable_administrativo: service.responsable_administrativo,
      facturacion_nombre: service.facturacion_nombre,
      nombre: service.nombre,
      descripcion: service.descripcion,
      precio_unitario: service.precio_unitario.toString(),
      cantidad_habitaciones: service.cantidad_habitaciones.toString(),
      cantidad_tv: service.cantidad_tv.toString(),
      fecha_caducidad: service.fecha_caducidad,
      tipo: service.tipo
    });
    setIsEditServiceDialogOpen(true);
  };

  const handleUpdateService = () => {
    if (!editingService) return;

    const precioUnitario = parseFloat(serviceFormData.precio_unitario);
    const cantidadHabitaciones = parseInt(serviceFormData.cantidad_habitaciones);
    const cantidadTv = parseInt(serviceFormData.cantidad_tv);
    const precioTotal = precioUnitario * (cantidadHabitaciones + cantidadTv);

    const updatedService: Service = {
      ...editingService,
      hotel_telefono: serviceFormData.hotel_telefono,
      responsable_administrativo: serviceFormData.responsable_administrativo,
      facturacion_nombre: serviceFormData.facturacion_nombre,
      nombre: serviceFormData.nombre,
      descripcion: serviceFormData.descripcion,
      precio_unitario: precioUnitario,
      cantidad_habitaciones: cantidadHabitaciones,
      cantidad_tv: cantidadTv,
      precio_total: precioTotal,
      fecha_caducidad: serviceFormData.fecha_caducidad,
      tipo: serviceFormData.tipo
    };

    setServices(services.map(s => s.id === editingService.id ? updatedService : s));
    setIsEditServiceDialogOpen(false);
    setEditingService(null);
    setServiceFormData({
      hotel_id: "1",
      hotel_telefono: "",
      responsable_administrativo: "",
      facturacion_nombre: "",
      nombre: "",
      descripcion: "",
      precio_unitario: "",
      cantidad_habitaciones: "",
      cantidad_tv: "",
      fecha_caducidad: "",
      tipo: "software"
    });
    
    toast({
      title: "Servicio actualizado",
      description: "El servicio ha sido actualizado exitosamente.",
    });
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
    
    toast({
      title: "Servicio eliminado",
      description: "El servicio ha sido eliminado exitosamente.",
    });
  };

  const handleCreateService = () => {
    const precioUnitario = parseFloat(serviceFormData.precio_unitario);
    const cantidadHabitaciones = parseInt(serviceFormData.cantidad_habitaciones);
    const cantidadTv = parseInt(serviceFormData.cantidad_tv);
    const precioTotal = precioUnitario * (cantidadHabitaciones + cantidadTv);

    const newService: Service = {
      id: Date.now().toString(),
      hotel_id: serviceFormData.hotel_id,
      hotel_name: serviceFormData.hotel_id === "1" ? "Hotel Plaza Central" : "Resort Marina Bay",
      hotel_telefono: serviceFormData.hotel_telefono,
      responsable_administrativo: serviceFormData.responsable_administrativo,
      facturacion_nombre: serviceFormData.facturacion_nombre,
      nombre: serviceFormData.nombre,
      descripcion: serviceFormData.descripcion,
      precio_unitario: precioUnitario,
      cantidad_habitaciones: cantidadHabitaciones,
      cantidad_tv: cantidadTv,
      precio_total: precioTotal,
      tipo: serviceFormData.tipo,
      status: "activo",
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_caducidad: serviceFormData.fecha_caducidad
    };

    setServices([...services, newService]);
    setIsServiceDialogOpen(false);
    setServiceFormData({
      hotel_id: "1",
      hotel_telefono: "",
      responsable_administrativo: "",
      facturacion_nombre: "",
      nombre: "",
      descripcion: "",
      precio_unitario: "",
      cantidad_habitaciones: "",
      cantidad_tv: "",
      fecha_caducidad: "",
      tipo: "software"
    });
    
    toast({
      title: "Servicio creado",
      description: "El servicio ha sido creado exitosamente.",
    });
  };

  const handleCreateInvoice = () => {
    const selectedServices = services.filter(s => 
      s.hotel_id === invoiceFormData.hotel_id && s.status === "activo"
    );
    const total = selectedServices.reduce((sum, s) => sum + s.precio_total, 0);

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      hotel_id: invoiceFormData.hotel_id,
      hotel_name: invoiceFormData.hotel_id === "1" ? "Hotel Plaza Central" : "Resort Marina Bay",
      numero_factura: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      servicios: selectedServices.map(s => s.nombre),
      monto_total: total,
      fecha_emision: new Date().toISOString().split('T')[0],
      fecha_vencimiento: invoiceFormData.fecha_vencimiento,
      status: "pendiente"
    };

    setInvoices([...invoices, newInvoice]);
    setIsInvoiceDialogOpen(false);
    setInvoiceFormData({
      hotel_id: "1",
      servicios: [],
      fecha_vencimiento: ""
    });
    
    toast({
      title: "Factura generada",
      description: "La factura ha sido generada exitosamente.",
    });
  };

  const handleCreatePayment = () => {
    const invoice = invoices.find(i => i.id === paymentFormData.invoice_id);
    if (!invoice) return;

    const newPayment: Payment = {
      id: Date.now().toString(),
      invoice_id: paymentFormData.invoice_id,
      hotel_name: invoice.hotel_name,
      numero_factura: invoice.numero_factura,
      monto: parseFloat(paymentFormData.monto),
      fecha_pago: new Date().toISOString().split('T')[0],
      metodo_pago: paymentFormData.metodo_pago,
      referencia: paymentFormData.referencia,
      notas: paymentFormData.notas
    };

    setPayments([...payments, newPayment]);
    
    // Update invoice status to paid
    setInvoices(invoices.map(inv => 
      inv.id === paymentFormData.invoice_id 
        ? { ...inv, status: "pagada" as const, fecha_pago: newPayment.fecha_pago, metodo_pago: newPayment.metodo_pago }
        : inv
    ));

    setIsPaymentDialogOpen(false);
    setPaymentFormData({
      invoice_id: "",
      monto: "",
      metodo_pago: "transferencia",
      referencia: "",
      notas: ""
    });
    
    toast({
      title: "Pago registrado",
      description: "El pago ha sido registrado exitosamente.",
    });
  };

  console.log("Invoices data:", invoices);
  console.log("Active tab:", activeTab);
  
  const totalMensualRecurrente = services
    .filter(s => s.status === "activo")
    .reduce((sum, s) => sum + s.precio_total, 0);

  const facturasPendientes = invoices.filter(i => i.status === "pendiente").length;
  const montoFacturasPendientes = invoices
    .filter(i => i.status === "pendiente")
    .reduce((sum, i) => sum + i.monto_total, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">CRM - Gestión Comercial</h1>
            <p className="text-muted-foreground">Administra servicios, facturas y pagos de hoteles</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${totalMensualRecurrente.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Recurrente mensual</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
              <Hotel className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {services.filter(s => s.status === "activo").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facturas Pendientes</CardTitle>
              <FileText className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{facturasPendientes}</div>
              <p className="text-xs text-muted-foreground">
                ${montoFacturasPendientes.toLocaleString()} por cobrar
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos del Mes</CardTitle>
              <CreditCard className="h-4 w-4 text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">
                {payments.filter(p => p.fecha_pago.startsWith("2024-03")).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="invoices">Facturas</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Servicios Contratados</CardTitle>
                    <CardDescription>Administra los servicios de cada hotel</CardDescription>
                  </div>
                  
                  <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Servicio
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Crear Nuevo Servicio</DialogTitle>
                        <DialogDescription>
                          Configura un nuevo servicio para un hotel
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="grid gap-2">
                          <Label htmlFor="service-hotel">Hotel</Label>
                          <Select value={serviceFormData.hotel_id} onValueChange={(value) => setServiceFormData({...serviceFormData, hotel_id: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Hotel Plaza Central</SelectItem>
                              <SelectItem value="2">Resort Marina Bay</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="service-name">Nombre del Servicio</Label>
                          <Input
                            id="service-name"
                            value={serviceFormData.nombre}
                            onChange={(e) => setServiceFormData({...serviceFormData, nombre: e.target.value})}
                            placeholder="SmartRoom Basic"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="service-desc">Descripción</Label>
                          <Textarea
                            id="service-desc"
                            value={serviceFormData.descripcion}
                            onChange={(e) => setServiceFormData({...serviceFormData, descripcion: e.target.value})}
                            placeholder="Describe el servicio..."
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="service-phone">Teléfono del Hotel</Label>
                          <Input
                            id="service-phone"
                            value={serviceFormData.hotel_telefono}
                            onChange={(e) => setServiceFormData({...serviceFormData, hotel_telefono: e.target.value})}
                            placeholder="+1-555-0123"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="service-admin">Responsable Administrativo</Label>
                          <Input
                            id="service-admin"
                            value={serviceFormData.responsable_administrativo}
                            onChange={(e) => setServiceFormData({...serviceFormData, responsable_administrativo: e.target.value})}
                            placeholder="María González"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="service-billing">Facturación a Nombre de</Label>
                          <Input
                            id="service-billing"
                            value={serviceFormData.facturacion_nombre}
                            onChange={(e) => setServiceFormData({...serviceFormData, facturacion_nombre: e.target.value})}
                            placeholder="Hotel Plaza Central S.A."
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="service-unit-price">Precio Unitario</Label>
                            <Input
                              id="service-unit-price"
                              type="number"
                              value={serviceFormData.precio_unitario}
                              onChange={(e) => setServiceFormData({...serviceFormData, precio_unitario: e.target.value})}
                              placeholder="50"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="service-expiry">Fecha Caducidad</Label>
                            <Input
                              id="service-expiry"
                              type="date"
                              value={serviceFormData.fecha_caducidad}
                              onChange={(e) => setServiceFormData({...serviceFormData, fecha_caducidad: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="service-rooms">Cantidad Habitaciones</Label>
                            <Input
                              id="service-rooms"
                              type="number"
                              value={serviceFormData.cantidad_habitaciones}
                              onChange={(e) => setServiceFormData({...serviceFormData, cantidad_habitaciones: e.target.value})}
                              placeholder="45"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="service-tvs">Cantidad TV/Dispositivos</Label>
                            <Input
                              id="service-tvs"
                              type="number"
                              value={serviceFormData.cantidad_tv}
                              onChange={(e) => setServiceFormData({...serviceFormData, cantidad_tv: e.target.value})}
                              placeholder="50"
                            />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="service-type">Tipo</Label>
                          <Select value={serviceFormData.tipo} onValueChange={(value: Service["tipo"]) => setServiceFormData({...serviceFormData, tipo: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="software">Software</SelectItem>
                              <SelectItem value="hardware">Hardware</SelectItem>
                              <SelectItem value="soporte">Soporte</SelectItem>
                              <SelectItem value="consultoria">Consultoría</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label>Precio Total Calculado</Label>
                          <div className="p-3 bg-muted rounded-md font-medium">
                            ${((parseFloat(serviceFormData.precio_unitario) || 0) * 
                               ((parseInt(serviceFormData.cantidad_habitaciones) || 0) + 
                                (parseInt(serviceFormData.cantidad_tv) || 0))).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateService} className="bg-gradient-primary">
                          Crear Servicio
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Service Dialog */}
                  <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Editar Servicio</DialogTitle>
                        <DialogDescription>
                          Modifica los datos del servicio
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-service-hotel">Hotel</Label>
                          <Select value={serviceFormData.hotel_id} onValueChange={(value) => setServiceFormData({...serviceFormData, hotel_id: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Hotel Plaza Central</SelectItem>
                              <SelectItem value="2">Resort Marina Bay</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="edit-service-name">Nombre del Servicio</Label>
                          <Input
                            id="edit-service-name"
                            value={serviceFormData.nombre}
                            onChange={(e) => setServiceFormData({...serviceFormData, nombre: e.target.value})}
                            placeholder="SmartRoom Basic"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="edit-service-desc">Descripción</Label>
                          <Textarea
                            id="edit-service-desc"
                            value={serviceFormData.descripcion}
                            onChange={(e) => setServiceFormData({...serviceFormData, descripcion: e.target.value})}
                            placeholder="Describe el servicio..."
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="edit-service-phone">Teléfono del Hotel</Label>
                          <Input
                            id="edit-service-phone"
                            value={serviceFormData.hotel_telefono}
                            onChange={(e) => setServiceFormData({...serviceFormData, hotel_telefono: e.target.value})}
                            placeholder="+1-555-0123"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="edit-service-admin">Responsable Administrativo</Label>
                          <Input
                            id="edit-service-admin"
                            value={serviceFormData.responsable_administrativo}
                            onChange={(e) => setServiceFormData({...serviceFormData, responsable_administrativo: e.target.value})}
                            placeholder="María González"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="edit-service-billing">Facturación a Nombre de</Label>
                          <Input
                            id="edit-service-billing"
                            value={serviceFormData.facturacion_nombre}
                            onChange={(e) => setServiceFormData({...serviceFormData, facturacion_nombre: e.target.value})}
                            placeholder="Hotel Plaza Central S.A."
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-service-unit-price">Precio Unitario</Label>
                            <Input
                              id="edit-service-unit-price"
                              type="number"
                              value={serviceFormData.precio_unitario}
                              onChange={(e) => setServiceFormData({...serviceFormData, precio_unitario: e.target.value})}
                              placeholder="50"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-service-expiry">Fecha Caducidad</Label>
                            <Input
                              id="edit-service-expiry"
                              type="date"
                              value={serviceFormData.fecha_caducidad}
                              onChange={(e) => setServiceFormData({...serviceFormData, fecha_caducidad: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-service-rooms">Cantidad Habitaciones</Label>
                            <Input
                              id="edit-service-rooms"
                              type="number"
                              value={serviceFormData.cantidad_habitaciones}
                              onChange={(e) => setServiceFormData({...serviceFormData, cantidad_habitaciones: e.target.value})}
                              placeholder="45"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-service-tvs">Cantidad TV/Dispositivos</Label>
                            <Input
                              id="edit-service-tvs"
                              type="number"
                              value={serviceFormData.cantidad_tv}
                              onChange={(e) => setServiceFormData({...serviceFormData, cantidad_tv: e.target.value})}
                              placeholder="50"
                            />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="edit-service-type">Tipo</Label>
                          <Select value={serviceFormData.tipo} onValueChange={(value: Service["tipo"]) => setServiceFormData({...serviceFormData, tipo: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="software">Software</SelectItem>
                              <SelectItem value="hardware">Hardware</SelectItem>
                              <SelectItem value="soporte">Soporte</SelectItem>
                              <SelectItem value="consultoria">Consultoría</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label>Precio Total Calculado</Label>
                          <div className="p-3 bg-muted rounded-md font-medium">
                            ${((parseFloat(serviceFormData.precio_unitario) || 0) * 
                               ((parseInt(serviceFormData.cantidad_habitaciones) || 0) + 
                                (parseInt(serviceFormData.cantidad_tv) || 0))).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditServiceDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleUpdateService} className="bg-gradient-primary">
                          Actualizar Servicio
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Responsable/Tel</TableHead>
                      <TableHead>Habitaciones/TV</TableHead>
                      <TableHead>Precio Total</TableHead>
                      <TableHead>Caducidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => {
                      const statusConfig = getServiceStatusBadge(service.status);
                      
                      return (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{service.hotel_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {service.facturacion_nombre}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{service.nombre}</div>
                              <div className="text-sm text-muted-foreground">{service.descripcion}</div>
                              <Badge variant="outline" className="mt-1">
                                {service.tipo}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{service.responsable_administrativo}</div>
                              <div className="text-sm text-muted-foreground">{service.hotel_telefono}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{service.cantidad_habitaciones} habitaciones</div>
                              <div className="text-sm text-muted-foreground">{service.cantidad_tv} TV/dispositivos</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">${service.precio_total.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">${service.precio_unitario}/unidad</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{service.fecha_caducidad}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(service.fecha_caducidad) > new Date() ? 'Vigente' : 'Vencido'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant}>
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditService(service)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteService(service.id)}
                              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Facturas</CardTitle>
                    <CardDescription>Gestiona las facturas de servicios</CardDescription>
                  </div>
                  
                  <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Factura
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Generar Nueva Factura</DialogTitle>
                        <DialogDescription>
                          Crea una factura para los servicios activos de un hotel
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="invoice-hotel">Hotel</Label>
                          <Select value={invoiceFormData.hotel_id} onValueChange={(value) => setInvoiceFormData({...invoiceFormData, hotel_id: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Hotel Plaza Central</SelectItem>
                              <SelectItem value="2">Resort Marina Bay</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="invoice-due">Fecha de Vencimiento</Label>
                          <Input
                            id="invoice-due"
                            type="date"
                            value={invoiceFormData.fecha_vencimiento}
                            onChange={(e) => setInvoiceFormData({...invoiceFormData, fecha_vencimiento: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label>Servicios a Facturar</Label>
                          <div className="text-sm text-muted-foreground">
                            Se incluirán automáticamente todos los servicios activos del hotel seleccionado
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateInvoice} className="bg-gradient-primary">
                          Generar Factura
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Servicios</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha Emisión</TableHead>
                      <TableHead>Vencimiento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                          No hay facturas registradas
                        </TableCell>
                      </TableRow>
                    ) : (
                      invoices.map((invoice) => {
                        console.log("Rendering invoice:", invoice);
                        const statusConfig = getInvoiceStatusBadge(invoice.status);
                        
                        return (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-mono">{invoice.numero_factura}</TableCell>
                            <TableCell>{invoice.hotel_name}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {invoice.servicios.join(", ")}
                              </div>
                            </TableCell>
                            <TableCell>${invoice.monto_total.toLocaleString()}</TableCell>
                            <TableCell>{invoice.fecha_emision}</TableCell>
                            <TableCell>{invoice.fecha_vencimiento}</TableCell>
                            <TableCell>
                              <Badge variant={statusConfig.variant}>
                                {statusConfig.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pagos Recibidos</CardTitle>
                    <CardDescription>Registra y gestiona los pagos de facturas</CardDescription>
                  </div>
                  
                  <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Registrar Pago
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Registrar Nuevo Pago</DialogTitle>
                        <DialogDescription>
                          Registra el pago de una factura pendiente
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="payment-invoice">Factura</Label>
                          <Select value={paymentFormData.invoice_id} onValueChange={(value) => setPaymentFormData({...paymentFormData, invoice_id: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una factura pendiente" />
                            </SelectTrigger>
                            <SelectContent>
                              {invoices.filter(inv => inv.status === "pendiente").map((invoice) => (
                                <SelectItem key={invoice.id} value={invoice.id}>
                                  {invoice.numero_factura} - {invoice.hotel_name} (${invoice.monto_total.toLocaleString()})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="payment-amount">Monto</Label>
                          <Input
                            id="payment-amount"
                            type="number"
                            value={paymentFormData.monto}
                            onChange={(e) => setPaymentFormData({...paymentFormData, monto: e.target.value})}
                            placeholder="0.00"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="payment-method">Método de Pago</Label>
                          <Select value={paymentFormData.metodo_pago} onValueChange={(value: Payment["metodo_pago"]) => setPaymentFormData({...paymentFormData, metodo_pago: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                              <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
                              <SelectItem value="efectivo">Efectivo</SelectItem>
                              <SelectItem value="cheque">Cheque</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="payment-reference">Referencia</Label>
                          <Input
                            id="payment-reference"
                            value={paymentFormData.referencia}
                            onChange={(e) => setPaymentFormData({...paymentFormData, referencia: e.target.value})}
                            placeholder="TXN-240320-001"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="payment-notes">Notas</Label>
                          <Textarea
                            id="payment-notes"
                            value={paymentFormData.notas}
                            onChange={(e) => setPaymentFormData({...paymentFormData, notas: e.target.value})}
                            placeholder="Notas adicionales del pago..."
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleCreatePayment} className="bg-gradient-primary">
                          Registrar Pago
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factura</TableHead>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Fecha Pago</TableHead>
                      <TableHead>Referencia</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono">{payment.numero_factura}</TableCell>
                        <TableCell>{payment.hotel_name}</TableCell>
                        <TableCell>${payment.monto.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.metodo_pago}
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.fecha_pago}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{payment.referencia}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CRM;