import React from 'react';
import { Course, PERSIAN_DAYS, TimeSlot } from '../types';

interface ScheduleGridProps {
  courses: Course[];
}

const START_HOUR = 7;
const END_HOUR = 20;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const ROW_HEIGHT = 60; // px per hour

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ courses }) => {
  
  const getPositionStyle = (slot: TimeSlot) => {
    const [startH, startM] = slot.startTime.split(':').map(Number);
    const [endH, endM] = slot.endTime.split(':').map(Number);
    
    const startDecimal = startH + startM / 60;
    const endDecimal = endH + endM / 60;
    
    const top = (startDecimal - START_HOUR) * ROW_HEIGHT;
    const height = (endDecimal - startDecimal) * ROW_HEIGHT;
    
    return { top: `${top}px`, height: `${height}px` };
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full">
      <div className="overflow-x-auto">
        <div className="min-w-[800px] relative">
          
          {/* Header Row */}
          <div className="grid grid-cols-[60px_repeat(6,1fr)] bg-gray-50 border-b border-gray-200">
            <div className="p-3 text-center text-gray-400 text-sm font-medium">ساعت</div>
            {PERSIAN_DAYS.slice(0, 6).map((day, index) => (
              <div key={index} className="p-3 text-center text-gray-700 font-bold text-sm border-r border-gray-100">
                {day}
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="relative grid grid-cols-[60px_repeat(6,1fr)]" style={{ height: `${TOTAL_HOURS * ROW_HEIGHT}px` }}>
            
            {/* Time Labels & Background Lines */}
            <div className="border-l border-gray-100 bg-gray-50/50">
              {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
                <div key={i} className="border-b border-gray-200 text-xs text-gray-400 text-center relative" style={{ height: `${ROW_HEIGHT}px` }}>
                  <span className="-top-2.5 relative">{START_HOUR + i}:00</span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {Array.from({ length: 6 }).map((_, dayIndex) => (
              <div key={dayIndex} className="relative border-r border-gray-100 border-b border-gray-200">
                {/* Horizontal guide lines */}
                {Array.from({ length: TOTAL_HOURS }).map((_, h) => (
                  <div key={h} className="border-b border-gray-100 w-full absolute" style={{ top: `${h * ROW_HEIGHT}px` }}></div>
                ))}
                
                {/* Course Blocks */}
                {courses.map((course) => 
                  course.timeSlots
                    .filter(slot => slot.day === dayIndex)
                    .map((slot, slotIdx) => (
                      <div
                        key={`${course.id}-${slotIdx}`}
                        className={`absolute inset-x-1 rounded-lg p-2 text-xs shadow-sm overflow-hidden border transition-all hover:z-10 hover:shadow-md cursor-pointer flex flex-col justify-center ${course.color}`}
                        style={getPositionStyle(slot)}
                      >
                        <div className="font-bold truncate">{course.name}</div>
                        <div className="truncate opacity-80">{course.code}</div>
                        <div className="truncate opacity-80">{slot.startTime} - {slot.endTime}</div>
                      </div>
                    ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGrid;