import { ReadingProgressChart } from "@/components/AppBarChart"

const mockReadingData = [
  { date: "2024-07-01", minutes: 30 },
  { date: "2024-07-02", minutes: 45 },
  { date: "2024-07-03", minutes: 50 },
  { date: "2024-07-04", minutes: 20 },
  { date: "2024-07-05", minutes: 60 },
  { date: "2024-07-01", minutes: 30 },
  { date: "2024-07-02", minutes: 45 },
  { date: "2024-07-03", minutes: 0 },
  { date: "2024-07-04", minutes: 10 },
  { date: "2024-07-05", minutes: 60 },
  { date: "2024-07-01", minutes: 100 },
  { date: "2024-07-02", minutes: 120 },
  { date: "2024-07-03", minutes: 50 },
  { date: "2024-07-04", minutes: 20 },
  { date: "2024-07-05", minutes: 60 },
  { date: "2024-07-01", minutes: 30 },
  { date: "2024-07-02", minutes: 45 },
  { date: "2024-07-03", minutes: 50 },
  { date: "2024-07-04", minutes: 20 },
  { date: "2024-07-05", minutes: 60 },
  { date: "2024-07-01", minutes: 30 },
  { date: "2024-07-02", minutes: 45 },
  { date: "2024-07-03", minutes: 50 },
  { date: "2024-07-04", minutes: 20 },
  { date: "2024-07-05", minutes: 60 },
  { date: "2024-07-01", minutes: 30 },
  { date: "2024-07-02", minutes: 45 },
  { date: "2024-07-03", minutes: 50 },
  { date: "2024-07-04", minutes: 20 },
  { date: "2024-07-05", minutes: 120 },
]

export default function Dashboard(){
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="rounded-xl p-4 col-span-2 bg-primary-foreground">
       <ReadingProgressChart
        data={mockReadingData}
        title="Reading Marathon"
        description="Your daily reading log"
      />
    </div>
    <div className="rounded-xl p-4 bg-primary-foreground">test</div>
    <div className="rounded-xl p-4 bg-primary-foreground">test</div>
    <div className="rounded-xl p-4 col-span-2 bg-primary-foreground">test</div>
  </div>
}