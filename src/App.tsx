import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Hotels from "./pages/Hotels";
import Rooms from "./pages/Rooms";
import CRM from "./pages/CRM";
import Totems from "./pages/Totems";
import Advertising from "./pages/Advertising";
import Events from "./pages/Events";
import Media from "./pages/Media";
import Campaigns from "./pages/Campaigns";
import Users from "./pages/Users";
import ApiKeys from "./pages/ApiKeys";
import Audit from "./pages/Audit";
import Settings from "./pages/Settings";
import NativeApps from "./pages/NativeApps";
import Businesses from "./pages/Businesses";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <AuthGuard>
                <Index />
              </AuthGuard>
            } />
            <Route path="/hotels" element={
              <AuthGuard>
                <Hotels />
              </AuthGuard>
            } />
            <Route path="/rooms" element={
              <AuthGuard>
                <Rooms />
              </AuthGuard>
            } />
            <Route path="/crm" element={
              <AuthGuard>
                <CRM />
              </AuthGuard>
            } />
            <Route path="/totems" element={
              <AuthGuard>
                <Totems />
              </AuthGuard>
            } />
            <Route path="/advertising" element={
              <AuthGuard>
                <Advertising />
              </AuthGuard>
            } />
            <Route path="/events" element={
              <AuthGuard>
                <Events />
              </AuthGuard>
            } />
            <Route path="/media" element={
              <AuthGuard>
                <Media />
              </AuthGuard>
            } />
            <Route path="/campaigns" element={
              <AuthGuard>
                <Campaigns />
              </AuthGuard>
            } />
            <Route path="/users" element={
              <AuthGuard>
                <Users />
              </AuthGuard>
            } />
            <Route path="/api-keys" element={
              <AuthGuard>
                <ApiKeys />
              </AuthGuard>
            } />
            <Route path="/audit" element={
              <AuthGuard>
                <Audit />
              </AuthGuard>
            } />
            <Route path="/settings" element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            } />
            <Route path="/native-apps" element={
              <AuthGuard>
                <NativeApps />
              </AuthGuard>
            } />
            <Route path="/businesses" element={
              <AuthGuard>
                <Businesses />
              </AuthGuard>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
