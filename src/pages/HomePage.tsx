/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  Heart,
  Smile,
  ClipboardCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  Info
} from 'lucide-react';
import CalendarView from '../components/CalendarView';
import { getDaysSince, formatRussianDate, getLocalDateString } from '../utils/dateUtils';

interface HomePageProps {
  sobrietyStart: string;
  onUpdateSobrietyStart: (dateStr: string) => void;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

// Grammatical declension of Russian word "день" (day)
function getRussianDaysWord(days: number): string {
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod100 >= 11 && mod100 <= 14) {
    return 'дней';
  }
  if (mod10 === 1) {
    return 'день';
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return 'дня';
  }
  return 'дней';
}

export default function HomePage({ 
  sobrietyStart, 
  onUpdateSobrietyStart,
  selectedDate,
  onSelectDate
}: HomePageProps) {
  const navigate = useNavigate();
  const [daysCount, setDaysCount] = useState<number>(0);
  const [isEditingStart, setIsEditingStart] = useState(false);
  const [newStartDate, setNewStartDate] = useState(sobrietyStart);
  const [editError, setEditError] = useState('');
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  const todayStr = getLocalDateString();

  useEffect(() => {
    const days = getDaysSince(sobrietyStart, todayStr);
    // Ensure we don't show negative days if start is in future (though system guards this)
    setDaysCount(days < 0 ? 0 : days);
  }, [sobrietyStart, todayStr]);

  // Check if daily check-in has been completed for today/selectedDate
  useEffect(() => {
    const checkKey = `daily_check_${selectedDate}`;
    setHasCheckedInToday(!!localStorage.getItem(checkKey));
  }, [selectedDate]);

  const handleUpdateStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStartDate) {
      setEditError('Укажи корректную дату.');
      return;
    }
    const selectedTime = new Date(newStartDate).getTime();
    if (selectedTime > new Date().getTime() + 24 * 60 * 60 * 1000) {
      setEditError('Эта дата еще не наступила.');
      return;
    }
    onUpdateSobrietyStart(newStartDate);
    setIsEditingStart(false);
    setEditError('');
  };

  const activeDateFormatted = formatRussianDate(selectedDate);
  const isSelectedToday = selectedDate === todayStr;

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto pb-16 selection:bg-brand/30">
      
      {/* Intro comforting banner */}
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
            Привет, дорогая! <Sparkles className="text-brand w-5 h-5 animate-pulse" />
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Рады видеть тебя. Твой путь уникален, и в этом доме нет места осуждению — только искренняя забота и поддержка.
          </p>
        </div>
        <div className="hidden lg:flex items-center space-x-2 text-xs bg-brand-light border border-brand/10 text-brand-dark px-3.5 py-2 rounded-2xl font-medium">
          <Info size={14} className="shrink-0" />
          <span>Все данные в безопасности на твоем телефоне/компьютере</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN: Sobriety days counter & start date controller */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="bg-linear-to-b from-brand to-brand-dark text-white p-6 md:p-7 rounded-3xl shadow-lg relative overflow-hidden flex-1 flex flex-col justify-between min-h-[300px]">
            {/* Soft decorative cloud */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-xl pointer-events-none" />

            <div className="relative">
              <span className="text-[11px] uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full font-bold">
                Твой Путь Свободы
              </span>
              <p className="text-xs text-brand-light/90 mt-3 font-medium leading-relaxed">
                Ты уверенными шагами идешь вперед. Позади чистые рассветы и бережное отношение к себе:
              </p>
            </div>

            <div className="relative my-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-6xl md:text-7xl font-extrabold tracking-tight" id="sobriety_days_count">
                  {daysCount}
                </span>
                <span className="text-2xl md:text-3xl font-medium text-brand-light">
                  {getRussianDaysWord(daysCount)}
                </span>
              </div>
              <p className="text-xs text-brand-light/80 mt-1 italic">
                {daysCount === 0 
                  ? 'Идет первый день твоего прекрасного пути. Главное — прямо сейчас.' 
                  : 'Трезвости, легкости и любви к собственной жизни'
                }
              </p>
            </div>

            <div className="relative pt-4 border-t border-white/10 flex items-center justify-between text-xs text-brand-light">
              <div>
                <span>Начало ремиссии:</span>
                <p className="font-semibold text-white">{formatRussianDate(sobrietyStart)}</p>
              </div>
              
              {!isEditingStart ? (
                <button
                  onClick={() => setIsEditingStart(true)}
                  id="edit_sobriety_start_btn"
                  className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white font-semibold py-1.5 px-3 rounded-lg transition-all cursor-pointer"
                  title="Изменить дату начала"
                >
                  <Edit2 size={12} />
                  <span>Изменить</span>
                </button>
              ) : null}
            </div>
          </div>

          {/* Inline Edit Form for Sobriety Date */}
          {isEditingStart && (
            <div className="bg-white p-5 rounded-3xl border border-brand-medium/20 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <Calendar size={16} className="text-brand" />
                Сбросить или скорректировать дату?
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Дорогая, срывы и ошибки — это часть процесса. Относись к себе бережно. Если нужно изменить дату начала трезвости, мы с тобой. Выбери новую дату:
              </p>
              <form onSubmit={handleUpdateStart} className="space-y-3">
                <input
                  type="date"
                  max={todayStr}
                  value={newStartDate}
                  onChange={(e) => {
                    setNewStartDate(e.target.value);
                    setEditError('');
                  }}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-brand outline-none"
                  id="new_sobriety_start_input"
                />
                {editError && <p className="text-xs text-rose-500">{editError}</p>}
                
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    id="save_new_sobriety_start_btn"
                    className="flex-1 py-1.5 px-3 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingStart(false);
                      setNewStartDate(sobrietyStart);
                      setEditError('');
                    }}
                    id="cancel_new_sobriety_start_btn"
                    className="py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Calendar and actions */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Main Action Box */}
          <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand bg-brand-light px-2.5 py-1 rounded-md">
                  {isSelectedToday ? 'Сегодняшний фокус' : 'Просмотр архива'}
                </span>
                <h3 className="font-bold text-lg text-emerald-950 mt-1">
                  Дневник на {activeDateFormatted}
                </h3>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${hasCheckedInToday ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-400'}`}>
                {hasCheckedInToday ? <CheckCircle2 size={18} /> : <Calendar size={18} />}
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {hasCheckedInToday 
                ? 'Отлично, дорогая! Опросник на этот день уже заполнен. Ты можешь нажать на кнопку ниже, чтобы проверить или отредактировать свои ответы в случае необходимости.'
                : 'Твоя искренность перед собой — залог выздоровления. Пожалуйста, поделись самочувствием и эмоциями за выбранный день. Это поможет отследить триггеры и убережет от срывов.'
              }
            </p>

            <button
              onClick={() => navigate('/daily-check')}
              id="fill_questionnaire_btn_home"
              className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer text-sm
                ${hasCheckedInToday 
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100' 
                  : 'bg-brand hover:bg-brand-hover text-white shadow-xs'
                }
              `}
            >
              <ClipboardCheck size={16} />
              <span>
                {hasCheckedInToday ? 'Редактировать опросник' : 'Заполнить сегодняшний опросник'}
              </span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Calendar view integration */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-widest pl-1">
              Твой календарь трезвости
            </h4>
            <CalendarView 
              selectedDate={selectedDate} 
              onSelectDate={onSelectDate} 
            />
            <p className="text-[11px] text-gray-500 text-center italic mt-1 leading-normal">
              Кликни на любой день в календаре, чтобы выбрать его и посмотреть/внести записи других разделов меню!
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
