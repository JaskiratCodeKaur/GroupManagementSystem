import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Button from "../Dashboard/ui/Button";

const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isToday = (day) => {
    return day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Calendar
          </h3>
          <p className="text-sm text-gray-500">Your calendar overview</p>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth("prev")}
          className="h-8 w-8"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h4 className="font-semibold text-gray-900">
          {monthNames[currentMonth]} {currentYear}
        </h4>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth("next")}
          className="h-8 w-8"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {calendarDays.map((day, idx) => (
          <div
            key={idx}
            className={`
              aspect-square flex items-center justify-center text-sm relative
              ${day ? 'hover:bg-gray-200 cursor-pointer rounded-lg' : ''}
              ${isToday(day || 0) ? 'bg-indigo-600 text-white font-semibold rounded-lg' : ''}
            `}
          >
            {day && <span>{day}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
