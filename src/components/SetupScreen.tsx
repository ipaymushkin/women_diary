/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Calendar, Heart } from 'lucide-react';
import { getLocalDateString, formatRussianDate } from '../utils/dateUtils';

interface SetupScreenProps {
  onSave: (dateStr: string) => void;
}

export default function SetupScreen({ onSave }: SetupScreenProps) {
  const todayStr = getLocalDateString();
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) {
      setError('Пожалуйста, выбери дату твоего прекрасного старта.');
      return;
    }
    
    const selectedDateTime = new Date(startDate).getTime();
    const todayTime = new Date().getTime();
    
    if (selectedDateTime > todayTime + 24 * 60 * 60 * 1000) {
      setError('Дорогая, эта дата еще не наступила. Выбери сегодняшний день или дату в прошлом.');
      return;
    }

    onSave(startDate);
  };

  return (
    <div className="min-h-screen bg-bg-serene flex items-center justify-center p-4 selection:bg-brand/30">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-8 relative overflow-hidden">
        
        {/* Background decorative soft ambient circles */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand/5 rounded-full blur-xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-alarm/5 rounded-full blur-xl" />

        <div className="text-center relative">
          <div className="mx-auto w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-5 text-brand">
            <Heart size={32} className="fill-brand/30 stroke-[1.5]" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-950 tracking-tight">
            Привет, дорогая подруга!
          </h1>
          
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Мы восхищаемся твоей силой и решением начать этот путь. Это твоё личное, абсолютно безопасное и поддерживающее пространство без осуждения. Здесь каждый твой шаг имеет значение.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="bg-brand-light/50 p-4 rounded-2xl border border-brand/10 text-xs text-brand-dark space-y-1">
            <p className="font-semibold flex items-center gap-1">
              <Sparkles size={14} className="text-brand" />
              Каждый день — это победа.
            </p>
            <p className="text-gray-600 leading-normal">
              Пожалуйста, укажи дату, с которой началась твоя ремиссия (твоя новая, трезвая жизнь). Мы будем вести бережный отсчет твоих дней свободы.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="sobriety_start_input" className="block text-xs font-semibold text-emerald-950 uppercase tracking-wider">
              Дата начала твоей трезвости
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-3.5 text-brand h-5 w-5 pointer-events-none" />
              <input
                id="sobriety_start_input"
                type="date"
                max={todayStr}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setError('');
                }}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand focus:bg-white focus:ring-3 focus:ring-brand/10 rounded-xl text-sm font-medium transition-all text-emerald-950 outline-none"
              />
            </div>
            {startDate ? (
              <p className="text-xs text-gray-500 italic mt-1">
                Выбрано: {formatRussianDate(startDate)}
              </p>
            ) : null}
          </div>

          {error && (
            <p className="text-xs text-rose-500 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            id="setup_submit_btn"
            className="w-full py-3.5 px-4 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-brand/10 hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98]"
          >
            Начать свой путь свободы
          </button>
        </form>

        <div className="text-center text-[11px] text-gray-400">
          Все твои ответы хранятся локально на твоём устройстве и никогда не будут отправлены третьим лицам.
        </div>
      </div>
    </div>
  );
}
