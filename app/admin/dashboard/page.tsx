import ReadingProgressChartWrapper from "@/components/ReadingProgressChartWrapper"
import StreakCalendar from "@/components/StreakCalender"



export default function Dashboard(){
  return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl p-4 md:col-span-2 bg-primary-foreground">
            <ReadingProgressChartWrapper />
          </div>
    
          <div className="rounded-xl p-4 bg-primary-foreground">
            <StreakCalendar />
          </div>
    
          <div className="rounded-xl p-4 bg-primary-foreground flex flex-col h-full min-h-[400px]">
            something
          </div>
    
          <div className="rounded-xl p-4 md:col-span-2 bg-primary-foreground">
            something
          </div>
        </div>
  )
}