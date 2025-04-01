import { Button } from "@/components/ui/button";
import { SocialLoginProps } from "../types";
import { cn } from "@/lib/utils";

export default function SocialLogin({ onGoogleLogin, className, registerMode = false }: SocialLoginProps) {
    return (
        <div className={cn("mt-6", className)}>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                        Or {registerMode ? 'sign up' : 'continue'} with
                    </span>
                </div>
            </div>

            <div className="mt-6">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full flex justify-center py-2 px-4"
                    onClick={onGoogleLogin}
                >
                    Google
                </Button>
            </div>
        </div>
    );
}