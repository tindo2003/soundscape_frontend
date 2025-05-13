"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";

export default function VerifyEmailPage() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");

    const verifyUserEmail = async () => {
        try {
            const response = await axios.post(
                `${DJANGO_USER_ENDPOINT}/verifyemail/`,
                {
                    token,
                }
            );
            // If the response indicates a reset token, redirect to the reset password page
            if (response.data.action === "reset") {
                router.push(`/reset-password?token=${token}`);
            } else {
                // Otherwise, display a success message
                setVerified(true);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Verification failed.");
            console.log(err.response);
        }
    };

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get(
            "token"
        );
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div className="flex flex-col p-4 lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Verify Your Email
                </h1>
                {verified ? (
                    <>
                        <h2 className="text-2xl text-green-600 mb-4">
                            Email Verified!
                        </h2>
                        <p className="mb-6 text-gray-600">
                            Your email has been successfully verified. You can
                            now close this page.
                        </p>
                        <Link
                            href="/login"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            Login
                        </Link>
                    </>
                ) : error ? (
                    <>
                        <h2 className="text-2xl text-red-600 mb-4">
                            Verification Failed
                        </h2>
                        <p className="mb-6 text-gray-600">{error}</p>
                        <Link
                            href="/contact"
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                            Contact Support
                        </Link>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl text-gray-700 mb-4">
                            Verifying your email...
                        </h2>
                        <p className="text-gray-500">
                            Please wait while we verify your email address.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
