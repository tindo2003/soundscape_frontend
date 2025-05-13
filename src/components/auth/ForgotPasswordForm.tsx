"use client";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction } from "@/app/auth/auth_client";
import { useState } from "react";

interface FormState {
    errors?: {
        email?: string[];
        message?: string[];
    };
    success?: string;
}

export function ForgotPasswordForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [state, setState] = useState<FormState>({ errors: {} });

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            const result = await forgotPasswordAction(state, formData, router);
            setState(result);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form action={handleSubmit}>
            <div className="flex flex-col gap-2">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        placeholder="m@example.com"
                        type="email"
                    />
                    {state?.errors?.email && (
                        <p className="text-sm text-red-500">
                            {state.errors.email[0]}
                        </p>
                    )}
                </div>

                {state?.errors?.message && (
                    <p className="text-sm text-red-500">
                        {state.errors.message[0]}
                    </p>
                )}

                {state?.success && (
                    <p className="text-sm text-green-500">{state.success}</p>
                )}

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Sending..." : "Send Reset Link"}
                </Button>
            </div>
        </form>
    );
}