import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import { AuthProvider } from "@/hooks/useAuth";
import { EditModeProvider } from "@/contexts/EditModeContext";
import DomainsPage from "./pages/DomainsPage";
import CompetencesPage from "./pages/CompetencesPage";
import ReferencesPage from "./pages/ReferencesPage";
import { useAppColors } from "@/hooks/useAppColors";
import { hexToHsl } from "@/lib/colorUtils";
import { useEffect } from "react";

export const queryClient = new QueryClient(); // Export queryClient

const AppContent = () => {
  const { appColors, loading: colorsLoading } = useAppColors();

  useEffect(() => {
    if (appColors) {
      const root = document.documentElement;

      // Set primary color variables
      const primaryHsl = hexToHsl(appColors.primary_color_hex);
      if (primaryHsl) {
        root.style.setProperty('--app-primary-hue', primaryHsl.h.toString());
        root.style.setProperty('--app-primary-saturation', `${primaryHsl.s}%`);
        root.style.setProperty('--app-primary-lightness', `${primaryHsl.l}%`);
      }

      // Set secondary color variables
      const secondaryHsl = hexToHsl(appColors.secondary_color_hex);
      if (secondaryHsl) {
        root.style.setProperty('--app-secondary-hue', secondaryHsl.h.toString());
        root.style.setProperty('--app-secondary-saturation', `${secondaryHsl.s}%`);
        root.style.setProperty('--app-secondary-lightness', `${secondaryHsl.l}%`);
      }
    }
  }, [appColors]);

  if (colorsLoading) {
    // Optionally render a loading spinner or placeholder while colors are fetched
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const primaryColorHex = appColors?.primary_color_hex || '#FF7F00'; // Get the color here

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index primaryColorHex={primaryColorHex} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/domaines" element={<DomainsPage />} />
          <Route path="/competences" element={<CompetencesPage />} />
          <Route path="/references" element={<ReferencesPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <EditModeProvider>
        <AppContent />
      </EditModeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;