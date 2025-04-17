import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../index";
import { LoginLayoutProps } from "@/types";

// This is a wrapper around AuthLayout specifically for the login page
export default function LoginLayout({ children, className }: LoginLayoutProps) {
    const navigate = useNavigate();

    return (
        <AuthLayout
            className={className}
            title="Sign in to your account"
            subtitle={
                <>
                    Or{" "}
                    <button
                        type="button"
                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        onClick={() => navigate("/register")}
                    >
                        create a new account
                    </button>
                </>
            }
        >
            {children}
        </AuthLayout>
    );
}