"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

type ReadingData = {
  date: string
  minutes: number
}

interface ReadingProgressChartProps {
  title?: string
  description?: string
  data: ReadingData[]
}

export function ReadingProgressChart({
  title = "Reading Progress",
  description = "Your daily reading log",
  data,
}: ReadingProgressChartProps) {
  const totalMinutes = data.reduce((acc, curr) => acc + curr.minutes, 0)

  return (
    <Card>
      {/* Header Row */}
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 p-4 sm:p-6 border-b">
        <div className="flex flex-col items-start gap-1">
          <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
          <CardDescription className="text-sm sm:text-base">{description}</CardDescription>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-xs sm:text-sm">Total Minutes</p>
          <p className="text-2xl sm:text-4xl font-bold text-primary">
            {totalMinutes.toLocaleString()} min
          </p>
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={{
            reading: { label: "Reading", color: "var(--chart-1)" },
          }}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={data} margin={{ left: 24, right: 24 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
              style={{ fontSize: "12px" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={48}
              tickFormatter={(value) => `${value} min`}
              style={{ fontSize: "13px", fill: "var(--foreground)" }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="minutes"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey="minutes" fill="var(--color-amber-500)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
