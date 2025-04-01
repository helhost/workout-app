import { useNavigate } from "react-router-dom";
import { LoginLayout, LoginForm, SocialLogin } from "@/features/auth";

export default function LoginPage() {
    const navigate = useNavigate();

    // Mock login handler (non-functional)
    const handleLogin = (email: string, password: string, rememberMe: boolean) => {
        console.log("Login attempted with:", { email, password, rememberMe });
        // In a real app, you would authenticate the user here
        // For now, just navigate to home page
        navigate("/");
    };

    // Handle Google login
    const handleGoogleLogin = () => {
        console.log("Google login clicked");
        // In a real app, you would authenticate via Google here
        navigate("/");
    };

    return (
        <LoginLayout>
            <LoginForm onSubmit={handleLogin} />
            <SocialLogin onGoogleLogin={handleGoogleLogin} />
        </LoginLayout>
    );
}