export interface TimeSlot {
  day: number; // 0 = Saturday, 1 = Sunday, ..., 5 = Thursday
  startTime: string; // "08:00"
  endTime: string; // "10:00"
}

export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  group: string;
  units: number;
  timeSlots: TimeSlot[];
  examDate: string; // "1403/10/20 08:00"
  color?: string;
}

export enum DayOfWeek {
  Saturday = 0,
  Sunday = 1,
  Monday = 2,
  Tuesday = 3,
  Wednesday = 4,
  Thursday = 5,
  Friday = 6
}

export const PERSIAN_DAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه'
];

export const COLORS = [
  'bg-red-100 border-red-300 text-red-800',
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-green-100 border-green-300 text-green-800',
  'bg-yellow-100 border-yellow-300 text-yellow-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-pink-100 border-pink-300 text-pink-800',
  'bg-indigo-100 border-indigo-300 text-indigo-800',
  'bg-orange-100 border-orange-300 text-orange-800',
  'bg-teal-100 border-teal-300 text-teal-800',
  'bg-cyan-100 border-cyan-300 text-cyan-800'
];