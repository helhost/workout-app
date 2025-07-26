import { AuthLayoutProps } from "@/types";
import { cn } from "@/lib/utils";

export default function AuthLayout({ children, title, subtitle, className }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
            <div className={cn("w-full max-w-md space-y-8", className)}>
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">AppName</h1>
                    <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h2>
                    {subtitle && (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {subtitle}
                        </div>
                    )}
                </div>

                {children}
            </div>
        </div>
    );
}