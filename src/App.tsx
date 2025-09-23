import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { MainLayout } from "./components/layout/MainLayout";
import Leads from "./pages/Leads";
import Calculator from "./pages/Calculator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/leads" element={<MainLayout><Leads /></MainLayout>} />
          <Route path="/calculator" element={<MainLayout><Calculator /></MainLayout>} />
          <Route path="/properties" element={<MainLayout><div className="p-6"><h1 className="text-2xl font-bold">Properties</h1><p className="text-muted-foreground">Coming soon...</p></div></MainLayout>} />
          <Route path="/clients" element={<MainLayout><div className="p-6"><h1 className="text-2xl font-bold">Clients</h1><p className="text-muted-foreground">Coming soon...</p></div></MainLayout>} />
          <Route path="/reports" element={<MainLayout><div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p className="text-muted-foreground">Coming soon...</p></div></MainLayout>} />
          <Route path="/calendar" element={<MainLayout><div className="p-6"><h1 className="text-2xl font-bold">Calendar</h1><p className="text-muted-foreground">Coming soon...</p></div></MainLayout>} />
          <Route path="/documents" element={<MainLayout><div className="p-6"><h1 className="text-2xl font-bold">Documents</h1><p className="text-muted-foreground">Coming soon...</p></div></MainLayout>} />
          <Route path="/data-import" element={<MainLayout><div className="p-6"><h1 className="text-2xl font-bold">Data Import</h1><p className="text-muted-foreground">Coming soon...</p></div></MainLayout>} />
          <Route path="/ai-chat" element={<MainLayout><div className="p-6"><h1 className="text-2xl font-bold">AI Assistant</h1><p className="text-muted-foreground">Coming soon...</p></div></MainLayout>} />
          <Route path="/settings" element={<MainLayout><div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div></MainLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
