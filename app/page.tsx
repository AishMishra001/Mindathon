import { getServerSession } from "next-auth";
import { authOptions } from "./lib/authOptions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.isAdmin) {
      return redirect("/admin/dashboard");
    } else {
      return redirect("/user/dashboard");
    }
  }

  // No session → show landing page
  return (
    <div className="flex justify-center items-center bg-black w-screen h-screen flex-col gap-4">
      <div className="text-2xl font-light text-white">Welcome to Mindathon</div>
      <a
        className="px-6 py-2 rounded-xl border-2 border-white bg-black text-white"
        href="/api/auth/signin"
      >
        Signup
      </a>
    </div>
  );
}
