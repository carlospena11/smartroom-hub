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
  nombre: string;
  descripcion: string;
  precio_mensual: number;
  tipo: "software" | "hardware" | "soporte" | "consultoria";
  status: "activo" | "suspendido" | "cancelado";
  fecha_inicio: string;
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
      nombre: "SmartRoom Basic",
      descripcion: "Gestión básica de contenido y dispositivos",
      precio_mensual: 2500,
      tipo: "software",
      status: "activo",
      fecha_inicio: "2024-01-01",
      fecha_renovacion: "2024-04-01"
    },
    {
      id: "2",
      hotel_id: "2",
      hotel_name: "Resort Marina Bay",
      nombre: "SmartRoom Premium + Soporte",
      descripcion: "Gestión avanzada con soporte 24/7",
      precio_mensual: 4500,
      tipo: "software",
      status: "activo",
      fecha_inicio: "2024-02-01",
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
      monto_total: 2500,
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
      monto_total: 4500,
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
      monto: 2500,
      fecha_pago: "2024-03-15",
      metodo_pago: "transferencia",
      referencia: "TXN-240315-001",
      notas: "Pago mensual marzo 2024"
    }
  ]);

  const [activeTab, setActiveTab] = useState("services");
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  const [serviceFormData, setServiceFormData] = useState({
    hotel_id: "1",
    nombre: "",
    descripcion: "",
    precio_mensual: "",
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

  const handleCreateService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      hotel_id: serviceFormData.hotel_id,
      hotel_name: serviceFormData.hotel_id === "1" ? "Hotel Plaza Central" : "Resort Marina Bay",
      nombre: serviceFormData.nombre,
      descripcion: serviceFormData.descripcion,
      precio_mensual: parseFloat(serviceFormData.precio_mensual),
      tipo: serviceFormData.tipo,
      status: "activo",
      fecha_inicio: new Date().toISOString().split('T')[0]
    };

    setServices([...services, newService]);
    setIsServiceDialogOpen(false);
    setServiceFormData({
      hotel_id: "1",
      nombre: "",
      descripcion: "",
      precio_mensual: "",
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
    const total = selectedServices.reduce((sum, s) => sum + s.precio_mensual, 0);

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

  const totalMensualRecurrente = services
    .filter(s => s.status === "activo")
    .reduce((sum, s) => sum + s.precio_mensual, 0);

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
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Crear Nuevo Servicio</DialogTitle>
                        <DialogDescription>
                          Configura un nuevo servicio para un hotel
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
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
                          <Label htmlFor="service-price">Precio Mensual</Label>
                          <Input
                            id="service-price"
                            type="number"
                            value={serviceFormData.precio_mensual}
                            onChange={(e) => setServiceFormData({...serviceFormData, precio_mensual: e.target.value})}
                            placeholder="2500"
                          />
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
                </div>
              </CardHeader>
              
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Precio Mensual</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => {
                      const statusConfig = getServiceStatusBadge(service.status);
                      
                      return (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.hotel_name}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{service.nombre}</div>
                              <div className="text-sm text-muted-foreground">{service.descripcion}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {service.tipo}
                            </Badge>
                          </TableCell>
                          <TableCell>${service.precio_mensual.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant}>
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{service.fecha_inicio}</TableCell>
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
                    {invoices.map((invoice) => {
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
                            {invoice.status === "pendiente" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setPaymentFormData({
                                    ...paymentFormData,
                                    invoice_id: invoice.id,
                                    monto: invoice.monto_total.toString()
                                  });
                                  setIsPaymentDialogOpen(true);
                                }}
                              >
                                Registrar Pago
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
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

          <TabsContent value="payments">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Pagos Recibidos</CardTitle>
                <CardDescription>Historial de pagos de facturas</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factura</TableHead>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha Pago</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Referencia</TableHead>
                      <TableHead>Notas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono">{payment.numero_factura}</TableCell>
                        <TableCell>{payment.hotel_name}</TableCell>
                        <TableCell>${payment.monto.toLocaleString()}</TableCell>
                        <TableCell>{payment.fecha_pago}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.metodo_pago}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{payment.referencia}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{payment.notas}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Registration Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Registrar Pago</DialogTitle>
              <DialogDescription>
                Registra el pago recibido de una factura
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="payment-amount">Monto</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  value={paymentFormData.monto}
                  onChange={(e) => setPaymentFormData({...paymentFormData, monto: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="payment-method">Método de Pago</Label>
                <Select value={paymentFormData.metodo_pago} onValueChange={(value: Payment["metodo_pago"]) => setPaymentFormData({...paymentFormData, metodo_pago: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
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
    </DashboardLayout>
  );
};

export default CRM;