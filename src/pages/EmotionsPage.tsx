/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Smile, 
  Frown, 
  CheckCircle, 
  Info,
  Sparkles
} from 'lucide-react';
import { formatRussianDate } from '../utils/dateUtils';
import { EmotionsDay } from '../types';

interface EmotionsPageProps {
  selectedDate: string;
}

const POSITIVE_EMOTIONS = [
  { id: 'радость', label: 'Радость' },
  { id: 'благодарность', label: 'Благодарность' },
  { id: 'умиротворение', label: 'Умиротворение' },
  { id: 'спокойствие', label: 'Спокойствие' },
  { id: 'надежда', label: 'Надежда' }
];

const NEGATIVE_EMOTIONS = [
  { id: 'обида', label: 'Обида' },
  { id: 'одиночество', label: 'Одиночество' },
  { id: 'страх', label: 'Страх' },
  { id: 'гнев', label: 'Гнев' },
  { id: 'тревога', label: 'Тревога' },
  { id: 'вина', label: 'Вина' }
];

export default function EmotionsPage({ selectedDate }: EmotionsPageProps) {
  const [selectedPositive, setSelectedPositive] = useState<string[]>([]);
  const [selectedNegative, setSelectedNegative] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const storageKey = `emotions_${selectedDate}`;

  // Load existing records for active date
  useEffect(() => {
    setIsSaved(false);
    const existing = localStorage.getItem(storageKey);
    if (existing) {
      try {
        const parsed = JSON.parse(existing) as EmotionsDay;
        setSelectedPositive(parsed.positive || []);
        setSelectedNegative(parsed.negative || []);
      } catch (e) {
        console.error('Error parsing emotions:', e);
        setSelectedPositive([]);
        setSelectedNegative([]);
      }
    } else {
      setSelectedPositive([]);
      setSelectedNegative([]);
    }
  }, [selectedDate, storageKey]);

  const togglePositive = (id: string) => {
    setIsSaved(false);
    setSelectedPositive(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleNegative = (id: string) => {
    setIsSaved(false);
    setSelectedNegative(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    const payload: EmotionsDay = {
      positive: selectedPositive,
      negative: selectedNegative
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
    setIsSaved(true);
    
    // Dispatch safety event
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => {
      setIsSaved(false);
    }, 4000);
  };

  const formattedDate = formatRussianDate(selectedDate);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 selection:bg-brand/30">
      
      {/* Intro Header */}
      <div className="flex items-center space-x-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
        <div className="p-3 bg-brand-light rounded-2xl text-brand">
          <HeartHandshake size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-950">
            Дневник твоих чувств
          </h2>
          <p className="text-xs text-gray-500">
            Отметь эмоции, которые ты проживала в течение дня: <span className="font-semibold text-brand-dark">{formattedDate}</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-8">
        
        {/* Support Banner about emotions */}
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/80 text-xs text-gray-600 flex items-start gap-2.5">
          <Info size={16} className="text-brand shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Дорогая, в ремиссии чувства могут нахлынуть с новой, силой. <span className="font-semibold text-emerald-950">Все эмоции — правильные</span>. Тебе не нужно быть «идеально счастливой», чтобы оставаться трезвой. Замечая свою злость или тревогу, ты делаешь их видимыми и забираешь у них власть над своими действиями.
          </p>
        </div>

        {/* Emotion Picker Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column 1: Positive Emotions */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-brand flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <Smile size={18} />
              Положительные эмоции (созидающие)
            </h3>
            <p className="text-[11px] text-gray-400">
              Даже крошечные моменты благодарности или покоя важны. Давай зафиксируем их.
            </p>
            
            <div className="flex flex-col gap-2.5 pt-2">
              {POSITIVE_EMOTIONS.map((item) => {
                const checked = selectedPositive.includes(item.id);
                return (
                  <button
                    key={item.id}
                    id={`emotion_pos_btn_${item.id}`}
                    type="button"
                    onClick={() => togglePositive(item.id)}
                    className={`
                      px-4 py-3 rounded-2xl border transition-all duration-150 flex items-center justify-between text-left text-sm font-medium cursor-pointer
                      ${checked 
                        ? 'border-brand bg-brand-light/40 text-brand-dark font-bold scale-[1.01]' 
                        : 'border-gray-100 hover:border-brand-medium hover:bg-gray-50/40 text-gray-700'
                      }
                    `}
                  >
                    <span>{item.label}</span>
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all
                      ${checked ? 'bg-brand border-brand text-white' : 'border-gray-200 bg-white'}
                    `}>
                      {checked && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Negative Emotions */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-alarm flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <Frown size={18} />
              Отрицательные эмоции (разрушающие)
            </h3>
            <p className="text-[11px] text-gray-400">
              Помни, испытывать боль или обиду — абсолютно нормально. Прими их с сочувствием.
            </p>
            
            <div className="flex flex-col gap-2.5 pt-2">
              {NEGATIVE_EMOTIONS.map((item) => {
                const checked = selectedNegative.includes(item.id);
                return (
                  <button
                    key={item.id}
                    id={`emotion_neg_btn_${item.id}`}
                    type="button"
                    onClick={() => toggleNegative(item.id)}
                    className={`
                      px-4 py-3 rounded-2xl border transition-all duration-150 flex items-center justify-between text-left text-sm font-medium cursor-pointer
                      ${checked 
                        ? 'border-alarm bg-alarm-light/40 text-alarm-hover font-bold scale-[1.01]' 
                        : 'border-gray-100 hover:border-alarm-hover/40 hover:bg-gray-50/40 text-gray-700'
                      }
                    `}
                  >
                    <span>{item.label}</span>
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all
                      ${checked ? 'bg-alarm border-alarm text-white' : 'border-gray-200 bg-white'}
                    `}>
                      {checked && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Save feedback block */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          {isSaved && (
            <div className="bg-emerald-50 border border-emerald-100 flex items-center space-x-2 p-3 rounded-xl animate-fade-in text-emerald-800 text-xs font-semibold">
              <CheckCircle size={16} className="text-emerald-500 shrink-0" />
              <span>Твои чувства сохранены на сегодня. Замечая их, ты заботишься о себе!</span>
            </div>
          )}

          <button
            onClick={handleSave}
            id="emotions_save_btn"
            className="w-full py-3.5 px-4 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-brand/10 hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-1.5"
          >
            <Sparkles size={16} className="text-white" />
            <span>Сохранить эмоции за этот день</span>
          </button>
        </div>

      </div>
    </div>
  );
}
