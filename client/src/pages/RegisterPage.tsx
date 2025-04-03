import { useNavigate } from "react-router-dom";
import { AuthLayout, RegisterForm, SocialLogin } from "@/features/auth";
import { useAuth } from "@/features/auth/authContext";
import { useState } from "react";

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register, error } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationError, setRegistrationError] = useState<string | null>(null);

    // Handle registration through auth context
    const handleRegister = async (name: string, email: string, password: string, agreeToTerms: boolean) => {
        if (!agreeToTerms) {
            setRegistrationError("You must agree to the Terms of Service and Privacy Policy");
            return;
        }

        try {
            setIsSubmitting(true);
            setRegistrationError(null);
            // Pass agreeToTerms to the register function
            await register(name, email, password);
            // If registration is successful, navigate to home
            navigate("/");
        } catch (err) {
            // The error is already handled by the auth context
            setRegistrationError("Registration failed. Please check your information and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Google sign up - keep as is for now
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
            {(error || registrationError) && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error || registrationError}
                </div>
            )}

            <RegisterForm onSubmit={handleRegister} disabled={isSubmitting} />
            <SocialLogin onGoogleLogin={handleGoogleSignUp} registerMode={true} />
        </AuthLayout>
    );
}