import { useNavigate } from "react-router-dom";
import { AuthLayout, RegisterForm, SocialLogin } from "@/features/auth";

export default function RegisterPage() {
    const navigate = useNavigate();

    // Mock registration handler (non-functional)
    const handleRegister = (name: string, email: string, password: string, agreeToTerms: boolean) => {
        console.log("Registration attempted with:", { name, email, password, agreeToTerms });
        // In production, you would register the user here
        // For now, just navigate to home page
        navigate("/");
    };

    // Handle Google sign up
    const handleGoogleSignUp = () => {
        console.log("Google sign up clicked");
        // In production, you would authenticate via Google here
        navigate("/");
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle={
                <>
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        onClick={() => navigate("/login")}
                    >
                        Sign in
                    </button>
                </>
            }
        >
            <RegisterForm onSubmit={handleRegister} />
            <SocialLogin onGoogleLogin={handleGoogleSignUp} registerMode={true} />
        </AuthLayout>
    );
}