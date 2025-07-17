'use client';

import { useEffect, useState } from "react";
import { differenceInDays, isAfter, isBefore, format } from "date-fns";

interface TestInfo {
  date: Date;
  name: string;
  description: string;
}

export default function TestReminder() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [progress, setProgress] = useState<number | null>(null); // 🟢 NEW

  const tests: TestInfo[] = [
    {
      date: new Date(2025, 6, 30),
      name: "Mid-Marathon Test",
      description: "Halfway checkpoint assessment",
    },
    {
      date: new Date(2025, 7, 15),
      name: "Final Marathon Test",
      description: "Ultimate challenge assessment",
    },
  ];

  const marathonStart = new Date(2025, 6, 17);
  const marathonEnd = new Date(2025, 7, 17);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);

    const nowTime = now.getTime();
    const start = marathonStart.getTime();
    const end = marathonEnd.getTime();

    const calculatedProgress = Math.min(
      100,
      Math.max(0, ((nowTime - start) / (end - start)) * 100)
    );
    setProgress(calculatedProgress);
  }, []);

  const getNextTest = () => {
    const now = new Date();
    return tests.find((test) => isAfter(test.date, now)) || null;
  };

  const nextTest = getNextTest();
  const daysUntilTest = nextTest
    ? differenceInDays(nextTest.date, currentDate)
    : null;

  const getPhase = () => {
    const now = new Date();
    if (isBefore(now, marathonStart)) return "before";
    if (isAfter(now, marathonEnd)) return "completed";
    return "active";
  };

  const phase = getPhase();

  const rewards = [
    { icon: "🏆", text: "Boost Leaderboard Ranking" },
    { icon: "🎁", text: "Exclusive Prizes & Gifts" },
    { icon: "⭐", text: "Achievement Badges" },
    { icon: "🎯", text: "Bonus Points" },
  ];

  if (phase === "before") {
    const daysUntilStart = differenceInDays(marathonStart, currentDate);
    return (
      <div className="flex flex-col h-full w-full flex-1">
        <div className="text-center mb-4 w-full">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
            📚 Marathon Prep
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Get ready for the challenge!
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center space-y-4">
          <div className="text-center bg-black">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {daysUntilStart}
            </div>
            <div className="text-sm sm:text-base text-muted-foreground">
              days until marathon starts
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-foreground">
              Marathon Period
            </p>
            <p className="text-xs text-muted-foreground">July 15 - August 15</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "completed") {
    return (
      <div className="flex flex-col h-full">
        <div className="text-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
            🎉 Marathon Complete!
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Well done on finishing!
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center space-y-4">
          <div className="text-6xl mb-4">🏁</div>
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-foreground">
              All tests completed!
            </p>
            <p className="text-xs text-muted-foreground">
              Check your final rankings
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!nextTest) {
    return (
      <div className="flex flex-col h-full">
        <div className="text-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
            ✅ All Tests Done
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Waiting for results...
          </p>
        </div>
      </div>
    );
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return "text-red-500";
    if (days <= 7) return "text-orange-500";
    return "text-blue-500";
  };

  const getUrgencyBg = (days: number) => {
    if (days <= 3) return "bg-red-50 border-red-200";
    if (days <= 7) return "bg-orange-50 border-orange-200";
    return "bg-blue-50 border-blue-200";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-3">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
          ⏰ Test Reminder
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Stay prepared and ace your tests!
        </p>
      </div>

      {/* Countdown */}
      <div
        className={`rounded-lg border p-3 sm:p-4 mb-3 ${getUrgencyBg(
          daysUntilTest || 0
        )}`}
      >
        <div className="text-center">
          <div
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 ${getUrgencyColor(
              daysUntilTest || 0
            )}`}
          >
            {daysUntilTest === 0
              ? "TODAY!"
              : `${daysUntilTest} ${daysUntilTest === 1 ? "day" : "days"}`}
          </div>
          <div className="text-xs sm:text-sm font-medium text-foreground mb-1">
            {nextTest.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {format(nextTest.date, "MMMM do, yyyy")}
          </div>
        </div>
      </div>

      {/* Motivation Section */}
      <div className="flex-1">
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            🎯 Why Ace This Test?
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {rewards.map((reward, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-md bg-card border"
            >
              <span className="text-lg">{reward.icon}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {reward.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-3 pt-3 border-t">
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
          <span>Marathon Progress</span>
          <span>{format(marathonEnd, "MMM do")}</span>
        </div>
        {progress !== null && (
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
