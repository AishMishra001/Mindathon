"use client"

import { Particles } from "@/components/magicui/particles"
import { useRouter } from "next/navigation";

export default function Hero() {

const router = useRouter() ; 

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
      <span className="pointer-events-none z-10 whitespace-pre-wrap text-center text-8xl font-semibold leading-none text-white">
        Mind-a-thon
      </span>
      <button onClick = {
        ()=>{
            router.push('/signup')
        }
      }className="text-white border-white border-2 bg-black px-2 py-1 rounded-lg cursor-pointer">
         Getting Started 
      </button>
      <Particles className="absolute inset-0 z-0" quantity={100} ease={80} color="#ffffff" refresh />
    </div>
  )
}
