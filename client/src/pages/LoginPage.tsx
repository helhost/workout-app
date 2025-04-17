import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm, SocialLogin } from "@/features/auth";
import { LoginLayout } from "@/features/auth";
import { useAuth } from "@/features/auth/authContext";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, error: authError } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    // Handle login form submission
    const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        setLoginError(null);

        try {
            await login(email, password, rememberMe, () => {
                navigate("/");
            });
        } catch (err) {
            console.error("LoginPage: Error caught:", err);
            if (err instanceof Error) {
                setLoginError(err.message);
            } else {
                setLoginError("An unexpected error occurred during login");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Google login (not implemented yet)
    const handleGoogleLogin = () => {
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