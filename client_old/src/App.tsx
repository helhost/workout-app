import AppRoutes from "@/routes/AppRoutes"
import { AuthProvider } from '@/features/auth/authContext';
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  );
}

export default App;