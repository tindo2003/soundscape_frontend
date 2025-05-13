"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "@/lib/firebase";

export default function SocialButtons() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState<string | null>(null);
  const handleSignIn = async (providerType: string) => {
    if (isSigningIn) return;
    setIsSigningIn(providerType);

    try {
      let provider;
      if (providerType === "google") {
        provider = new GoogleAuthProvider();
      } else if (providerType === "facebook") {
        provider = new FacebookAuthProvider();
      } else if (providerType === "github") {
        provider = new GithubAuthProvider();
      }

      if (provider) {
        const result = await signInWithPopup(auth, provider);
        console.log(`${providerType} user signed in:`, result.user);
        router.push('/dashboard');
        alert(`Successfully signed in with ${providerType}!`);
      }
    } catch (error: any) {
      console.error(`${providerType} sign-in error:`, error);
      alert(`Failed to sign in with ${providerType}: ${error.message}`);
    } finally {
      setIsSigningIn(null);
    }
  };

  return (
    <div className="w-full space-y-3">
      <Button
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => handleSignIn("google")}
        disabled={isSigningIn !== null}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {isSigningIn === "google" ? "Signing in..." : "Continue with Google"}
      </Button>

      {/* GitHub Sign-In */}
      <Button
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => handleSignIn("github")}
        disabled={isSigningIn !== null}
      >
        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.09.682-.218.682-.486 0-.236-.009-.866-.014-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.532 1.03 1.532 1.03.892 1.53 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
        {isSigningIn === "github" ? "Signing in..." : "Continue with GitHub"}
      </Button>

      {/* Facebook Sign-In */}
      <Button
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => handleSignIn("facebook")}
        disabled={isSigningIn !== null}
      >
        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
        {isSigningIn === "facebook" ? "Signing in..." : "Continue with Facebook"}
      </Button>
    </div>
  );
}
