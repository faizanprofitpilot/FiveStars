'use client'

import { CalendarDays } from 'lucide-react'
import { format } from 'date-fns'

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface DateRangePickerProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined
    onDateRangeChange({ from: date, to: dateRange.to })
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined
    onDateRangeChange({ from: dateRange.from, to: date })
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-slate-500" />
        <label className="text-sm font-medium text-slate-700">Date Range:</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={formatDateForInput(dateRange.from)}
          onChange={handleFromChange}
          max={formatDateForInput(dateRange.to || new Date())}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
        <span className="text-slate-400">to</span>
        <input
          type="date"
          value={formatDateForInput(dateRange.to)}
          onChange={handleToChange}
          min={formatDateForInput(dateRange.from)}
          max={formatDateForInput(new Date())}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>
      {dateRange.from && dateRange.to && (
        <span className="text-xs text-slate-500">
          {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d, yyyy')}
        </span>
      )}
    </div>
  )
}
