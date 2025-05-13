"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/auth/AuthLayout";
import SocialButtons from "@/components/auth/SocialButtons";
import { sendSignInLinkToEmail, auth } from "@/lib/firebase";
import validator from "validator";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleContinue = async () => {
    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!validator.isEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(""); // Clear previous errors
    setIsLoading(true);

    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/register/verify`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);

      router.push("/register/check-email");
    } catch (err: any) {
      setError(err.message || "Failed to send verification email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-start space-y-6 w-full max-w-md">
        <div className="text-start space-y-2">
          <h1 className="text-2xl font-semibold">
            Login to your Soundscape account
          </h1>
          <p className="text-muted-foreground">Start building today.</p>
        </div>

        <SocialButtons />

        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">
              or continue with
            </span>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${
                  error ? "border-red-500 animate-shake" : "border-gray-300"
                } focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-all`}
              />
              {error && (
                <TriangleAlert
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500"
                  size={16}
                />
              )}
            </div>
          </div>

          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

          <Button
            className="w-full"
            size="lg"
            onClick={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Continue"}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
