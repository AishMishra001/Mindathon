import { authOptions } from "@/app/lib/authOptions";
import DailyEntry from "@/components/daily_entry";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return <DailyEntry />;
}
