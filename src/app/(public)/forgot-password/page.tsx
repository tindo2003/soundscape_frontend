import Link from "next/link";
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'; // Import the component

export default function ForgotPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-screen py-12"> {/* Example centering */}
           <div className="w-full max-w-md space-y-8"> {/* Example max-width */}
               <div className="text-center">
                   <h1 className="text-3xl font-bold">Forgot Password</h1>
                   <p className="text-gray-500 dark:text-gray-400"> {/* Dark mode support */}
                       Enter your email address to receive a password reset link.
                   </p>
               </div>
               <div className="mt-6">
                   <ForgotPasswordForm /> {/* Render the imported component */}
               </div>
               <div className="mt-4 text-center text-sm">
                   Remember your password?{" "}
                   <Link className="underline" href="/login">
                       Login
                   </Link>
               </div>
           </div>
       </div>
    );
}