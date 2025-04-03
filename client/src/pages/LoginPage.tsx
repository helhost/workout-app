import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginLayout, LoginForm, SocialLogin } from "@/features/auth";
import { useAuth } from "@/features/auth/authContext";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, error: authError } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    // Handle login form submission
    const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
        if (isSubmitting) return; // Prevent double submission

        try {
            setIsSubmitting(true);
            setLoginError(null);

            // Call the login function from auth context
            await login(email, password, rememberMe);

            // Navigate to home page on successful login
            navigate("/");
        } catch (err) {
            // Error is already handled by auth context, but we can set our own message too
            setLoginError("Login failed. Please check your credentials and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Google login (not implemented yet)
    const handleGoogleLogin = () => {
        console.log("Google login clicked - Not implemented yet");
        // In production, you would authenticate via Google here
    };

    return (
        <LoginLayout>
            {/* Display any errors */}
            {(authError || loginError) && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {authError || loginError}
                </div>
            )}

            <LoginForm onSubmit={handleLogin} disabled={isSubmitting} />
            <SocialLogin onGoogleLogin={handleGoogleLogin} />
        </LoginLayout>
    );
}