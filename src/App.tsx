import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@/hooks/useAuth";
import Index from "./pages/Index";
import StokieCircles from "./pages/StokieCircles";
import CircleDetail from "./pages/CircleDetail";
import YuteAcademy from "./pages/YuteAcademy";
import LearningPathDetail from "./pages/LearningPathDetail";
import CoursePlayer from "./pages/CoursePlayer";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/stokie-circles" element={<StokieCircles />} />
            <Route 
              path="/circles/:circleId" 
              element={
                <ProtectedRoute>
                  <CircleDetail />
                </ProtectedRoute>
              } 
            />
            <Route path="/academy" element={<YuteAcademy />} />
            <Route 
              path="/academy/path/:pathId" 
              element={<LearningPathDetail />} 
            />
            <Route 
              path="/academy/course/:courseId" 
              element={
                <ProtectedRoute>
                  <CoursePlayer />
                </ProtectedRoute>
              } 
            />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
