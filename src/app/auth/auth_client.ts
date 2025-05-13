"use client";

import axios from "axios";
import {
    FormState,
    SignupFormSchema,
    LoginFormSchema,
    ForgotPasswordFormSchema,
} from "@/types/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";

const API_BASE_URL = DJANGO_USER_ENDPOINT; // For user-related endpoints
console.log("API_BASE_URL", API_BASE_URL);

export async function loginAction(
    prevState: any,
    formData: FormData,
    router: AppRouterInstance
) {
    // 1. Validate fields with your schema
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validatedFields.data;

    try {
        const response = await axios.post(
            `${API_BASE_URL}/signin/`,
            { email, password },
            { withCredentials: true }
        );

        router.push("/dashboard");

        return { ...prevState, errors: {} };
    } catch (error: any) {
        if (error.response) {
            const serverError = error.response.data?.error || "Login failed.";
            return {
                ...prevState,
                errors: { message: [serverError] },
            };
        } else {
            return {
                ...prevState,
                errors: { message: ["Network error."] },
            };
        }
    }
}

export async function signupAction(
    prevState: any,
    formData: FormData,
    router: any
) {
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, password } = validatedFields.data;
    const curr_date = new Date().toISOString();
    try {
        const response = await axios.post(`${API_BASE_URL}/signup/`, {
            name,
            email,
            password,
            curr_date,
        });

        // Redirect immediately on success (no need for success msg in state)
        // router.push("/dashboard");

        // We can return a default state, but the user is leaving this page anyway
        return {
            ...prevState,
            errors: {},
            success:
                response.data.message ||
                "Signup successful. Please check your inbox for email verification.",
        };
    } catch (error: any) {
        if (error.response) {
            const serverError = error.response.data?.error || "Signup failed.";
            return {
                ...prevState,
                errors: { message: [serverError] },
            };
        } else {
            return {
                ...prevState,
                errors: { message: ["Network error"] },
            };
        }
    }
}

export async function logout() {
    try {
        const response = await fetch(`${API_BASE_URL}/logout/`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            window.alert("Failed to log out.");
        }

        window.location.href = "/login";
    } catch (err) {
        window.alert(err);
    }
}

export async function forgotPasswordAction(
    prevState: any,
    formData: FormData,
    router: AppRouterInstance
) {
    // 1. Validate the email field with Zod
    const validatedFields = ForgotPasswordFormSchema.safeParse({
        email: formData.get("email"),
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            errors: validatedFields.error.flatten().fieldErrors,
            success: "", // clear previous success message
        };
    }

    const { email } = validatedFields.data;

    try {
        // 2. Send a POST request to the forgot password endpoint
        await axios.post(
            `${API_BASE_URL}/forgot-password/`,
            { email },
            { withCredentials: true }
        );

        // 3. Instead of redirecting, return state with a success message
        return {
            ...prevState,
            errors: {},
            success:
                "Reset link sent successfully. Please check your email for further instructions.",
        };
    } catch (error: any) {
        if (error.response) {
            const serverError =
                error.response.data?.error || "Failed to send reset link.";
            return {
                ...prevState,
                errors: { message: [serverError] },
                success: "",
            };
        } else {
            return {
                ...prevState,
                errors: { message: ["Network error."] },
                success: "",
            };
        }
    }
}
