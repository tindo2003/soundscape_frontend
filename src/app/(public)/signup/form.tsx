"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signupAction } from "@/app/auth/auth_client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormState {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        message?: string[];
    };
    success?: string;
}

export function SignupForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [state, setState] = useState<FormState>({ errors: {} });

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            const result = await signupAction(state, formData, router);
            setState(result);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form action={handleSubmit}>
            <div className="flex flex-col gap-2">
                {/* Name Field */}
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="John Doe" />
                </div>
                {state?.errors?.name && (
                    <p className="text-sm text-red-500">{state.errors.name[0]}</p>
                )}

                {/* Email Field */}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        placeholder="john@example.com"
                    />
                </div>
                {state?.errors?.email && (
                    <p className="text-sm text-red-500">{state.errors.email[0]}</p>
                )}

                {/* Password Field */}
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" />
                </div>
                {state?.errors?.password && (
                    <div className="text-sm text-red-500">
                        <p>Password must:</p>
                        <ul>
                            {state.errors.password.map((error) => (
                                <li key={error}>- {error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Global Error (e.g., from the server) */}
                {state?.errors?.message && (
                    <p className="text-sm text-red-500">
                        {state.errors.message[0]}
                    </p>
                )}

                {/* Success Message */}
                {state?.success && (
                    <p className="text-sm text-green-500">{state.success}</p>
                )}

                {/* Submit Button */}
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Submitting..." : "Sign Up"}
                </Button>
            </div>
        </form>
    );
}
