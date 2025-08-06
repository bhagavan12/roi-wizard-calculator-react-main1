
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { LandingPage } from "@/components/LandingPage";
import { ROICalculator } from "@/components/ROICalculator";
import { DatabasePage } from "@/components/DatabasePage";
import NotFound from "./pages/NotFound";
import Bot from "@/components/Bot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen">
          <Navbar />
          <Bot />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/calculator" element={<ROICalculator />} />
            <Route path="/database" element={<DatabasePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
