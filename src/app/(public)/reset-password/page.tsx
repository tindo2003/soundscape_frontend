"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResetPasswordSchema } from "@/types/auth";
import axios from "axios";
import Link from "next/link";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get(
            "token"
        );
        setToken(urlToken || "");
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate the new password using the ResetPasswordSchema
        const validation = ResetPasswordSchema.safeParse({
            new_password: newPassword,
        });
        if (!validation.success) {
            const errorMsg =
                validation.error
                    .flatten()
                    .fieldErrors.new_password?.join(", ") ||
                "Invalid password.";
            setError(errorMsg);
            return;
        }

        try {
            const response = await axios.post(
                `${DJANGO_USER_ENDPOINT}/reset-password/`,
                {
                    token,
                    new_password: newPassword,
                }
            );
            setMessage(response.data.message);
            setError("");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to reset password.");
            setMessage("");
        }
    };

    return (
        <div className="flex flex-col p-4 lg:w-1/3 mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Reset Password
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="newPassword" className="text-left">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border rounded p-2"
                            required
                        />
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                        {message && (
                            <p className="text-sm text-green-500">{message}</p>
                        )}
                        <button
                            type="submit"
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
                <Link href="/login" className="mt-4 inline-block underline">
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
