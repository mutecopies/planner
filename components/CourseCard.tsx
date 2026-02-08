import React from 'react';
import { Course, PERSIAN_DAYS } from '../types';
import { Trash2, Calendar, Clock, GraduationCap } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onRemove: (id: string) => void;
  hasConflict?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onRemove, hasConflict }) => {
  return (
    <div className={`relative p-4 mb-3 rounded-xl border-2 transition-all shadow-sm ${
      hasConflict 
        ? 'bg-red-50 border-red-500' 
        : `${course.color || 'bg-white border-gray-200'} hover:shadow-md`
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{course.name}</h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <span className="bg-gray-200 px-2 py-0.5 rounded text-xs ml-2">
              {course.code}
            </span>
            <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">
              گروه {course.group}
            </span>
          </div>
        </div>
        <button 
          onClick={() => onRemove(course.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          title="حذف درس"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center">
          <GraduationCap size={14} className="ml-2 text-gray-400" />
          <span>{course.instructor}</span>
        </div>
        
        {course.timeSlots.map((slot, idx) => (
          <div key={idx} className="flex items-center">
            <Clock size={14} className="ml-2 text-gray-400" />
            <span>
              {PERSIAN_DAYS[slot.day]} {slot.startTime} تا {slot.endTime}
            </span>
          </div>
        ))}

        <div className="flex items-center text-amber-700 mt-2 bg-amber-50 p-1.5 rounded-lg border border-amber-100">
          <Calendar size={14} className="ml-2" />
          <span className="text-xs font-medium">امتحان: {course.examDate}</span>
        </div>
      </div>

      {hasConflict && (
        <div className="absolute top-2 left-10 text-red-600 text-xs font-bold bg-white px-2 py-1 rounded-full border border-red-200 shadow-sm animate-pulse">
          تداخل زمانی!
        </div>
      )}
    </div>
  );
};

export default CourseCard;