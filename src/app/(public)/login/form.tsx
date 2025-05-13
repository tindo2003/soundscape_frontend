"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/auth/auth_client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormState {
    errors?: {
        email?: string[];
        password?: string[];
        message?: string[];
    };
}

export function LoginForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [state, setState] = useState<FormState>({ errors: {} });

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            const result = await loginAction(state, formData, router);
            setState(result);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form action={handleSubmit}>
            <div className="flex flex-col gap-2">
                {/* Email Field */}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        placeholder="m@example.com"
                        type="email"
                    />
                    {/* Show validation errors for email */}
                    {state?.errors?.email && (
                        <p className="text-sm text-red-500">
                            {state.errors.email[0]}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div className="mt-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            className="text-sm underline"
                            href="/forgot-password"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <Input id="password" type="password" name="password" />
                    {/* Show validation errors for password */}
                    {state?.errors?.password && (
                        <p className="text-sm text-red-500">
                            {state.errors.password[0]}
                        </p>
                    )}
                </div>

                {/* Global Error (e.g., "Invalid credentials") */}
                {state?.errors?.message && (
                    <p className="text-sm text-red-500">
                        {state.errors.message[0]}
                    </p>
                )}

                {/* Submit Button */}
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Logging in..." : "Login"}
                </Button>
            </div>
        </form>
    );
}

export function LoginButton() {
    const [isPending, setIsPending] = useState(false);

    return (
        <Button 
            aria-disabled={isPending} 
            type="submit" 
            className="mt-4 w-full"
            disabled={isPending}
        >
            {isPending ? "Submitting..." : "Login"}
        </Button>
    );
}