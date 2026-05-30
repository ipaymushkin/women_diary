/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getLocalDateString } from '../utils/dateUtils';

interface CalendarViewProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const WEEKDAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function CalendarView({ selectedDate, onSelectDate }: CalendarViewProps) {
  const [currentYear, setCurrentYear] = useState<number>(() => {
    const d = new Date(selectedDate);
    return isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  });
  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    const d = new Date(selectedDate);
    return isNaN(d.getTime()) ? new Date().getMonth() : d.getMonth();
  });

  const [completedDays, setCompletedDays] = useState<string[]>([]);

  // Scan localStorage for questionnaire check-ins in the current month
  const scanCompletedDays = () => {
    const found: string[] = [];
    const prefix = 'daily_check_';
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const datePart = key.slice(prefix.length); // YYYY-MM-DD
        found.push(datePart);
      }
    }
    setCompletedDays(found);
  };

  useEffect(() => {
    scanCompletedDays();
    // Also listen to storage events to stay sync'd
    const handleStorageChange = () => scanCompletedDays();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const todayStr = getLocalDateString();

  // Days calculations
  // Get day of week for the 1st of month (Monday = 0, ..., Sunday = 6)
  const firstDayDate = new Date(currentYear, currentMonth, 1);
  let startDayOfWeek = firstDayDate.getDay();
  // Adjust so Monday is 0, Sunday is 6
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const daysArray = [];
  // For matching structure we pad empty slots before first day
  for (let i = 0; i < startDayOfWeek; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= totalDaysInMonth; i++) {
    daysArray.push(i);
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-emerald-950">
          {MONTHS_RU[currentMonth]} {currentYear}
        </h3>
        <div className="flex space-x-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            title="Предыдущий месяц"
            id="calendar_prev_month_btn"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => {
              const d = new Date();
              setCurrentMonth(d.getMonth());
              setCurrentYear(d.getFullYear());
            }}
            className="px-2.5 py-1 text-xs text-brand-dark hover:bg-brand-light font-medium rounded-lg transition-colors"
            id="calendar_today_btn"
          >
            Сегодня
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            title="Следующий месяц"
            id="calendar_next_month_btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {WEEKDAYS_RU.map((day, idx) => (
          <div
            key={day}
            className={`text-xs font-medium py-1 ${
              idx >= 5 ? 'text-rose-400' : 'text-gray-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {daysArray.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          // Build string date for this slot
          const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = dayStr === selectedDate;
          const isToday = dayStr === todayStr;
          const hasCheckIn = completedDays.includes(dayStr);

          return (
            <button
              key={`day-${day}`}
              id={`calendar_day_${dayStr}`}
              onClick={() => onSelectDate(dayStr)}
              className={`
                relative aspect-square rounded-xl text-sm font-medium flex flex-col items-center justify-center transition-all duration-150 cursor-pointer group
                ${isSelected 
                  ? 'bg-brand text-white shadow-md shadow-brand/20 scale-105' 
                  : isToday
                  ? 'border-2 border-brand-medium text-brand-dark font-bold hover:bg-brand-light'
                  : 'hover:bg-brand-light/50 text-emerald-950'
                }
              `}
            >
              <span className={isSelected ? 'font-bold' : ''}>{day}</span>
              
              {/* Questionnaire filled green indicator */}
              {hasCheckIn && (
                <span 
                  className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-emerald-500 shadow-xs'
                  }`}
                  title="Опросник заполнен в этот день"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          <span>Опросник заполнен</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-lg border-2 border-brand-medium inline-block" />
          <span>Сегодня</span>
        </div>
      </div>
    </div>
  );
}
