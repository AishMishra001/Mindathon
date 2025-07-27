"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // signIn without redirect
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials.");
    } else {
      // Fetch session to get user role
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user?.isAdmin === true ) {
        router.push("/admin/dashboard?admin=true");
      } else {
        router.push("/user/dashboard");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary-foreground">
      <div className="bg-black p-8 rounded-lg shadow-md w-[350px]">
        <h2 className="text-3xl font-semilight mb-4 text-center text-white">Sign In</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-white mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/auth/signup")}
            className="text-blue-400 underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
