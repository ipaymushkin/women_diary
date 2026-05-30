/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Heart, 
  Users, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Check,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { formatRussianDate } from '../utils/dateUtils';
import { TodoItem, LiedRecord } from '../types';

interface MyTasksPageProps {
  selectedDate: string;
}

export default function MyTasksPage({ selectedDate }: MyTasksPageProps) {
  const formattedDate = formatRussianDate(selectedDate);
  const todoKey = `self_care_todos_${selectedDate}`;
  const forOthersKey = `for_others_${selectedDate}`;
  const liedKey = `lied_${selectedDate}`;

  // State 1: Self care todos
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState('');

  // State 2: For others
  const [forOthersText, setForOthersText] = useState('');
  const [isForOthersSaved, setIsForOthersSaved] = useState(false);

  // State 3: Honesty check
  const [lied, setLied] = useState<'yes' | 'no'>('no');
  const [liedDetail, setLiedDetail] = useState('');
  const [isLiedSaved, setIsLiedSaved] = useState(false);

  // Load all components state for selectedDate
  useEffect(() => {
    setIsForOthersSaved(false);
    setIsLiedSaved(false);

    // 1. Todos
    const cachedTodos = localStorage.getItem(todoKey);
    if (cachedTodos) {
      try {
        setTodos(JSON.parse(cachedTodos));
      } catch (e) {
        setTodos([]);
      }
    } else {
      setTodos([]);
    }

    // 2. Kindness
    const cachedKindness = localStorage.getItem(forOthersKey);
    setForOthersText(cachedKindness || '');

    // 3. Honesty
    const cachedLied = localStorage.getItem(liedKey);
    if (cachedLied) {
      try {
        const parsed = JSON.parse(cachedLied) as LiedRecord;
        setLied(parsed.lied || 'no');
        setLiedDetail(parsed.detail || '');
      } catch (e) {
        setLied('no');
        setLiedDetail('');
      }
    } else {
      setLied('no');
      setLiedDetail('');
    }
  }, [selectedDate, todoKey, forOthersKey, liedKey]);

  // Save todos to localStorage helper
  const saveTodos = (newTodos: TodoItem[]) => {
    setTodos(newTodos);
    localStorage.setItem(todoKey, JSON.stringify(newTodos));
    window.dispatchEvent(new Event('storage'));
  };

  // Add todo task
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    
    const newTask: TodoItem = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false
    };

    const updated = [...todos, newTask];
    saveTodos(updated);
    setNewTodoText('');
  };

  // Toggle todo task matching checkbox click
  const handleToggleTodo = (id: string) => {
    const updated = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updated);
  };

  // Delete todo task
  const handleDeleteTodo = (id: string) => {
    const updated = todos.filter(todo => todo.id !== id);
    saveTodos(updated);
  };

  // Save "What did you do for others?" text
  const handleSaveForOthers = () => {
    localStorage.setItem(forOthersKey, forOthersText);
    setIsForOthersSaved(true);
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => {
      setIsForOthersSaved(false);
    }, 4000);
  };

  // Save honesty status
  const handleSaveLied = () => {
    const payload: LiedRecord = {
      lied,
      detail: lied === 'yes' ? liedDetail : ''
    };
    localStorage.setItem(liedKey, JSON.stringify(payload));
    setIsLiedSaved(true);
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => {
      setIsLiedSaved(false);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 selection:bg-brand/30">
      
      {/* Intro Header */}
      <div className="flex items-center space-x-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
        <div className="p-3 bg-brand-light rounded-2xl text-brand">
          <CheckSquare size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-950">
            Дневник дел и честности
          </h2>
          <p className="text-xs text-gray-500">
            Шаги к исцелению на выбранную дату: <span className="font-semibold text-brand-dark">{formattedDate}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Bento: Self Care & kindness (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION 1: Self Care Todos */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-start justify-between border-b border-gray-50 pb-3">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
                  <Heart size={18} className="text-brand fill-brand/10" />
                  Что ты сделала сегодня для себя?
                </h3>
                <p className="text-xs text-gray-400">
                  Любые приятные мелочи: приняла теплую ванну, выпила чай, почитала книгу, легла поспать днем. Забота о себе — это проявление любви, а не эгоизм.
                </p>
              </div>
            </div>

            {/* Todo Form input */}
            <form onSubmit={handleAddTodo} className="flex gap-2" id="todo_form">
              <input
                id="todo_input_text"
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Добавить заботливое дело для себя..."
                className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-brand focus:bg-white outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                id="todo_add_btn"
                className="bg-brand hover:bg-brand-hover text-white p-2.5 rounded-xl cursor-pointer transition-colors shrink-0"
                title="Добавить"
              >
                <Plus size={18} />
              </button>
            </form>

            {/* Todo List */}
            <div className="space-y-2 pt-2 max-h-[250px] overflow-y-auto">
              {todos.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-3 text-center">
                  Список дел на этот день пуст. Пожалуйста, напиши хотя бы одно нежное дело для своего тела или разума!
                </p>
              ) : (
                todos.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-brand-light/20 rounded-xl border border-gray-100/70 transition-all group"
                  >
                    <button
                      type="button"
                      id={`toggle_todo_${item.id}`}
                      onClick={() => handleToggleTodo(item.id)}
                      className="flex items-center space-x-3 text-left flex-1 cursor-pointer"
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0
                        ${item.completed 
                          ? 'bg-brand border-brand text-white' 
                          : 'border-gray-200 bg-white group-hover:border-brand-medium'
                        }
                      `}>
                        {item.completed && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span className={`text-xs font-medium text-emerald-950 transition-all ${
                        item.completed ? 'line-through text-gray-400 font-normal' : ''
                      }`}>
                        {item.text}
                      </span>
                    </button>

                    <button
                      type="button"
                      id={`delete_todo_${item.id}`}
                      onClick={() => handleDeleteTodo(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Удалить дело"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <p className="text-[11px] text-brand-dark font-medium italic">
              Всего полезных дел для себя за этот день: {todos.filter(t => t.completed).length} из {todos.length}
            </p>
          </div>

          {/* SECTION 2: Doing things for others */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
                <Users size={18} className="text-brand" />
                Что ты сделала для других полезное?
              </h3>
              <p className="text-xs text-gray-400">
                Помогла маме, дружелюбно выслушала подругу, уступила место в автобусе, сделала пожертвование, накормила бездомную кошку. Благотворительность переключает фокус с жалости к себе на помощь миру.
              </p>
            </div>

            <textarea
              id="for_others_textarea"
              rows={4}
              value={forOthersText}
              onChange={(e) => {
                setForOthersText(e.target.value);
                setIsForOthersSaved(false);
              }}
              placeholder="Опиши добрые поступки или слова, которыми ты поделилась сегодня с окружающим миром..."
              className="w-full p-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-brand focus:bg-white outline-none resize-none transition-all placeholder:text-gray-400 text-emerald-950"
            />

            {isForOthersSaved && (
              <div className="bg-emerald-50 border border-emerald-100 flex items-center space-x-2 p-2.5 rounded-xl text-emerald-800 text-xs font-semibold">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                <span>Записи о добрых делах бережно сохранены. Мир ценит твой вклад!</span>
              </div>
            )}

            <button
              type="button"
              id="save_for_others_btn"
              onClick={handleSaveForOthers}
              className="w-full py-2.5 px-4 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
            >
              <span>Сохранить дела для других</span>
            </button>
          </div>

        </div>

        {/* Right Bento: Honesty Check (1 col on large screen) */}
        <div className="space-y-6">
          
          {/* SECTION 3: Honesty check card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
                <ShieldAlert size={18} className="text-alarm" />
                Уголок Честности
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Зависимость держится на иллюзиях, тайнах и обмане. Алкоголь приучает врать в мелочах и по-крупному. Абсолютная честность перед миром и собой — ключ к трезвой жизни.
              </p>
            </div>

            {/* Radio inputs */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Врала ли ты сегодня кому-нибудь?
              </span>
              
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="lied_status"
                    value="yes"
                    checked={lied === 'yes'}
                    onChange={() => {
                      setLied('yes');
                      setIsLiedSaved(false);
                    }}
                    className="sr-only peer"
                  />
                  <div className="text-center py-2 rounded-xl border border-gray-200 peer-checked:border-alarm peer-checked:bg-alarm-light/50 peer-checked:text-alarm-hover peer-checked:font-bold transition-all text-sm font-medium hover:bg-gray-50 text-gray-600">
                    Да
                  </div>
                </label>

                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="lied_status"
                    value="no"
                    checked={lied === 'no'}
                    onChange={() => {
                      setLied('no');
                      setIsLiedSaved(false);
                    }}
                    className="sr-only peer"
                  />
                  <div className="text-center py-2 rounded-xl border border-gray-200 peer-checked:border-brand peer-checked:bg-brand-light/50 peer-checked:text-brand-dark peer-checked:font-bold transition-all text-sm font-medium hover:bg-gray-50 text-gray-600">
                    Нет
                  </div>
                </label>
              </div>
            </div>

            {/* Conditional textbox for lies explanation */}
            {lied === 'yes' && (
              <div className="space-y-2 pt-2 animate-fade-in">
                <label htmlFor="lied_detail_textarea" className="block text-xs font-semibold text-emerald-950">
                  Если да, то кому и почему?
                </label>
                <p className="text-[10px] text-gray-400">
                  Пожалуйста, признайся себе. Это не для осуждения, а чтобы понять причины (страх осуждения, привычка выкручиваться, стыд?). Сделай этот шаг к свободе.
                </p>
                <textarea
                  id="lied_detail_textarea"
                  rows={4}
                  value={liedDetail}
                  onChange={(e) => {
                    setLiedDetail(e.target.value);
                    setIsLiedSaved(false);
                  }}
                  placeholder="Кому ты солгала и какова была настоящая причина? Например: «Соврала коллеге, что заболела, потому что постеснялась сказать, что мне нужен отдых...»"
                  className="w-full p-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:border-alarm focus:bg-white outline-none resize-none transition-all placeholder:text-gray-400 text-emerald-950"
                />
              </div>
            )}

            {isLiedSaved && (
              <div className="bg-emerald-50 border border-emerald-100 flex items-center space-x-2 p-2.5 rounded-xl text-emerald-800 text-xs font-semibold">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                <span>Твои признания и статус честности сохранены!</span>
              </div>
            )}

            <button
              type="button"
              id="save_honesty_btn"
              onClick={handleSaveLied}
              className="w-full py-2.5 px-4 bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Сохранить статус честности</span>
            </button>
          </div>

          {/* Sincere Advice Block */}
          <div className="bg-gradient-to-br from-brand/10 to-emerald-900/5 p-5 rounded-3xl border border-brand/10 text-xs text-brand-dark/90 space-y-2.5">
            <h4 className="font-bold flex items-center gap-1.5 text-emerald-950">
              <HelpCircle size={15} />
              Золотое правило свободы
            </h4>
            <p className="leading-relaxed">
              «Мы больны настолько, насколько больны наши тайны».
            </p>
            <p className="leading-relaxed text-gray-600">
              Каждый раз, когда ты признаешь свою неправду — ты исцеляешься. Честный человек не прячет глаза и не боится быть раскрытым. Честность выбивает самую крепкую почву из-под ног алкоголизма.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
