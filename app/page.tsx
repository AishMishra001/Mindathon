import { getServerSession } from "next-auth"
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"

export default async function Home(){

  console.log("NEXTAUTH_URL", process.env.NEXTAUTH_URL);
  console.log("NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET);

  const session = await getServerSession() ; 
  return <div>
    {JSON.stringify(session)}
  </div>

}

