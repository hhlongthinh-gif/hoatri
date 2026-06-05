import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  Sparkles, 
  Award, 
  HelpCircle, 
  Clock, 
  ArrowRight, 
  Heart, 
  Star,
  Activity
} from 'lucide-react';

import { ScreenType, Achievement, ScoreHistory } from './types';
import { DEFAULT_ACHIEVEMENTS, CHEMISTRY_PUNS_AND_MESSAGES } from './data';
import Handbook from './components/Handbook';
import QuizGame from './components/QuizGame';
import MatchGame from './components/MatchGame';
import SortingGame from './components/SortingGame';
import AchievementsView from './components/AchievementsView';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('home');
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [highScores, setHighScores] = useState<{ quiz: number; match: number; sort: number }>({
    quiz: 0,
    match: 999, // Lower is better (seconds)
    sort: 0
  });
  const [history, setHistory] = useState<ScoreHistory[]>([]);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);
  const [todaysQuote, setTodaysQuote] = useState('');

  // Initial load from localStorage
  useEffect(() => {
    // Pick today's quote
    const rIdx = Math.floor(Math.random() * CHEMISTRY_PUNS_AND_MESSAGES.length);
    setTodaysQuote(CHEMISTRY_PUNS_AND_MESSAGES[rIdx]);

    try {
      const savedAchievements = localStorage.getItem('chem_garden_achievements');
      if (savedAchievements) {
        const parsed = JSON.parse(savedAchievements) as Achievement[];
        // Align schema updates if any
        const aligned = DEFAULT_ACHIEVEMENTS.map(def => {
          const match = parsed.find(p => p.id === def.id);
          return match ? { ...def, isUnlocked: match.isUnlocked, unlockedAt: match.unlockedAt } : def;
        });
        setAchievements(aligned);
      }

      const savedScores = localStorage.getItem('chem_garden_highscores');
      if (savedScores) {
        setHighScores(JSON.parse(savedScores));
      }

      const savedHistory = localStorage.getItem('chem_garden_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading data from local storage', e);
    }
  }, []);

  // Save achievements to Storage
  const saveAchievementsData = (updatedAchievements: Achievement[]) => {
    setAchievements(updatedAchievements);
    try {
      localStorage.setItem('chem_garden_achievements', JSON.stringify(updatedAchievements));
    } catch (e) {
      console.warn(e);
    }
  };

  // Helper to trigger floating celebration and unlock badge
  const unlockAchievement = (id: string) => {
    const active = achievements.find(a => a.id === id);
    if (active && !active.isUnlocked) {
      const nowString = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN');
      const updated = achievements.map(a => 
        a.id === id ? { ...a, isUnlocked: true, unlockedAt: nowString } : a
      );
      saveAchievementsData(updated);
      
      // Floating notification
      setRecentNotification(`🎉 Tuyệt vời! Cậu vừa mở khóa Danh hiệu: "${active.title}" 🌸`);
      setTimeout(() => {
        setRecentNotification(null);
      }, 5000);
    }
  };

  // Handle score saving and high score updates
  const handleSaveScore = (score: number, accuracy: number) => {
    const modeMap: Record<'quiz' | 'match' | 'sort', 'quiz' | 'match' | 'sort'> = {
      'quiz': 'quiz',
      'match': 'match',
      'sort': 'sort'
    };
    
    let activeMode: 'quiz' | 'match' | 'sort' = 'quiz';
    if (activeScreen === 'match') activeMode = 'match';
    else if (activeScreen === 'sort') activeMode = 'sort';

    const newRecord: ScoreHistory = {
      date: new Date().toLocaleDateString('vi-VN'),
      score,
      mode: activeMode,
      accuracy
    };

    const updatedHistory = [newRecord, ...history].slice(0, 20); // Keep last 20
    setHistory(updatedHistory);
    localStorage.setItem('chem_garden_history', JSON.stringify(updatedHistory));

    // High score comparisons
    const updatedHighScores = { ...highScores };
    if (activeMode === 'quiz') {
      if (score > highScores.quiz) updatedHighScores.quiz = score;
    } else if (activeMode === 'sort') {
      if (score > highScores.sort) updatedHighScores.sort = score;
    } else if (activeMode === 'match') {
      // In matching, lower moves or score calculation already converts, let's keep the highest score
      if (score > highScores.match || highScores.match === 999) {
        updatedHighScores.match = score;
      }
    }

    setHighScores(updatedHighScores);
    localStorage.setItem('chem_garden_highscores', JSON.stringify(updatedHighScores));
  };

  const getAccuracyAverage = () => {
    if (history.length === 0) return 100;
    const sum = history.reduce((acc, h) => acc + h.accuracy, 0);
    return Math.round(sum / history.length);
  };

  const totalPointsEarned = () => {
    return history.reduce((sum, h) => sum + (h.mode !== 'match' ? h.score : 30), 0);
  };

  return (
    <div className="min-h-screen bg-[#FCF8F4] text-neutral-800 flex flex-col font-sans transition-all selection:bg-garden-pink relative pb-12" id="app-container">
      {/* BACKGROUND DECORATIVE CIRCLES */}
      <div className="absolute top-0 left-0 w-full overflow-hidden h-[420px] pointer-events-none z-0">
        <div className="absolute top-[-100px] left-[-50px] w-80 h-80 rounded-full bg-garden-pink-light opacity-60 blur-3xl" />
        <div className="absolute top-20 right-[-100px] w-96 h-96 rounded-full bg-garden-lavender opacity-50 blur-3xl" />
        <div className="absolute top-[280px] left-[20%] w-72 h-72 rounded-full bg-rose-100/40 opacity-40 blur-3xl" />
      </div>

      {/* HEADER SECTION */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-pink-100 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full rounded-b-3xl soft-card-shadow" id="app-header">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveScreen('home')}>
          <div className="w-10 h-10 bg-gradient-to-tr from-pink-300 to-rose-400 rounded-2xl flex items-center justify-center text-white border border-rose-100/40 shadow-sm shadow-pink-100">
            <span className="text-xl animate-spin" style={{ animationDuration: '8s' }}>🌸</span>
          </div>
          <div>
            <h1 className="text-lg font-black font-display text-rose-950 tracking-tight leading-none">Vườn Hoa Hóa Trị</h1>
            <span className="text-[10px] text-rose-500/80 uppercase font-black tracking-widest block mt-1">Chemistry Schoolyard</span>
          </div>
        </div>

        {/* TOP COMPACT NAVIGATION BAR (Single level) */}
        <nav className="hidden md:flex bg-amber-50/50 p-1.5 rounded-full border border-pink-100 max-w-md w-full items-center justify-around space-x-1" id="app-desktop-nav">
          <button
            onClick={() => setActiveScreen('home')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeScreen === 'home' 
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm' 
                : 'text-rose-900/70 hover:text-rose-950 hover:bg-white/50'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang Chủ</span>
          </button>

          <button
            onClick={() => setActiveScreen('quiz')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeScreen === 'quiz' 
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm' 
                : 'text-rose-900/70 hover:text-rose-950 hover:bg-white/50'
            }`}
          >
            🌸 Đố Vui
          </button>

          <button
            onClick={() => setActiveScreen('match')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeScreen === 'match' 
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm' 
                : 'text-rose-900/70 hover:text-rose-950 hover:bg-white/50'
            }`}
          >
            🔮 Kết Đôi
          </button>

          <button
            onClick={() => setActiveScreen('sort')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeScreen === 'sort' 
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm' 
                : 'text-rose-900/70 hover:text-rose-950 hover:bg-white/50'
            }`}
          >
            🏺 Thả Lọ
          </button>

          <button
            onClick={() => setActiveScreen('handbook')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeScreen === 'handbook' 
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm' 
                : 'text-rose-900/70 hover:text-rose-950 hover:bg-white/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sổ Tay</span>
          </button>

          <button
            onClick={() => setActiveScreen('achievements')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeScreen === 'achievements' 
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm' 
                : 'text-rose-900/70 hover:text-rose-950 hover:bg-white/50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Huy Chương</span>
          </button>
        </nav>

        {/* Mobile quick icons / stats indicators */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full border border-rose-100 font-bold font-mono">
            <span>✨</span>
            <span>{totalPointsEarned()}</span>
            <span className="text-[9px] text-rose-400">pt</span>
          </div>
        </div>
      </header>

      {/* MOBILE LOWER NAVIGATION (Floats on bottom so screen stays beautiful and clean) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-pink-100 soft-card-shadow flex justify-around items-center text-[10px]" id="app-mobile-nav">
        <button
          onClick={() => setActiveScreen('home')}
          className={`flex flex-col items-center p-1.5 whitespace-nowrap cursor-pointer transition-all ${activeScreen === 'home' ? 'text-rose-600 scale-105 font-bold' : 'text-stone-400'}`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Vườn</span>
        </button>
        <button
          onClick={() => setActiveScreen('quiz')}
          className={`flex flex-col items-center p-1.5 whitespace-nowrap cursor-pointer transition-all ${activeScreen === 'quiz' ? 'text-rose-600 scale-105 font-bold' : 'text-stone-400'}`}
        >
          <span className="text-sm leading-4 mb-0.5">🌸</span>
          <span>Đố Vui</span>
        </button>
        <button
          onClick={() => setActiveScreen('match')}
          className={`flex flex-col items-center p-1.5 whitespace-nowrap cursor-pointer transition-all ${activeScreen === 'match' ? 'text-rose-600 scale-105 font-bold' : 'text-stone-400'}`}
        >
          <span className="text-sm leading-4 mb-0.5">🔮</span>
          <span>Kết Đôi</span>
        </button>
        <button
          onClick={() => setActiveScreen('sort')}
          className={`flex flex-col items-center p-1.5 whitespace-nowrap cursor-pointer transition-all ${activeScreen === 'sort' ? 'text-rose-600 scale-105 font-bold' : 'text-stone-400'}`}
        >
          <span className="text-sm leading-4 mb-0.5">🏺</span>
          <span>Thả Lọ</span>
        </button>
        <button
          onClick={() => setActiveScreen('handbook')}
          className={`flex flex-col items-center p-1.5 whitespace-nowrap cursor-pointer transition-all ${activeScreen === 'handbook' ? 'text-rose-600 scale-105 font-bold' : 'text-stone-400'}`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Sổ Tay</span>
        </button>
        <button
          onClick={() => setActiveScreen('achievements')}
          className={`flex flex-col items-center p-1.5 whitespace-nowrap cursor-pointer transition-all ${activeScreen === 'achievements' ? 'text-rose-600 scale-105 font-bold' : 'text-stone-400'}`}
        >
          <Award className="w-4 h-4 mb-0.5" />
          <span>Huy Chương</span>
        </button>
      </div>

      {/* DYNAMIC CELEBRATIVE BANNER POPUP */}
      <AnimatePresence>
        {recentNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            style={{ x: '-50%' }}
            className="fixed bottom-20 left-1/2 z-50 bg-gradient-to-r from-pink-400 via-rose-500 to-indigo-500 text-white text-xs font-bold py-3.5 px-6 rounded-2xl soft-card-shadow flex items-center space-x-2 border border-white/20 select-none min-w-[280px] max-w-sm text-center justify-center"
            id="achievement-popup-toast"
          >
            <span>{recentNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE VIEWPORT MAIN COMPONENT CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 z-1" id="main-content-view">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {/* 1. HOME SCREEN / DENTAL HUB */}
            {activeScreen === 'home' && (
              <div className="space-y-6" id="home-dashboard">
                
                {/* Hero Greeting Panel */}
                <div className="bg-gradient-to-r from-rose-100 via-pink-50 to-amber-100 rounded-3xl p-6 md:p-8 border-2 border-garden-pink/60 soft-card-shadow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Sun ray floating graphic and petals decoration */}
                  <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-48 h-48 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="space-y-3 text-center md:text-left flex-1">
                    <span className="text-xs bg-white/70 backdrop-blur-sm text-rose-600 inline-block font-black px-3 py-1 rounded-full border border-rose-200 shadow-inner">
                      🌈 Chào mừng học sinh THPT
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight text-rose-950">
                      Gieo Trồng Tri Thức, Gặt Hái Hóa Trị!
                    </h2>
                    <p className="text-xs md:text-sm text-amber-900/70 max-w-xl leading-relaxed">
                      Lấp lánh, thơ mộng và đầy học thuật. Vườn Hoa Hóa Trị giúp các cậu ôn luyện vượt trội hóa trị của kim loại, phi kim và các gốc muối đặc trưng trong chương trình hóa học 10, 11 và 12!
                    </p>

                    {todaysQuote && (
                      <div className="bg-white/60 text-[11px] py-2 px-3.5 rounded-2xl border border-rose-200/50 italic text-rose-900 inline-block max-w-md">
                        ✿ "{todaysQuote}"
                      </div>
                    )}
                  </div>

                  {/* Character Illustration placeholder with flowers and stars */}
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-rose-100/50 flex flex-col items-center justify-center text-center w-40 h-40 shadow-sm relative shrink-0 select-none">
                    <span className="text-5xl animate-bounce">🌱</span>
                    <span className="text-[10px] text-stone-400 font-bold block mt-2 uppercase tracking-wide">Điểm Trí Tuệ</span>
                    <span className="text-xl font-black font-display text-rose-600 mt-0.5">{totalPointsEarned()} pt</span>
                  </div>
                </div>

                {/* Grid Launchers of the 3 main games */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="three-games-grid">
                  
                  {/* Game 1 Card */}
                  <div className="bg-white rounded-3xl border-2 border-garden-pink/60 p-6 soft-card-shadow hover:border-garden-pink transition-all flex flex-col justify-between min-h-[220px]">
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-2xl border border-rose-100 shadow-inner">
                        🌸
                      </div>
                      <h3 className="text-base font-extrabold font-display text-rose-950">Mảnh Vườn Đố Vui Hóa Trị</h3>
                      <p className="text-xs text-amber-900/60 leading-relaxed">
                        Ươm mầm hạt giống bằng cách trả lời trắc nghiệm hóa trị có tính thời gian 30s. Thử sai với 3 tim có mẹo nhớ dân gian đi kèm!
                      </p>
                    </div>
                    <div className="pt-4 flex justify-between items-center border-t border-rose-50 mt-4 text-xs font-semibold">
                      <span className="text-rose-500 font-mono text-[11px]">Kỷ lục: {highScores.quiz} pt</span>
                      <button
                        onClick={() => setActiveScreen('quiz')}
                        className="bg-rose-100 text-rose-700 hover:bg-rose-200 px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <span>Chăm Hoa</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Game 2 Card */}
                  <div className="bg-white rounded-3xl border-2 border-garden-pink/60 p-6 soft-card-shadow hover:border-garden-pink transition-all flex flex-col justify-between min-h-[220px]">
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl border border-indigo-100 shadow-inner">
                        🔮
                      </div>
                      <h3 className="text-base font-extrabold font-display text-rose-950">Thẻ Bài Kết Đôi Ma Thuật</h3>
                      <p className="text-xs text-amber-900/60 leading-relaxed">
                        Trò chơi lật ảnh ghi nhớ, ghép cặp các nguyên tố hoặc gốc muối với đúng trị chữ số La Mã. Hết giờ nhanh để phá kỷ lục thời gian!
                      </p>
                    </div>
                    <div className="pt-4 flex justify-between items-center border-t border-rose-50 mt-4 text-xs font-semibold">
                      <span className="text-indigo-500 font-mono text-[11px]">Kỷ lục: {highScores.match === 999 ? 0 : highScores.match} pt</span>
                      <button
                        onClick={() => setActiveScreen('match')}
                        className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <span>Khai Bài</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Game 3 Card */}
                  <div className="bg-white rounded-3xl border-2 border-garden-pink/60 p-6 soft-card-shadow hover:border-garden-pink transition-all flex flex-col justify-between min-h-[220px]">
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl border border-teal-100 shadow-inner">
                        🏺
                      </div>
                      <h3 className="text-base font-extrabold font-display text-rose-950">Lọ Phép Phân Loại Hóa Trị</h3>
                      <p className="text-xs text-amber-900/60 leading-relaxed">
                        Game ném bóng nhanh! Phân loại thần tốc kim loại/phi kim/gốc axit vào 3 lọ dung môi hóa trị I, II, III trong vòng 45 giây liên tục.
                      </p>
                    </div>
                    <div className="pt-4 flex justify-between items-center border-t border-rose-50 mt-4 text-xs font-semibold">
                      <span className="text-teal-500 font-mono text-[11px]">Kỷ lục: {highScores.sort} pt</span>
                      <button
                        onClick={() => setActiveScreen('sort')}
                        className="bg-teal-100 text-teal-700 hover:bg-teal-200 px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <span>Thả Lọ</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom stats breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="home-academic-tips">
                  
                  {/* Left: General Stats list */}
                  <div className="lg:col-span-4 bg-white p-6 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow space-y-4">
                    <div className="flex items-center space-x-2 text-rose-950">
                      <Activity className="w-4 h-4 text-rose-500" />
                      <h4 className="text-sm font-extrabold font-display">Nhật ký Học tập</h4>
                    </div>
                    <div className="space-y-3 text-xs">
                      {history.length === 0 ? (
                        <div className="text-stone-400 italic text-center py-6 text-[11px]">
                          Cậu chưa thực hiện ván ôn tập nào hôm nay cả. Hãy nhấn chọn một mục chơi ở trên nha! 🌸
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                          {history.map((h, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-rose-50 pb-2 last:border-b-0 text-[11px]">
                              <div>
                                <span className="font-bold text-neutral-800">
                                  {h.mode === 'quiz' ? 'Đố Vui Hoa Trị' : h.mode === 'match' ? 'Thẻ Kết Đôi' : 'Lọ Phân Loại'}
                                </span>
                                <span className="text-[10px] text-stone-400 block">{h.date}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-bold text-rose-600 block">+{h.score}đ</span>
                                <span className="text-[9px] text-stone-400">Độ chuẩn: {h.accuracy}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Helpful quick guide list */}
                  <div className="lg:col-span-8 bg-white p-6 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow space-y-4">
                    <h4 className="text-sm font-extrabold text-rose-950 font-display flex items-center gap-1.5">
                      💡 Mẹo ôn tập hóa học đỉnh cao cho Nữ sinh
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-amber-950">
                      <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-2.5">
                        <span className="text-lg">🍇</span>
                        <div className="space-y-0.5 font-normal">
                          <p className="font-bold text-rose-900">Liên hệ gốc Axit</p>
                          <p className="text-[11px] text-amber-900/60 leading-normal">Số nguyên tử hiđrô bị mất đi trong gốc axit chính bằng hóa trị của gốc axit đó đấy (Vd: H₂SO₄ mất hai H thành SO₄ hóa trị II!).</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-2.5">
                        <span className="text-lg">🍓</span>
                        <div className="space-y-0.5 font-normal">
                          <p className="font-bold text-rose-900">Hóa trị các Nhóm học</p>
                          <p className="text-[11px] text-amber-900/60 leading-normal">Kim loại kiềm (Nhóm IA như Na, K, Li) luôn hóa trị I. Kim loại kiềm thổ (Nhóm IIA như Ca, Mg, Ba) luôn hóa trị II.</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Launch Handbook Button */}
                    <div className="flex justify-between items-center text-[10px] text-stone-400 bg-sand-50/40 p-2.5 rounded-2xl border border-pink-100/30">
                      <span>Mách nhỏ: Đọc Sổ tay Hóa Chất 5 lần cũng nhận được Huy Chương Học Giả cổ kính đó nha.</span>
                      <button
                        onClick={() => setActiveScreen('handbook')}
                        className="text-rose-500 font-bold hover:underline cursor-pointer text-xs shrink-0 pl-2"
                      >
                        Tra cứu Sổ tay ➔
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. QUIZ SCREEN */}
            {activeScreen === 'quiz' && (
              <QuizGame 
                onUnlockAchievement={unlockAchievement} 
                onSaveScore={handleSaveScore} 
              />
            )}

            {/* 3. MATCH SCREEN */}
            {activeScreen === 'match' && (
              <MatchGame 
                onUnlockAchievement={unlockAchievement} 
                onSaveScore={handleSaveScore} 
              />
            )}

            {/* 4. SORT SCREEN */}
            {activeScreen === 'sort' && (
              <SortingGame 
                onUnlockAchievement={unlockAchievement} 
                onSaveScore={handleSaveScore} 
              />
            )}

            {/* 5. HANDBOOK SCREEN */}
            {activeScreen === 'handbook' && (
              <Handbook onUnlockAchievement={unlockAchievement} />
            )}

            {/* 6. ACHIEVEMENTS SCREEN */}
            {activeScreen === 'achievements' && (
              <AchievementsView achievements={achievements} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
