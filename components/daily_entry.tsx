"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "../app/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { useSession } from "next-auth/react";

export default function DailyEntry() {
  const { data: session, status } = useSession();
  if (status === "loading") return <p>Loading...</p>;
  if (!session?.user?.id) return <p>User not authenticated.</p>;
  const userId = session?.user?.id;

  const [readingBook, setReadingBook] = useState("");
  const [readingTopic, setReadingTopic] = useState("");
  const [readingMinutes, setReadingMinutes] = useState(0);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("10:30:00");
  const [learning, setLearnings] = useState("");
  const [questions, setQuestions] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dateTime = date
      ? new Date(`${date.toDateString()} ${time}`)
      : undefined;

    console.log({
      readingBook,
      readingTopic,
      readingMinutes,
      dateTime,
      learning,
      questions,
    });

    try {
      await axios.post("/api/v1/user", {
        userId,
        readingBook,
        readingTopic,
        readingMinutes,
        dateTime,
        learning,
        questions,
        metTarget: readingMinutes >= 60,
      });

      router.push("/user/dashboard");
    } catch (error) {
      console.error("Failed to submit form", error);
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Mindathon
      </h2>
      <h4 className="text-neutral-800 dark:text-neutral-200">
        Add your daily logs
      </h4>
      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label>Reading Book</Label>
          <Input
            placeholder="Bhagwat Geeta As it is"
            onChange={(e) => setReadingBook(e.target.value)}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label>Reading Topic</Label>
          <Input
            placeholder="Adhyay 2 Karma Yog"
            onChange={(e) => setReadingTopic(e.target.value)}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label>Reading Minutes</Label>
          <Input
            type="number"
            placeholder="60"
            onChange={(e) => {
              const value = Number(e.target.value);
              setReadingMinutes(value);
            }}
          />
        </LabelInputContainer>

        {/* 📅 Date and ⏰ Time Picker */}
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col gap-3">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-32 justify-between font-normal"
                >
                  {date ? date.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(selectedDate) => setDate(selectedDate)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Time</Label>
            <Input
              type="time"
              step="1"
              defaultValue={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>

        <LabelInputContainer className="mb-4">
          <Label>Your Learnings</Label>
          <Input
            placeholder="Krishna is supreme personality of godhead"
            onChange={(e) => setLearnings(e.target.value)}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label>Any Questions?</Label>
          <Input
            placeholder="Vishnu is supreme or Krishna?"
            onChange={(e) => setQuestions(e.target.value)}
          />
        </LabelInputContainer>

        <button
          type="submit"
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
        >
          Submit &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
