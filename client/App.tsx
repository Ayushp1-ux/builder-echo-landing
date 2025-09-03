import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AskQuestion from "./pages/AskQuestion";
import Navbar from "./components/ui/Navbar";
import MyQuestions from "./pages/MyQuestion";
import LawyerDashboard from "./pages/LawyerDashboard";
import PrivateRoute from "./components/ui/PrivateRoute";
import AIAssistant from "./pages/AIAssistant";
import CourtNewsPage from "./pages/CourtNewsPage";  // Existing import
import CaseSearchPage from "./pages/CaseSearchPage"; // New import for case search

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />  {/* Show Navbar on all pages */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-questions" element={<MyQuestions />} />
          <Route path="/ask-question" element={<AskQuestion />} />

          {/* Wrap LawyerDashboard with PrivateRoute */}
          <Route
            path="/lawyer"
            element={
              <PrivateRoute>
                <LawyerDashboard />
              </PrivateRoute>
            }
          />

          {/* AI Assistant Route */}
          <Route path="/ai-assistant" element={<AIAssistant />} />

          {/* Court News Page Route */}
          <Route path="/court-news" element={<CourtNewsPage />} />

          {/* New Case Search Page Route */}
          <Route path="/case-search" element={<CaseSearchPage />} />

          {/* Catch-all Not Found Route */}
          <Route path="*" element={<NotFound />} />  
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

createRoot(document.getElementById("root")!).render(<App />);
