/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Smile, 
  HelpCircle, 
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { formatRussianDate } from '../utils/dateUtils';
import { DailyCheck } from '../types';

interface DailyCheckPageProps {
  selectedDate: string;
}

export default function DailyCheckPage({ selectedDate }: DailyCheckPageProps) {
  const [headache, setHeadache] = useState<'yes' | 'no'>('no');
  const [menstrual, setMenstrual] = useState<'yes' | 'no'>('no');
  const [comment, setComment] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const storageKey = `daily_check_${selectedDate}`;

  // Load existing values on selectedDate change
  useEffect(() => {
    setIsSaved(false);
    const existingData = localStorage.getItem(storageKey);
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData) as DailyCheck;
        setHeadache(parsed.headache || 'no');
        setMenstrual(parsed.menstrual || 'no');
        setComment(parsed.comment || '');
      } catch (e) {
        console.error('Error parsing daily check:', e);
        // Fallback defaults
        setHeadache('no');
        setMenstrual('no');
        setComment('');
      }
    } else {
      // Clear or set default
      setHeadache('no');
      setMenstrual('no');
      setComment('');
    }
  }, [selectedDate, storageKey]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: DailyCheck = {
      headache,
      menstrual,
      comment
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
    setIsSaved(true);
    
    // Trigger standard storage custom event so components (like Calendar) react
    window.dispatchEvent(new Event('storage'));

    // Fade save alert after a few seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 4000);
  };

  const formattedDate = formatRussianDate(selectedDate);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 selection:bg-brand/30">
      
      {/* Header section */}
      <div className="flex items-center space-x-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
        <div className="p-3 bg-brand-light rounded-2xl text-brand">
          <ClipboardCheck size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-950">
            Опросник самочувствия
          </h2>
          <p className="text-xs text-gray-500">
            Записи привязаны к выбранной дате: <span className="font-semibold text-brand-dark">{formattedDate}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Form Inputs (2 cols on desktop) */}
        <form onSubmit={handleSave} className="md:col-span-2 space-y-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
          
          <div className="space-y-4">
            <h3 className="font-bold text-base text-emerald-950 border-b border-gray-50 pb-2">
              Твоё сегодняшнее состояние
            </h3>
            
            {/* QUESTION 1: Headache */}
            <div className="space-y-2 p-1.5 transition-all">
              <span className="block text-sm font-semibold text-emerald-950">
                1. Беспокоит ли тебя сегодня головная боль?
              </span>
              <p className="text-[11px] text-gray-400">
                Физическое напряжение часто маскируется под психологический дискомфорт.
              </p>
              
              <div className="flex gap-4 mt-2">
                <label className="flex-1 max-w-[120px] cursor-pointer">
                  <input
                    type="radio"
                    name="headache"
                    value="yes"
                    checked={headache === 'yes'}
                    onChange={() => {
                      setHeadache('yes');
                      setIsSaved(false);
                    }}
                    className="sr-only peer"
                  />
                  <div className="text-center py-2.5 rounded-xl border border-gray-200 peer-checked:border-brand peer-checked:bg-brand-light/50 peer-checked:text-brand-dark transition-all text-sm font-medium hover:bg-gray-50 text-gray-600">
                    Да
                  </div>
                </label>

                <label className="flex-1 max-w-[120px] cursor-pointer">
                  <input
                    type="radio"
                    name="headache"
                    value="no"
                    checked={headache === 'no'}
                    onChange={() => {
                      setHeadache('no');
                      setIsSaved(false);
                    }}
                    className="sr-only peer"
                  />
                  <div className="text-center py-2.5 rounded-xl border border-gray-200 peer-checked:border-brand peer-checked:bg-brand-light/50 peer-checked:text-brand-dark transition-all text-sm font-medium hover:bg-gray-50 text-gray-600">
                    Нет
                  </div>
                </label>
              </div>
            </div>

            {/* QUESTION 2: Menstrual Pain */}
            <div className="space-y-2 p-1.5 pt-4 transition-all border-t border-gray-50">
              <span className="block text-sm font-semibold text-emerald-950">
                2. Есть ли у тебя сегодня менструальные или гинекологические боли?
              </span>
              <p className="text-[11px] text-gray-400">
                Гормональные колебания могут напрямую влиять на уровень тревоги и уязвимости.
              </p>
              
              <div className="flex gap-4 mt-2">
                <label className="flex-1 max-w-[120px] cursor-pointer">
                  <input
                    type="radio"
                    name="menstrual"
                    value="yes"
                    checked={menstrual === 'yes'}
                    onChange={() => {
                      setMenstrual('yes');
                      setIsSaved(false);
                    }}
                    className="sr-only peer"
                  />
                  <div className="text-center py-2.5 rounded-xl border border-gray-200 peer-checked:border-brand peer-checked:bg-brand-light/50 peer-checked:text-brand-dark transition-all text-sm font-medium hover:bg-gray-50 text-gray-600">
                    Да
                  </div>
                </label>

                <label className="flex-1 max-w-[120px] cursor-pointer">
                  <input
                    type="radio"
                    name="menstrual"
                    value="no"
                    checked={menstrual === 'no'}
                    onChange={() => {
                      setMenstrual('no');
                      setIsSaved(false);
                    }}
                    className="sr-only peer"
                  />
                  <div className="text-center py-2.5 rounded-xl border border-gray-200 peer-checked:border-brand peer-checked:bg-brand-light/50 peer-checked:text-brand-dark transition-all text-sm font-medium hover:bg-gray-50 text-gray-600">
                    Нет
                  </div>
                </label>
              </div>
            </div>

            {/* Comments Field */}
            <div className="space-y-2 pt-4 border-t border-gray-50">
              <label htmlFor="comments_textarea" className="block text-sm font-semibold text-emerald-950">
                Твой комментарий о самочувствии
              </label>
              <p className="text-[11px] text-gray-400">
                Опиши кратко, как чувствует себя твоё тело и разум сегодня. Замечала ли ты усталость или жажду?
              </p>
              <textarea
                id="comments_textarea"
                rows={4}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setIsSaved(false);
                }}
                placeholder="Как ты чувствуешь себя? Например: «Устала к вечеру, но выпила чаю с мятой и полежала 15 минут...»"
                className="w-full p-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-brand focus:bg-white outline-none resize-none transition-all placeholder:text-gray-400 text-emerald-950"
              />
            </div>
          </div>

          {isSaved && (
            <div className="bg-emerald-50 border border-emerald-100 flex items-center space-x-2 p-3 rounded-xl animate-fade-in text-emerald-800 text-xs font-semibold">
              <CheckCircle size={16} className="text-emerald-500 shrink-0" />
              <span>Твои ответы бережно сохранены. Ты умница!</span>
            </div>
          )}

          <button
            type="submit"
            id="daily_check_submit_btn"
            className="w-full py-3 px-4 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-brand/10 hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-1.5"
          >
            <span>Сохранить ответы</span>
          </button>
        </form>

        {/* Informative Side Card (1 col on desktop) */}
        <div className="space-y-4">
          {showExplanation && (
            <div className="bg-brand-light p-5 rounded-3xl border border-brand/15 text-xs text-brand-dark space-y-3 relative">
              <button 
                type="button" 
                onClick={() => setShowExplanation(false)}
                className="absolute top-3 right-3 text-brand/60 hover:text-brand font-bold text-sm cursor-pointer"
                title="Скрыть"
                id="explanation_dismiss_btn"
              >
                ✕
              </button>
              <h4 className="font-extrabold flex items-center gap-1 text-emerald-950 text-sm">
                <HelpCircle size={16} className="text-brand shrink-0" />
                Почему это важно?
              </h4>
              <p className="leading-relaxed text-gray-700">
                Дорогая, мы часто путаем обычную физическую усталость, головную или менструальную боль с психологическим импульсом выпить («тягой»).
              </p>
              <p className="leading-relaxed text-gray-700">
                Исследуя своё тело день за днём, ты учишься отделять гормоны или боли от необходимости уходить в забытье. Как только ты понимаешь, что тебе просто физически некомфортно, ты можешь позаботиться о себе другими, нетоксичными методами.
              </p>
              <p className="leading-relaxed italic font-medium text-emerald-900 border-l-2 border-brand-medium/50 pl-2">
                Забота о теле — это фундамент твоей трезвости. Позволь себе отдохнуть.
              </p>
            </div>
          )}

          {/* Prompt banner to track emotions for consistency */}
          <div className="bg-emerald-950 p-5 rounded-3xl text-white space-y-3 shadow-sm">
            <h4 className="font-semibold text-xs text-brand-light uppercase tracking-wider flex items-center gap-1.5">
              <Smile size={14} className="text-brand-medium" />
              Эмоциональный компас
            </h4>
            <p className="text-xs text-brand-light/80 leading-relaxed">
              Физическое и душевное состояния тесно переплетены. Уже заполнила свои эмоции на сегодня?
            </p>
            <a 
              href="/emotions"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = ''; // support simulated redirects
                window.history.pushState({}, '', '/emotions');
                window.dispatchEvent(new Event('popstate'));
              }}
              className="inline-flex items-center text-xs font-bold text-brand-light hover:text-white transition-colors gap-1 border-b border-white/20 pb-0.5"
            >
              Перейти к эмоциям ➜
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
