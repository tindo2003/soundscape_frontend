// components/GoogleSignInButton.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Declare the global google object type
declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: { credential: string }) => void;
                    }) => void;
                    renderButton: (
                        element: HTMLElement | null,
                        options: { theme: string; size: string }
                    ) => void;
                };
            };
        };
    }
}

const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (!client_id) {
    throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined");
}

// At this point TypeScript knows client_id is defined
const googleClientId = client_id as string;

export function GoogleSignInButton() {
    const router = useRouter();
    useEffect(() => {
        // Load the Google Identity Services script
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = initializeGoogleSignIn;
        document.body.appendChild(script);

        function initializeGoogleSignIn() {
            window.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleCredentialResponse,
            });
            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                { theme: "outline", size: "large" }
            );
        }

        return () => {
            // Clean up the script if needed
            document.body.removeChild(script);
        };
    }, []);

    async function handleCredentialResponse(response: { credential: string }) {
        // The response contains an ID token in response.credential
        const idToken = response.credential;

        // Send the token to your Django backend for verification and login
        try {
            const res = await fetch(
                "http://localhost:8000/user/google_signin/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_token: idToken }),
                    credentials: "include",
                }
            );
            const data = await res.json();
            if (res.ok) {
                // Optionally redirect the user or update your UI here.
                console.log("Authenticated!", data);
                router.push("/dashboard");
            } else {
                console.error("Authentication error:", data.error);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    return <div id="google-signin-button"></div>;
}