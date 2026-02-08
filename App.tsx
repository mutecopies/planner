import React, { useState, useEffect } from 'react';
import { Course, COLORS } from './types';
import ScheduleGrid from './components/ScheduleGrid';
import CourseCard from './components/CourseCard';
import ExamList from './components/ExamList';
import AiImportModal from './components/AiImportModal';
import { Plus, AlertTriangle, BookOpen, Layers, Calendar, Clock, LayoutGrid, Printer, Trash, Info } from 'lucide-react';

type Tab = 'courses' | 'schedule' | 'exams';

const App: React.FC = () => {
  // Load initial state from localStorage if available
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const savedCourses = localStorage.getItem('uniplanner_courses');
      return savedCourses ? JSON.parse(savedCourses) : [];
    } catch (e) {
      console.error("Failed to load courses from storage", e);
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('courses');

  // Save to localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem('uniplanner_courses', JSON.stringify(courses));
  }, [courses]);

  // Check for conflicts whenever courses change
  useEffect(() => {
    const newConflicts: string[] = [];
    
    for (let i = 0; i < courses.length; i++) {
      for (let j = i + 1; j < courses.length; j++) {
        const c1 = courses[i];
        const c2 = courses[j];
        
        if (hasConflict(c1, c2)) {
          if (!newConflicts.includes(c1.id)) newConflicts.push(c1.id);
          if (!newConflicts.includes(c2.id)) newConflicts.push(c2.id);
        }
      }
    }
    setConflicts(newConflicts);
  }, [courses]);

  const hasConflict = (c1: Course, c2: Course): boolean => {
    return c1.timeSlots.some(slot1 => 
      c2.timeSlots.some(slot2 => {
        if (slot1.day !== slot2.day) return false;
        
        const start1 = convertTimeToDecimal(slot1.startTime);
        const end1 = convertTimeToDecimal(slot1.endTime);
        const start2 = convertTimeToDecimal(slot2.startTime);
        const end2 = convertTimeToDecimal(slot2.endTime);

        return (start1 < end2 && start2 < end1);
      })
    );
  };

  const convertTimeToDecimal = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h + m / 60;
  };

  const handleAddCourses = (newCourses: Course[]) => {
    const coloredCourses = newCourses.map((course, index) => ({
      ...course,
      color: COLORS[(courses.length + index) % COLORS.length]
    }));
    setCourses(prev => [...prev, ...coloredCourses]);
  };

  const removeCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('آیا مطمئن هستید؟ تمام دروس حذف خواهند شد.')) {
      setCourses([]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalUnits = courses.reduce((sum, c) => sum + (c.units || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Layers className="text-indigo-600 ml-2" />
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hidden sm:block">
                تنظیم واحد
              </h1>
              <h1 className="text-xl font-bold text-indigo-600 sm:hidden">
                تنظیم واحد
              </h1>
            </div>
            
            {/* Desktop Tabs */}
            <div className="hidden md:flex space-x-1 space-x-reverse bg-gray-100/50 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'courses' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LayoutGrid size={16} className="ml-2" />
                دروس من
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'schedule' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Calendar size={16} className="ml-2" />
                برنامه هفتگی
              </button>
              <button
                onClick={() => setActiveTab('exams')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'exams' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Clock size={16} className="ml-2" />
                برنامه امتحانات
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-200 transition-all"
              >
                <Plus size={18} className="ml-2" />
                <span className="hidden sm:inline">افزودن درس</span>
                <span className="sm:hidden">افزودن</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden border-t border-gray-100 flex overflow-x-auto p-1 bg-white hide-scrollbar">
           <button
                onClick={() => setActiveTab('courses')}
                className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeTab === 'courses' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'
                }`}
              >
                <LayoutGrid size={16} className="ml-2" />
                دروس
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeTab === 'schedule' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'
                }`}
              >
                <Calendar size={16} className="ml-2" />
                هفتگی
              </button>
              <button
                onClick={() => setActiveTab('exams')}
                className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeTab === 'exams' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'
                }`}
              >
                <Clock size={16} className="ml-2" />
                امتحانات
              </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
        
        {/* Tab Content: Courses */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-gray-500 text-sm font-medium mb-1">واحد انتخاب شده</h2>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-gray-800 ml-2">{totalUnits}</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md">مجاز</span>
                  </div>
                </div>
                <BookOpen className="text-indigo-100 h-12 w-12" />
              </div>

              {conflicts.length > 0 ? (
                <div className="bg-red-50 rounded-2xl p-5 border border-red-100 flex items-center shadow-sm">
                   <div className="bg-red-100 p-3 rounded-full ml-4">
                      <AlertTriangle className="text-red-600 h-6 w-6" />
                   </div>
                   <div>
                      <h3 className="font-bold text-red-800 text-lg">هشدار تداخل!</h3>
                      <p className="text-red-600 text-sm mt-1">{conflicts.length} درس دارای تداخل زمانی هستند.</p>
                   </div>
                </div>
              ) : (
                <div className="bg-green-50 rounded-2xl p-5 border border-green-100 flex items-center shadow-sm">
                   <div className="bg-green-100 p-3 rounded-full ml-4">
                      <Calendar className="text-green-600 h-6 w-6" />
                   </div>
                   <div>
                      <h3 className="font-bold text-green-800 text-lg">برنامه بدون تداخل</h3>
                      <p className="text-green-600 text-sm mt-1">هیچ تداخلی در برنامه هفتگی شما وجود ندارد.</p>
                   </div>
                </div>
              )}
            </div>

            {/* Course Grid */}
            <div className="space-y-3">
               <div className="flex justify-between items-center px-1">
                 <h3 className="font-bold text-gray-700 text-lg flex items-center">
                   لیست دروس من 
                   <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full mr-3">{courses.length} درس</span>
                 </h3>
                 {courses.length > 0 && (
                   <button 
                    onClick={handleClearAll}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center px-3 py-1 rounded-lg hover:bg-red-50 transition-colors no-print"
                   >
                     <Trash size={16} className="ml-1" />
                     حذف همه
                   </button>
                 )}
               </div>
               
               {courses.length === 0 ? (
                 <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                    <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                       <LayoutGrid className="text-indigo-500" size={32}/>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">لیست دروس خالی است</h3>
                    <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
                      برای شروع، روی دکمه "افزودن درس" کلیک کنید و متن برنامه درسی خود را وارد نمایید.
                    </p>
                    <button 
                      onClick={() => setIsModalOpen(true)} 
                      className="mt-6 text-indigo-600 font-medium hover:text-indigo-800 hover:underline"
                    >
                      افزودن اولین درس
                    </button>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                   {courses.map(course => (
                     <CourseCard 
                        key={course.id} 
                        course={course} 
                        onRemove={removeCourse} 
                        hasConflict={conflicts.includes(course.id)}
                      />
                   ))}
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Tab Content: Schedule */}
        {activeTab === 'schedule' && (
          <div className="animate-fadeIn">
            {courses.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-end no-print">
                   <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                   >
                     <Printer size={16} />
                     چاپ برنامه
                   </button>
                </div>
                <div className="print-container">
                  <h2 className="hidden print:block text-2xl font-bold mb-4 text-center">برنامه هفتگی دانشگاه</h2>
                  <ScheduleGrid courses={courses} />
                </div>
              </div>
            ) : (
               <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                  <Calendar className="mx-auto text-gray-300 mb-4" size={64} />
                  <p className="text-gray-500 text-lg">برای مشاهده برنامه هفتگی، ابتدا درس‌های خود را اضافه کنید.</p>
                  <button onClick={() => setActiveTab('courses')} className="text-indigo-600 font-medium mt-4 hover:underline">
                    بازگشت به انتخاب واحد
                  </button>
               </div>
            )}
          </div>
        )}

        {/* Tab Content: Exams */}
        {activeTab === 'exams' && (
          <div className="animate-fadeIn max-w-4xl mx-auto">
             {courses.length > 0 && (
                <div className="flex justify-end no-print mb-4">
                   <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                   >
                     <Printer size={16} />
                     چاپ لیست امتحانات
                   </button>
                </div>
             )}
             <div className="print-container">
                <h2 className="hidden print:block text-2xl font-bold mb-6 text-center">برنامه امتحانات</h2>
                <ExamList courses={courses} />
             </div>
          </div>
        )}

      </main>

      <AiImportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onImport={handleAddCourses}
      />
    </div>
  );
};

export default App;