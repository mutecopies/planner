import React from 'react';
import { Course } from '../types';
import { CalendarDays, Clock } from 'lucide-react';

interface ExamListProps {
  courses: Course[];
}

const ExamList: React.FC<ExamListProps> = ({ courses }) => {
  // Simple string sort, assuming format YYYY/MM/DD works reasonably well or just grouping visually
  const sortedCourses = [...courses].sort((a, b) => a.examDate.localeCompare(b.examDate));

  if (courses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 bg-white rounded-2xl border border-gray-200">
        <CalendarDays size={48} className="mx-auto mb-2 opacity-50" />
        <p>هیچ درسی انتخاب نشده است.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center">
        <CalendarDays className="text-indigo-600 ml-2" size={20} />
        <h2 className="font-bold text-indigo-900">برنامه امتحانات</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {sortedCourses.map((course) => (
          <div key={course.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center group">
            <div className="flex items-center">
               <div className={`w-3 h-3 rounded-full ml-3 ${course.color ? course.color.split(' ')[0].replace('bg-', 'bg-') : 'bg-gray-300'}`}></div>
               <div>
                  <h4 className="font-bold text-gray-800">{course.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{course.instructor}</p>
               </div>
            </div>
            <div className="text-left">
              <div className="font-mono font-bold text-indigo-600 text-sm bg-indigo-50 px-2 py-1 rounded-md inline-block mb-1">
                {course.examDate.split(' ')[0]}
              </div>
              {course.examDate.split(' ')[1] && (
                 <div className="flex items-center justify-end text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    <span>{course.examDate.split(' ')[1]}</span>
                 </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamList;