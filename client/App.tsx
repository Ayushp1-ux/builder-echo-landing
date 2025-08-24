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
import MyQuestions from "./pages/MyQuestion";         // Corrected import name
import LawyerDashboard from "./pages/LawyerDashboard";
import PrivateRoute from "./components/ui/PrivateRoute";  // Import PrivateRoute
import AIAssistant from "./pages/AIAssistant";           // Import the new AI Assistant page

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

          {/* Wrap LawyerDashboard with PrivateRoute to protect it */}
          <Route
            path="/lawyer"
            element={
              <PrivateRoute>
                <LawyerDashboard />
              </PrivateRoute>
            }
          />

          {/* New AI Assistant Route */}
          <Route path="/ai-assistant" element={<AIAssistant />} />

          <Route path="*" element={<NotFound />} />          {/* Correct "*" */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

createRoot(document.getElementById("root")!).render(<App />);
