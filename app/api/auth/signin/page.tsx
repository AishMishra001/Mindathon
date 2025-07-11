"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isAdmin = adminPassword === "Keshav";
    const callbackUrl = isAdmin
      ? "/user/dashboard?admin=true"
      : "/user/dashboard";

    const res = await signIn("credentials", {
      email,
      password,
      adminpassword: adminPassword,
      redirect: true, // Let NextAuth handle the redirect
      callbackUrl,
    });

    if (res?.error) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary-foreground">
      <div className="bg-black p-8 rounded-lg shadow-md w-[350px]">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>

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
          <input
            type="password"
            placeholder="Admin Password (optional)"
            className="w-full border px-3 py-2 rounded"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded"
          >
            Sign In with Credentials
          </button>
        </form>

        <hr className="my-6" />

        <button
          onClick={() => signIn("google", { callbackUrl: "/user/dashboard" })}
          className="w-full border py-2 rounded"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
}