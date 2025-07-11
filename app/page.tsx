"use client"

import { useRouter } from "next/navigation";

// import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"

export default function Home(){

  const router = useRouter() ; 

  return <div className="flex justify-center items-center bg-black w-screen h-screen flex-col gap-4">
    <div className="text-2xl font-light">
      Welcome to mindathon
    </div>
      <button className="px-6 py-2 rounded-xl border-2 border-white bg-black text-white" onClick={()=>
        router.push("/api/auth/signin")
      }>Signup</button>
  </div>

}

