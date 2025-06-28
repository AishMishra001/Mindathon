"use client"
import { useRouter } from "next/navigation"

export default function Home(){

  const router = useRouter() ; 

  return <div className="w-screen h-screen bg-black flex flex-col gap-2 justify-center items-center text-white">
    <div className="text-5xl">
    Mind-A-Thon
    </div>
    <button onClick={
      ()=>{
            router.push('/signup') ; 
      }
    } className="px-4 py-2 border-white border-2 rounded-full">
       Join
    </button>
  </div>
}