"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, CheckCircle } from "lucide-react"

export function CalendarBooking({ email }) {
  const [selectedSlot, setSelectedSlot] = useState("")
  const [booked, setBooked] = useState(false)
  const [loading, setLoading] = useState(false)

  // Mock available time slots
  const availableSlots = [
    { id: "1", date: "2024-01-15", time: "10:00 AM", datetime: "2024-01-15T10:00:00" },
    { id: "2", date: "2024-01-15", time: "2:00 PM", datetime: "2024-01-15T14:00:00" },
    { id: "3", date: "2024-01-16", time: "11:00 AM", datetime: "2024-01-16T11:00:00" },
    { id: "4", date: "2024-01-16", time: "3:00 PM", datetime: "2024-01-16T15:00:00" },
    { id: "5", date: "2024-01-17", time: "9:00 AM", datetime: "2024-01-17T09:00:00" },
    { id: "6", date: "2024-01-17", time: "1:00 PM", datetime: "2024-01-17T13:00:00" },
  ]

  const bookSlot = async () => {
    if (!selectedSlot) return

    setLoading(true)

    // Simulate booking delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const selectedSlotData = availableSlots.find((slot) => slot.id === selectedSlot)
    console.log("Calendar slot booked:", { email, slot: selectedSlotData })

    setBooked(true)
    setLoading(false)
  }

  if (booked) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Your consultation call has been booked! You'll receive a calendar invite shortly.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h3 className="font-medium">Schedule a Consultation Call</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {availableSlots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            onClick={() => setSelectedSlot(slot.id)}
            className={`p-3 border rounded-lg text-left transition-colors ${
              selectedSlot === slot.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-medium">{slot.date}</div>
            <div className="text-sm text-gray-600 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {slot.time}
            </div>
          </button>
        ))}
      </div>

      <Button type="button" onClick={bookSlot} disabled={!selectedSlot || loading} className="w-full">
        {loading ? "Booking..." : "Book Selected Time"}
      </Button>
    </div>
  )
}
