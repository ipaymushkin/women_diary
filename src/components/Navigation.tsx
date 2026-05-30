/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NavLink } from 'react-router-dom';
import { 
  Home, 
  ClipboardCheck, 
  HeartHandshake, 
  CheckSquare, 
  Sparkles, 
  Heart,
  Calendar,
  Undo2
} from 'lucide-react';
import { formatRussianDate, getLocalDateString } from '../utils/dateUtils';

interface NavigationProps {
  selectedDate: string;
  onSetToday: () => void;
}

export const navigationItems = [
  { path: '/', label: 'Главная', icon: Home },
  { path: '/daily-check', label: 'Опросник', icon: ClipboardCheck },
  { path: '/emotions', label: 'Эмоции', icon: HeartHandshake },
  { path: '/my-tasks', label: 'Мои дела', icon: CheckSquare },
  { path: '/motivation', label: 'Поддержка', icon: Sparkles },
  { path: '/self-help', label: 'Самопомощь', icon: Heart },
];

export function TopHeader({ selectedDate, onSetToday }: NavigationProps) {
  const isToday = selectedDate === getLocalDateString();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs mr-vw">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
        {/* Logo and App Title */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex w-9 h-9 rounded-full bg-brand items-center justify-center text-white font-serif font-bold text-lg shadow-sm">
            M
          </div>
          <div>
            <h1 className="text-md md:text-lg font-extrabold text-emerald-950 tracking-tight leading-none">
              MarGo
            </h1>
            <span className="hidden md:inline-block text-xs text-brand-dark font-medium font-sans mt-0.5">
              бережная поддержка для тебя
            </span>
          </div>
        </div>

        {/* Desktop Navbar (hidden on mobile) */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                id={`desktop_nav_${item.path.replace('/', 'home')}`}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-brand/12 text-brand-dark' 
                    : 'text-gray-500 hover:text-emerald-950 hover:bg-gray-50'
                  }
                `}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Selected Date indicator */}
        <div className="flex items-center space-x-1.5 md:space-x-2">
          <div className="bg-brand-light border border-brand/20 px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl md:rounded-2xl flex items-center space-x-1.5 text-xs md:text-sm text-brand-dark font-medium shadow-2xs">
            <Calendar size={13} className="text-brand shrink-0" />
            <span className="truncate max-w-[100px] xs:max-w-none">{formatRussianDate(selectedDate)}</span>
            {isToday ? (
              <span className="bg-brand text-white text-[9px] md:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md shrink-0">
                Сегодня
              </span>
            ) : null}
          </div>
          
          {!isToday && (
            <button
              onClick={onSetToday}
              id="back_to_today_btn"
              className="p-1.5 md:p-2 rounded-xl md:rounded-2xl border border-gray-100 hover:border-brand-medium hover:bg-brand-light bg-white text-brand-dark hover:text-brand-dark transition-all cursor-pointer shadow-2xs"
              title="Вернуться к сегодня"
            >
              <Undo2 size={14} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg px-2 py-1.5 pb-safe flex justify-around">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            id={`mobile_nav_${item.path.replace('/', 'home')}`}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center flex-1 py-1 px-1.5 rounded-xl transition-all duration-200
              ${isActive 
                ? 'text-brand font-semibold bg-brand-light/70 scale-102' 
                : 'text-gray-400 hover:text-gray-600'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} className={isActive ? 'text-brand' : 'text-gray-400'} />
                <span className="text-[10px] mt-1 tracking-tight truncate w-full text-center">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
