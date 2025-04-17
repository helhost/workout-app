import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { RegisterFormProps } from "@/types/auth";
import { cn } from "@/lib/utils";

export default function RegisterForm({ onSubmit, className, disabled = false }: RegisterFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, email, password, agreeToTerms);
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form className={cn("mt-8 space-y-6", className)} onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
                {/* Name Input */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 pl-10 pr-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="John Doe"
                            disabled={disabled}
                        />
                    </div>
                </div>

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
                            autoComplete="new-password"
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
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        At least 8 characters with letters and numbers
                    </p>
                </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
                <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    required
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    disabled={disabled}
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    I agree to the{" "}
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Privacy Policy
                    </a>
                </label>
            </div>

            {/* Submit Button */}
            <div>
                <Button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4"
                    disabled={disabled}
                >
                    {disabled ? "Creating Account..." : "Create Account"}
                </Button>
            </div>
        </form>
    );
}