/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TopHeader, BottomNav } from './components/Navigation';
import SetupScreen from './components/SetupScreen';
import HomePage from './pages/HomePage';
import DailyCheckPage from './pages/DailyCheckPage';
import EmotionsPage from './pages/EmotionsPage';
import MyTasksPage from './pages/MyTasksPage';
import MotivationPage from './pages/MotivationPage';
import SelfHelpPage from './pages/SelfHelpPage';
import { getLocalDateString } from './utils/dateUtils';

export default function App() {
  const [sobrietyStart, setSobrietyStart] = useState<string | null>(() => {
    return localStorage.getItem('sobriety_start');
  });

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return getLocalDateString();
  });

  // Handle saving the start date during onboarding
  const handleSaveSobrietyStart = (dateStr: string) => {
    localStorage.setItem('sobriety_start', dateStr);
    setSobrietyStart(dateStr);
  };

  // Allow editing the start date from the homepage
  const handleUpdateSobrietyStart = (dateStr: string) => {
    localStorage.setItem('sobriety_start', dateStr);
    setSobrietyStart(dateStr);
  };

  const handleSetToday = () => {
    setSelectedDate(getLocalDateString());
  };

  // If sobriety_start date is not set, force user to complete SetupOnboarding
  if (!sobrietyStart) {
    return (
      <SetupScreen onSave={handleSaveSobrietyStart} />
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-serene text-slate-800 pb-20 md:pb-6 flex flex-col font-sans select-none selection:bg-brand/25">
        
        {/* Responsive Desktop Top Bar navigation & date label */}
        <TopHeader 
          selectedDate={selectedDate} 
          onSetToday={handleSetToday} 
        />

        {/* Primary Page Layout Margin-Safe Content Area */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 overflow-x-hidden">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  sobrietyStart={sobrietyStart} 
                  onUpdateSobrietyStart={handleUpdateSobrietyStart}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              } 
            />
            <Route 
              path="/daily-check" 
              element={<DailyCheckPage selectedDate={selectedDate} />} 
            />
            <Route 
              path="/emotions" 
              element={<EmotionsPage selectedDate={selectedDate} />} 
            />
            <Route 
              path="/my-tasks" 
              element={<MyTasksPage selectedDate={selectedDate} />} 
            />
            <Route 
              path="/motivation" 
              element={<MotivationPage />} 
            />
            <Route 
              path="/self-help" 
              element={<SelfHelpPage selectedDate={selectedDate} />} 
            />
            {/* Fallback route back to dashboard */}
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </main>

        {/* Sticky Mobile Bottom Bar navigation (hidden on desktop) */}
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
