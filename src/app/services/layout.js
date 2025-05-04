"use client";
import Navbar from "@/components/Navbar";
import { SignIn, useUser } from "@clerk/nextjs";

export default function ServiceLayout({ children }) {
  const { user } = useUser();
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg mb-4">To access the services, please sign in.</p>
        <SignIn
          routing="hash" // Changed from "path" to "hash"
          signUpUrl="/sign-up"
          afterSignInUrl="/services"
          afterSignUpUrl="/services"
        />
      </div>
    );
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
