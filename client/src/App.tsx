import AppRoutes from "@/routes/AppRoutes"
import { AuthProvider } from '@/features/auth/authContext';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;