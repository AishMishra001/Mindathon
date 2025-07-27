"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isAdmin = adminPassword === "Keshav";

    const res = await signIn("credentials", {
      firstname,
      lastname,
      email,
      password,
      adminpassword: adminPassword,
      redirect: true,
      callbackUrl: isAdmin ? "/admin/dashboard?admin=true" : "/user/dashboard",
    });

    if (res?.error) {
      setError("User already exists or invalid credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary-foreground">
      <div className="bg-black p-8 rounded-lg shadow-md w-[350px]">
        <h1 className="text-white text-center text-xl mb-2">Welcome to Mindathon</h1>
        <h2 className="text-3xl font-semilight mb-4 text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Firstname"
            className="w-full border px-3 py-2 rounded"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Lastname"
            className="w-full border px-3 py-2 rounded"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
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
            className="w-full bg-white text-black py-2 rounded"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-white mt-4">
          Already a user?{" "}
          <span
            onClick={() => router.push("/auth/signin")}
            className="text-blue-400 underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
