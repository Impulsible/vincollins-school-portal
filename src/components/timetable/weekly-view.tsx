'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface TimetableEntry {
  id: string
  subject: string
  teacher: string
  room: string
  startTime: string
  endTime: string
  dayOfWeek: number
  class: string
}

interface OrganizedTimetable {
  [day: string]: TimetableEntry[]
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

export function WeeklyView() {
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedTerm, setSelectedTerm] = useState('2024 First Term')
  const [timetableData, setTimetableData] = useState<OrganizedTimetable>({})
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(new Date())

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData: OrganizedTimetable = {
      Monday: [
        {
          id: '1',
          subject: 'Mathematics',
          teacher: 'Mr. Smith',
          room: 'Room 101',
          startTime: '08:00',
          endTime: '09:00',
          dayOfWeek: 1,
          class: 'SS1',
        },
        {
          id: '2',
          subject: 'English',
          teacher: 'Mrs. Johnson',
          room: 'Room 102',
          startTime: '09:00',
          endTime: '10:00',
          dayOfWeek: 1,
          class: 'SS1',
        },
      ],
      Tuesday: [
        {
          id: '3',
          subject: 'Physics',
          teacher: 'Dr. Williams',
          room: 'Lab 1',
          startTime: '08:00',
          endTime: '09:00',
          dayOfWeek: 2,
          class: 'SS1',
        },
        {
          id: '4',
          subject: 'Chemistry',
          teacher: 'Dr. Brown',
          room: 'Lab 2',
          startTime: '10:00',
          endTime: '11:00',
          dayOfWeek: 2,
          class: 'SS1',
        },
      ],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    }

    setTimetableData(mockData)
    setLoading(false)
  }, [])

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeek(newDate)
  }

  const formatWeekRange = () => {
    const start = new Date(currentWeek)
    const end = new Date(currentWeek)
    end.setDate(start.getDate() + 6)
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Weekly Timetable</CardTitle>
            <CardDescription>
              View and manage class schedules
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[200px] text-center">
              {formatWeekRange()}
            </span>
            <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SS1">SS1</SelectItem>
              <SelectItem value="SS2">SS2</SelectItem>
              <SelectItem value="SS3">SS3</SelectItem>
              <SelectItem value="JSS1">JSS1</SelectItem>
              <SelectItem value="JSS2">JSS2</SelectItem>
              <SelectItem value="JSS3">JSS3</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTerm} onValueChange={setSelectedTerm}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024 First Term">2024 First Term</SelectItem>
              <SelectItem value="2024 Second Term">2024 Second Term</SelectItem>
              <SelectItem value="2024 Third Term">2024 Third Term</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <div className="border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-7 bg-muted">
                {daysOfWeek.map((day) => (
                  <div key={day} className="p-3 text-center font-medium border-r last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Time slots */}
              <div className="divide-y">
                {timeSlots.map((time, index) => (
                  <div key={time} className="grid grid-cols-7 min-h-[80px]">
                    {daysOfWeek.map((day) => {
                      const entries = timetableData[day]?.filter(
                        e => e.startTime === time
                      ) || []
                      
                      return (
                        <div
                          key={`${day}-${time}`}
                          className={cn(
                            'p-2 border-r last:border-r-0',
                            index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                          )}
                        >
                          {entries.map((entry) => (
                            <div
                              key={entry.id}
                              className="bg-primary/10 p-2 rounded text-xs space-y-1"
                            >
                              <p className="font-medium">{entry.subject}</p>
                              <p className="text-muted-foreground">{entry.teacher}</p>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{entry.room}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <div className="space-y-4">
              {daysOfWeek.map((day) => {
                const dayEntries = timetableData[day] || []
                
                if (dayEntries.length === 0) return null

                return (
                  <div key={day} className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-3 font-medium">{day}</div>
                    <div className="divide-y">
                      {dayEntries.map((entry) => (
                        <div key={entry.id} className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{entry.subject}</p>
                            <p className="text-sm text-muted-foreground">
                              {entry.teacher} • {entry.room}
                            </p>
                          </div>
                          <div className="text-sm">
                            {entry.startTime} - {entry.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}