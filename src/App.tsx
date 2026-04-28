import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import WheelAppLayout from "@/pages/wheel/WheelAppLayout";
import WheelPlayground from "@/pages/wheel/WheelPlayground";
import { CognizoShapeApp, CognizoFractionApp, CognizoSlowpokeApp } from "@/pages/wheel/WheelSubRoutes";
import YouTubeIndex from "@/pages/youtube/YouTubeIndex";
import YouTubePostPage from "@/pages/youtube/YouTubePost";
import AdminCMS from "@/pages/admin/AdminCMS";
import { SiteFooter } from "@/components/site/SiteFooter";

const queryClient = new QueryClient();

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={routerFuture}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/youtube" element={<YouTubeIndex />} />
            <Route path="/youtube/:slug" element={<YouTubePostPage />} />
            <Route path="/admin" element={<AdminCMS />} />
            <Route path="/wheel" element={<WheelAppLayout />}>
              <Route index element={<WheelPlayground />} />
              <Route path="shape" element={<CognizoShapeApp />} />
              <Route path="fraction" element={<CognizoFractionApp />} />
              <Route path="slowpoke" element={<CognizoSlowpokeApp />} />
              <Route path="sponge" element={<Navigate to="/wheel/slowpoke" replace />} />
            </Route>
            {/* Legacy paths → new wheel sub-routes */}
            <Route path="/shape/*" element={<Navigate to="/wheel/shape" replace />} />
            <Route path="/fraction/*" element={<Navigate to="/wheel/fraction" replace />} />
            <Route path="/sponge/*" element={<Navigate to="/wheel/slowpoke" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SiteFooter />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
