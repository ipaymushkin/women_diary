/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Quote, 
  Copy, 
  Heart, 
  Check,
  RefreshCw
} from 'lucide-react';

const SUPPORTING_PHRASES = [
  "Ты заслуживаешь чистой, свободной и абсолютно счастливой жизни. Каждый твой трезвый день — это бесценный подарок самой себе и твоему будущему.",
  "Твоя ценность не измеряется прошлыми ошибками, срывами или слабостями. Ты прекрасна, сильна и способна преодолеть любые жизненные бури.",
  "Страхи и тревога — лишь временные тени на твоем пути. Помни: твой внутренний свет намного сильнее любой алкогольной тяги. Мы обнимаем тебя всей душой.",
  "Дорогая наша, дыши глубже. Тебе не нужно решать проблемы всей своей жизни прямо сегодня. Достаточно оставаться трезвой только в этот конкретный день.",
  "Трезвость — это не тюрьма, не наказание и не лишение. Это твое долгожданное, великое освобождение и право чувствовать этот прекрасный мир настоящим.",
  "Ты сделала самый смелый шаг в своей жизни, признав проблему и выбрав заботу о себе. Мы восхищаемся твоим мужеством и твоим решением жить.",
  "Позволь себе быть неидеальной. Ты имеешь полное право злиться, грустить, плакать и уставать, оставаясь при этом абсолютно чистой, трезвой и свободной.",
  "Каждое утро твоей трезвой жизни — это сияющий чистый лист, на котором ты сама, вытирая слезы, пишешь новую историю бесконечной любви к себе.",
  "Когда тебе покажется, что ты падаешь и земля уходит из-под ног, крепко обними себя и помни: ты не одна. Дорогу осилит идущая.",
  "Алкоголь пытался забрать твою чудесную душу, твои таланты и теплоту. В трезвости ты возвращаешь себя настоящую — живую, чувствующую и подлинную.",
  "Твоя нежность и уязвимость — это вовсе не слабость, а твоя великая женская суперсила. Направляй ее на заботу о себе, защищая её своей трезвостью.",
  "Ты уже победительница! Ты встретила этот день трезвой, и это самое главное, судьбоносное решение, за которое твое здоровое будущее скажет тебе спасибо."
];

export default function MotivationPage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [fade, setFade] = useState(true);

  // Pick a random quote on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * SUPPORTING_PHRASES.length);
    setCurrentIndex(randomIndex);
  }, []);

  const handleNextQuote = () => {
    setFade(false);
    setTimeout(() => {
      // Pick a different random quote from the active one
      let nextIndex = currentIndex;
      if (SUPPORTING_PHRASES.length > 1) {
        while (nextIndex === currentIndex) {
          nextIndex = Math.floor(Math.random() * SUPPORTING_PHRASES.length);
        }
      }
      setCurrentIndex(nextIndex);
      setFade(true);
      setCopied(false);
    }, 200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPPORTING_PHRASES[currentIndex]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 selection:bg-brand/30">
      
      {/* Page Header */}
      <div className="flex items-center space-x-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
        <div className="p-3 bg-brand-light rounded-2xl text-brand">
          <Sparkles size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-950">
            Мотивация и поддержка
          </h2>
          <p className="text-xs text-gray-500">
            Слова, которые напомнят тебе о твоей силе и уберегут в трудный момент
          </p>
        </div>
      </div>

      {/* Main Quote Container */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[350px]">
        {/* Serene artistic backgrounds */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-light rounded-full -mr-20 -mt-20 blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-alarm-light rounded-full -ml-16 -mb-16 blur-2xl opacity-60 pointer-events-none" />

        <div className="relative">
          <Quote size={52} className="text-brand-medium/30 -mt-2 -ml-2" />
        </div>

        {/* Dynamic Quote Text Block with fade transition styling */}
        <div className={`my-8 relative transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
          <blockquote className="text-lg md:text-xl font-medium text-emerald-950 leading-relaxed font-sans text-center">
            « {SUPPORTING_PHRASES[currentIndex]} »
          </blockquote>
          <div className="flex justify-center mt-6">
            <div className="h-1 w-16 bg-brand-medium/50 rounded-full" />
          </div>
        </div>

        {/* Utility panel */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-50">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Heart size={14} className="text-brand fill-brand" />
            <span>Фраза {currentIndex + 1} из {SUPPORTING_PHRASES.length}</span>
          </div>

          <div className="flex space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              id="copy_phrase_btn"
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl border border-gray-100 hover:border-brand-medium hover:bg-brand-light/30 text-gray-600 hover:text-brand-dark transition-all duration-150 flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
              title="Копировать в буфер"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span className="text-emerald-700">Скопировано!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Копировать</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextQuote}
              id="next_phrase_btn"
              className="flex-1 sm:flex-initial py-2.5 px-5 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl text-xs transition-all duration-200 shadow-md shadow-brand/10 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} className="animate-spin-once" />
              <span>Другая фраза</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gentle reminders for difficult path moments */}
      <div className="bg-emerald-950 text-white p-6 rounded-3xl space-y-4">
        <h4 className="font-extrabold text-sm uppercase tracking-wider text-brand-medium flex items-center gap-1.5">
          <Sparkles size={16} />
          Как это работает на благо твоей психики?
        </h4>
        <p className="text-xs text-brand-light/80 leading-normal">
          В периоды уязвимости наш внутренний критик активизируется, заставляя испытывать вину и жалость к себе — главные триггеры алкогольного срыва. Чтение поддерживающих аффирмаций помогает «перепрошить» негативные мыслительные цепочки. 
        </p>
        <p className="text-xs text-brand-light/80 leading-normal">
          Добавь эту страницу в закладки. Когда в голове зазвучит коварное «ну один бокал не повредит», открой эти фразы и читай их вслух, пока шторм в душе не утихнет. Помни: поддаться алкоголю — секундная слабость, а трезвость — постоянная победа.
        </p>
      </div>

    </div>
  );
}
