import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { LoginFormProps } from "@/types/auth";
import { cn } from "@/lib/utils";

export default function LoginForm({ onSubmit, className, disabled = false }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(email, password, rememberMe);
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form className={cn("mt-8 space-y-6", className)} onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email address
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 pl-10 pr-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="you@example.com"
                            disabled={disabled}
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 pl-10 pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="••••••••"
                            disabled={disabled}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={togglePasswordVisibility}
                            disabled={disabled}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                        disabled={disabled}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Remember me
                    </label>
                </div>

                <div className="text-sm">
                    <button
                        type="button"
                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        onClick={() => console.log("Forgot password clicked")}
                        disabled={disabled}
                    >
                        Forgot your password?
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <div>
                <Button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4"
                    disabled={disabled}
                >
                    {disabled ? "Signing in..." : "Sign in"}
                </Button>
            </div>
        </form>
    );
}