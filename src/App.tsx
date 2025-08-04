// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "@/contexts/AuthContext";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import LoginForm from "@/components/auth/LoginForm";
// import SignupForm from "@/components/auth/SignupForm";
// import Dashboard from "@/pages/Dashboard";
// import VerificationHistory from "@/pages/VerificationHistory";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <AuthProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
//             {/* Redirect root to dashboard for authenticated users, login for unauthenticated */}
//             <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
//             {/* Authentication Routes */}
//             <Route path="/login" element={<LoginForm />} />
//             <Route path="/signup" element={<SignupForm />} />
            
//             {/* Protected Routes */}
//             <Route path="/dashboard" element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             } />
//             <Route path="/history" element={
//               <ProtectedRoute>
//                 <VerificationHistory />
//               </ProtectedRoute>
//             } />
            
//             {/* Catch-all route */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </AuthProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;




import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import Dashboard from "@/pages/Dashboard";
import VerificationHistory from "@/pages/VerificationHistory";
import NotFound from "./pages/NotFound";
import PrescriptionDetail from "@/pages/PrescriptionDetail"; // ✅ Imported

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to dashboard for authenticated users, login for unauthenticated */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <VerificationHistory />
              </ProtectedRoute>
            } />

            {/* ✅ New Prescription Detail Route */}
            <Route path="/prescription/:id" element={
              <ProtectedRoute>
                <PrescriptionDetail />
              </ProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
