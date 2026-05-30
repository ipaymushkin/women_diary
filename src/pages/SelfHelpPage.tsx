/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Heart, 
  HelpCircle, 
  AlertOctagon, 
  Smile, 
  PhoneCall, 
  Check, 
  HelpCircle as TooltipIcon,
  Sparkles,
  Volume2,
  X,
  Droplet
} from 'lucide-react';
import { formatRussianDate } from '../utils/dateUtils';

interface SelfHelpPageProps {
  selectedDate: string;
}

interface Exercise {
  id: string;
  title: string;
  hint: string;
  description: string;
}

const EXERCISES: Exercise[] = [
  {
    id: 'breathe',
    title: 'Дыши глубоко животом',
    hint: 'Сделай 10 глубоких вдохов',
    description: 'Положи руку на живот. Сделай медленный вдох носом на 4 счета, надувая живот. Задержи дыхание на 4 счета, затем плавно выдохни ртом на 6 счетов. Повтори 10 раз.'
  },
  {
    id: 'yellow_objects',
    title: 'Найди 5 желтых предметов в комнате',
    hint: 'Визуальное заземление',
    description: 'Оглянись вокруг без спешки. Отыщи глазами и назови про себя пять любых предметов желтого цвета. Это поможет переключить мозг из паники в аналитический режим.'
  },
  {
    id: 'cheese_honey',
    title: 'Съешь кусочек сыра или ложку мёда',
    hint: 'Коррекция уровня сахара',
    description: 'Алкогольная тяга физиологически часто маскируется под резкое падение глюкозы. Ложка меда или кусочек сыра (содержит триптофан) мягко сгладят физическую потребность.'
  },
  {
    id: 'cry',
    title: 'Поплачь, если хочется',
    hint: 'Выход стресса через слезы',
    description: 'Не сдерживай эмоции, слезы — это естественная разрядка нервной системы. Они снижают уровень кортизола и приносят долгожданное физиологическое облегчение.'
  }
];

export default function SelfHelpPage({ selectedDate }: SelfHelpPageProps) {
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
  const [showPanicModal, setShowPanicModal] = useState(false);
  const [showCriedMessage, setShowCriedMessage] = useState(false);

  const storageKey = `self_help_done_${selectedDate}`;

  // Load completed items of selectedDate on mount
  useEffect(() => {
    setActiveTooltipId(null);
    setShowCriedMessage(false);
    const existing = localStorage.getItem(storageKey);
    if (existing) {
      try {
        setCompletedExerciseIds(JSON.parse(existing));
      } catch (e) {
        setCompletedExerciseIds([]);
      }
    } else {
      setCompletedExerciseIds([]);
    }
  }, [selectedDate, storageKey]);

  const saveExercises = (newIds: string[]) => {
    setCompletedExerciseIds(newIds);
    localStorage.setItem(storageKey, JSON.stringify(newIds));
    window.dispatchEvent(new Event('storage'));
  };

  const handleToggleExercise = (id: string) => {
    const isCompleted = completedExerciseIds.includes(id);
    const updated = isCompleted 
      ? completedExerciseIds.filter(item => item !== id)
      : [...completedExerciseIds, id];
    saveExercises(updated);
  };

  const handleCriedClick = () => {
    if (!completedExerciseIds.includes('cry')) {
      const updated = [...completedExerciseIds, 'cry'];
      saveExercises(updated);
    }
    setShowCriedMessage(true);
    setTimeout(() => {
      setShowCriedMessage(false);
    }, 5000);
  };

  const formattedDate = formatRussianDate(selectedDate);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 selection:bg-brand/30">
      
      {/* Intro Header */}
      <div className="flex items-center space-x-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
        <div className="p-3 bg-brand-light rounded-2xl text-brand">
          <Heart size={28} className="fill-brand/10" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-950">
            Островок самопомощи
          </h2>
          <p className="text-xs text-gray-500">
            Практики снятия тревоги и тяги за: <span className="font-semibold text-brand-dark">{formattedDate}</span>
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
        
        <div className="space-y-1">
          <h3 className="font-bold text-base text-emerald-950">
            Практические упражнения для заземления
          </h3>
          <p className="text-xs text-gray-500">
            Когда в голову приходит навязчивая мысль об алкоголе, это химическая реакция мозга. Выполняй эти простые шаги один за другим, чтобы физически сбросить напряжение:
          </p>
        </div>

        {/* Grounding list */}
        <div className="space-y-4">
          {EXERCISES.map((ex) => {
            const isCompleted = completedExerciseIds.includes(ex.id);
            const isBreathe = ex.id === 'breathe';
            const isCry = ex.id === 'cry';

            return (
              <div 
                key={ex.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col space-y-3 relative
                  ${isCompleted 
                    ? 'border-brand bg-brand-light/20' 
                    : 'border-gray-100 bg-gray-50/20 hover:bg-gray-50/50'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    {/* Tick Checkbox */}
                    <button
                      id={`ex_check_${ex.id}`}
                      type="button"
                      onClick={() => handleToggleExercise(ex.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5
                        ${isCompleted 
                          ? 'bg-brand border-brand text-white' 
                          : 'border-gray-200 bg-white hover:border-brand-medium'
                        }
                      `}
                    >
                      {isCompleted && <Check size={14} strokeWidth={3} />}
                    </button>
                    
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-sm font-bold text-emerald-950 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                          {ex.title}
                        </span>
                        
                        {/* BREATHE TOOLTIP HANDLER */}
                        {isBreathe && (
                          <div className="relative inline-block md:static">
                            <button
                              id="breathe_ex_tooltip_btn"
                              type="button"
                              onClick={() => setActiveTooltipId(activeTooltipId === 'breathe' ? null : 'breathe')}
                              onMouseEnter={() => setActiveTooltipId('breathe')}
                              onMouseLeave={() => setActiveTooltipId(null)}
                              className="text-brand hover:text-brand-dark p-0.5 rounded-full hover:bg-brand-light transition-colors cursor-pointer"
                              title="Показать подсказку"
                            >
                              <TooltipIcon size={14} />
                            </button>
                            
                            {/* Breathe popup tooltip */}
                            {activeTooltipId === 'breathe' && (
                              <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-4 z-50 bottom-full mb-2 w-48 bg-brand-dark text-white p-2.5 rounded-xl shadow-lg border border-brand/20 text-[10px] md:text-xs leading-normal animate-fade-in text-center font-semibold">
                                <Sparkles size={12} className="inline mr-1 text-brand-medium" />
                                {ex.hint} 🧘‍♀️
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 italic">{ex.hint}</p>
                    </div>
                  </div>

                  {/* SPECIAL ACTIONS FOR SPECIFIC ITEMS */}
                  {isCry && (
                    <button
                      id="i_cried_btn"
                      type="button"
                      onClick={handleCriedClick}
                      className="px-3 py-1.5 bg-brand-light hover:bg-brand/10 text-brand-dark hover:text-brand text-xs font-bold rounded-lg border border-brand/12 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Droplet size={12} className="text-brand" />
                      <span>Я поплакала</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed pl-9">
                  {ex.description}
                </p>

                {/* Interactive cry status success message */}
                {isCry && showCriedMessage && (
                  <div className="bg-brand-light/70 p-3 rounded-xl border border-brand/15 text-xs text-brand-dark pl-9 animate-fade-in flex items-center gap-1.5">
                    <Smile size={14} className="text-brand" />
                    <span>Умница, дорогая. Слезы выводят гормоны стресса и приносят облегчение. Не сдерживай себя, мы с тобой.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PANIC BUTTON ZONE */}
        <div className="pt-6 border-t border-gray-100 flex flex-col items-center text-center space-y-4">
          <div className="space-y-1">
            <h4 className="text-lg md:text-xl font-extrabold text-rose-950">
              Не справляешься?
            </h4>
          </div>

          <button
            id="panic_sos_button"
            type="button"
            onClick={() => setShowPanicModal(true)}
            className="w-full max-w-md py-4 px-6 bg-alarm hover:bg-alarm-hover text-white font-extrabold rounded-2xl text-sm tracking-wider uppercase shadow-md shadow-alarm/20 hover:shadow-lg transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 animate-pulse hover:animate-none"
          >
            <PhoneCall size={18} className="animate-bounce" />
            <span>ТРЕВОЖНАЯ КНОПКА (SOS)</span>
          </button>
        </div>

      </div>

      {/* EMERGENCY SOS DETAILS MODAL */}
      {showPanicModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 selection:bg-brand/30 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 shadow-2xl relative space-y-5">
            
            {/* Close button */}
            <button
              id="panic_modal_close_btn"
              type="button"
              onClick={() => setShowPanicModal(false)}
              className="absolute top-4.5 right-4.5 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-emerald-950 transition-colors cursor-pointer"
              title="Закрыть"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-alarm-light text-alarm rounded-full flex items-center justify-center mx-auto">
                <AlertOctagon size={24} className="animate-pulse" />
              </div>
              <h3 className="font-bold text-lg text-emerald-950">
                Задержи дыхание, дорогая.
              </h3>
              <p className="text-xs text-gray-500 leading-normal">
                Ты сейчас напугана, но этот приступ тяги обязательно пройдет. Он длится в среднем не более 15 минут. Давай переждем его вместе.
              </p>
            </div>

            {/* Practical instant panic reduction actions */}
            <div className="bg-alarm-light/35 p-4 rounded-2xl border border-alarm/10 text-xs text-emerald-950 space-y-2">
              <p className="font-bold text-alarm-hover flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <Sparkles size={12} />
              </p>
              <ul className="list-disc pl-4 space-y-1 text-gray-700">
                <li>Сделай глоток ледяной воды.</li>
                <li>Ополосни лицо холодной водой.</li>
                <li>Набери наставницу или службу поддержки.</li>
              </ul>
            </div>

            {/* Phone Numbers card */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Твой куратор / Линия помощи
                </span>
                <a 
                  id="coordinator_phone_anchor"
                  href="tel:+78002000122" 
                  className="block text-base font-extrabold text-brand-dark hover:text-brand transition-colors"
                >
                  +7 (800) 200-01-22
                </a>
                <span className="block text-[10px] text-gray-400 italic">
                  Бесплатная, круглосуточная поддержка женщин в АА
                </span>
              </div>
              <a 
                href="tel:+78002000122" 
                id="panic_call_btn"
                className="w-10 h-10 rounded-full bg-brand hover:bg-brand-hover text-white flex items-center justify-center cursor-pointer shadow-sm transition-all hover:scale-105 shrink-0"
              >
                <PhoneCall size={16} />
              </a>
            </div>

            <div className="flex gap-2.5">
              <button
                id="panic_modal_cancel_btn"
                onClick={() => setShowPanicModal(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Я справлюсь
              </button>
              
              <a
                id="telegram_coordinator_anchor"
                href="https://t.me/aa_ru"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl text-xs text-center transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
              >
                Написать в TG
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
