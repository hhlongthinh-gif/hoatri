import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Star, RefreshCw, AlertCircle, Sparkles, Check, X, Award } from 'lucide-react';
import { ALL_CHEMICALS_DATA } from '../data';
import { ChemicalItem } from '../types';

interface SortingGameProps {
  onUnlockAchievement: (id: string) => void;
  onSaveScore: (score: number, accuracy: number) => void;
}

export default function SortingGame({ onUnlockAchievement, onSaveScore }: SortingGameProps) {
  const [itemList, setItemList] = useState<ChemicalItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'summary'>('idle');
  const [shakeJar, setShakeJar] = useState<'i' | 'ii' | 'iii_other' | null>(null);
  const [floatScore, setFloatScore] = useState<{ id: number; text: string; success: boolean } | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (gameState === 'playing' && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [gameState, timeLeft]);

  const initGame = () => {
    // Generate an infinite-shuffled list of elements and radicals to keep them sorting
    const shuffled = [...ALL_CHEMICALS_DATA].sort(() => 0.5 - Math.random());
    setItemList(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setCorrectStreak(0);
    setMaxStreak(0);
    setTimeLeft(45);
    setFeedback(null);
    setGameState('playing');
  };

  const handleSort = (jarType: 'I' | 'II' | 'III_other') => {
    if (gameState !== 'playing') return;

    const currentItem = itemList[currentIdx];
    
    // Check if correct
    let isCorrect = false;

    // We categorize the valences of currentItem
    // Since some have multiple valences (e.g. Sắt (II, III)), we check if any matches the jar selected
    const primaryValence = currentItem.valences; // number[] e.g., [1], [2], [2, 3]

    if (jarType === 'I') {
      isCorrect = primaryValence.includes(1);
    } else if (jarType === 'II') {
      isCorrect = primaryValence.includes(2);
    } else if (jarType === 'III_other') {
      // Includes 3, 4, 5, 6
      isCorrect = primaryValence.some(v => v >= 3);
    }

    // Trigger floating feedback
    const floatId = Date.now();
    setFloatScore({
      id: floatId,
      text: isCorrect ? '+15 Điểm' : '-5 Điểm & -3s',
      success: isCorrect
    });

    if (isCorrect) {
      // Correct!
      const currentStreak = correctStreak + 1;
      setCorrectStreak(currentStreak);
      if (currentStreak > maxStreak) {
        setMaxStreak(currentStreak);
      }
      setScore(prev => prev + 15);
      setFeedback({
        text: `Hợp lý! Ký hiệu ${currentItem.symbol} thuộc nhóm hóa trị ${currentItem.valenceText}. ✨`,
        success: true
      });

      if (currentStreak >= 10) {
        onUnlockAchievement('sorter_champion');
      }
    } else {
      // Incorrect (Trial and Error penalty)
      setCorrectStreak(0);
      setScore(prev => Math.max(0, prev - 5));
      setTimeLeft(prev => Math.max(0, prev - 3)); // reduce time by 3s
      
      // Determine which jar to shake
      if (jarType === 'I') setShakeJar('i');
      else if (jarType === 'II') setShakeJar('ii');
      else setShakeJar('iii_other');

      setTimeout(() => setShakeJar(null), 600);

      const trueValStr = currentItem.valenceText;
      setFeedback({
        text: `Sai một tẹo nè! Đừng buồn, ${currentItem.name} (${currentItem.symbol}) có hóa trị ${trueValStr}. Cố gắng câu sau nha! 🌸`,
        success: false
      });
    }

    // Advance to next chemistry item immediately on separate list or cycle
    setTimeout(() => {
      setFloatScore(null);
    }, 1000);

    // If we've reached the end of the shuffled list, reshuffle and append
    if (currentIdx + 1 >= itemList.length) {
      const reshuffled = [...ALL_CHEMICALS_DATA].sort(() => 0.5 - Math.random());
      setItemList(prev => [...prev, ...reshuffled]);
    }
    setCurrentIdx(prev => prev + 1);
  };

  const endGame = () => {
    setGameState('summary');
    // Save accuracy by custom estimation
    const finalAccuracy = Math.round((score / 15) / (currentIdx || 1) * 100) || 60;
    onSaveScore(score, Math.min(100, finalAccuracy));
  };

  const currentItem = itemList[currentIdx];

  return (
    <div className="max-w-4xl mx-auto px-2" id="sorting-viewport">
      {gameState === 'idle' && (
        <div className="bg-white p-8 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow text-center space-y-6 max-w-xl mx-auto" id="sorting-instructions">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-4xl border border-rose-100 shadow-inner">
            🏺
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold font-display text-rose-950">Lọ Phép Phân Loại Hóa Trị</h3>
            <p className="text-sm text-amber-900/70 leading-relaxed">
              Hãy phân biệt nhanh các vật phẩm hóa học rực rỡ và ném chúng vào chiếc lọ phép màu đúng hóa trị tương ứng! Càng nhanh tay, lọ phép càng ngập tràn sương sao tinh khôi.
            </p>
          </div>

          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 text-left space-y-2 text-xs">
            <p className="font-bold text-amber-800">🏺 Thần chú điều hành hũ phép:</p>
            <div className="space-y-1 text-amber-900/80">
              <p>• Thời gian thử thách tối đa là <strong>45 giây</strong>.</p>
              <p>• Một thẻ hóa học trung tâm sẽ xuất hiện liên tục.</p>
              <p>• Nhấp chọn lọ kẹo tương thích: <strong>Hóa trị I</strong>, <strong>Hóa trị II</strong>, hoặc <strong>Hóa trị III/Khác</strong>.</p>
              <p>• Mỗi hũ phân loại đúng tặng bạn <strong>+15 điểm</strong>.</p>
              <p>• Lựa chọn nhầm sẽ bị trừ <strong>-5 điểm & trừ 3 giây</strong>. Tuy vậy, trò chơi sẽ lập tức đính kèm mẹo nhớ giúp bạn <strong>thử sai tự do</strong> không lo gián đoạn!</p>
              <p>• Đạt chuỗi 10 cú thả chính xác liên tiếp để giành bằng Danh Hiệu sắc bén!</p>
            </div>
          </div>

          <button
            onClick={initGame}
            className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold py-3.5 px-6 rounded-2xl text-base soft-card-shadow hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            Bắt Đầu Phân Loại Cúc Hoa 🌾
          </button>
        </div>
      )}

      {/* ACTIVE GAMEPLAY */}
      {gameState === 'playing' && currentItem && (
        <div className="space-y-6" id="sorting-playing">
          {/* Header row tracking stats */}
          <div className="bg-white p-4 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow flex items-center justify-between text-sm flex-wrap gap-2">
            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border transition-all ${
              timeLeft <= 10 
                ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse' 
                : 'bg-rose-50 text-rose-700 border-rose-100'
            }`}>
              <Timer className={`w-4 h-4 ${timeLeft <= 10 ? 'animate-spin' : ''}`} />
              <span className="font-semibold text-xs">Thời gian còn lại:</span>
              <span className="font-mono font-bold">{timeLeft}s</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full border border-yellow-200">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-xs">Chuỗi đúng:</span>
              <span className="font-mono font-bold">{correctStreak} ván</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-amber-900/50 block">Tổng Điểm Thả</span>
              <span className="font-extrabold text-rose-950 font-mono text-base">{score}</span>
            </div>
          </div>

          {/* ACTIVE CHEMICAL CARD CONTAINER */}
          <div className="relative py-8 bg-white rounded-3xl border-2 border-garden-pink/60 soft-card-shadow flex flex-col items-center justify-center text-center overflow-hidden min-h-[180px]">
            {/* FLOATING POINT SCORE POPUP */}
            <AnimatePresence>
              {floatScore && (
                <motion.div
                  key={floatScore.id}
                  initial={{ opacity: 0, y: 10, scale: 0.5 }}
                  animate={{ opacity: 1, y: -40, scale: 1.2 }}
                  exit={{ opacity: 0, scale: 1.4 }}
                  className={`absolute font-black text-sm z-10 px-3 py-1 rounded-full shadow-md ${
                    floatScore.success 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {floatScore.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glowing background halos */}
            <div className="absolute w-40 h-40 rounded-full bg-pink-100/30 blur-2xl pointer-events-none" />

            <div className="space-y-2 z-1">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                currentItem.type === 'element' ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'
              }`}>
                {currentItem.type === 'element' ? 'Nguyên Tố Hóa Học' : 'Gốc Axit / Gốc Muối'}
              </span>
              
              <h4 className="text-5xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-500 to-indigo-600 p-1">
                {currentItem.symbol}
              </h4>
              <p className="text-base font-extrabold text-amber-950 font-display">
                {currentItem.name}
              </p>
              <p className="text-xs text-amber-900/50 max-w-sm px-6 italic mx-auto">
                Nhấp chuột chọn lọ hóa trị đúng cho chất này thật nhanh nào cậu ơi!
              </p>
            </div>
          </div>

          {/* FEEDBACK ROW */}
          <div className="min-h-[46px] flex items-center justify-center">
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`py-2 px-4 rounded-xl border text-xs text-center font-medium max-w-md ${
                  feedback.success 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {feedback.text}
              </motion.div>
            )}
          </div>

          {/* THE 3 MAGIC JARS / COLLECTION POTS */}
          <div className="grid grid-cols-3 gap-4" id="magic-pots-categories">
            {/* POT I */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSort('I')}
              className={`bg-white rounded-3xl border-2 border-garden-pink p-5 cursor-pointer text-center space-y-3 soft-card-shadow transition-colors group ${
                shakeJar === 'i' ? 'animate-bounce border-rose-500' : 'hover:bg-rose-50/40'
              }`}
            >
              <div className="w-14 h-14 bg-gradient-to-tr from-pink-300 to-pink-400 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:rotate-6 transition-all">
                <span className="text-xl font-extrabold font-display">I</span>
              </div>
              <div>
                <h5 className="text-xs font-extrabold text-rose-950 font-display">Hũ Hóa Trị I</h5>
                <p className="text-[9px] text-stone-400 block mt-0.5">Na, K, H, Ag, OH, NO₃...</p>
              </div>
            </motion.div>

            {/* POT II */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSort('II')}
              className={`bg-white rounded-3xl border-2 border-garden-pink p-5 cursor-pointer text-center space-y-3 soft-card-shadow transition-colors group ${
                shakeJar === 'ii' ? 'animate-bounce border-rose-500' : 'hover:bg-rose-50/40'
              }`}
            >
              <div className="w-14 h-14 bg-gradient-to-tr from-teal-300 to-teal-400 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:-rotate-6 transition-all">
                <span className="text-xl font-extrabold font-display">II</span>
              </div>
              <div>
                <h5 className="text-xs font-extrabold text-teal-950 font-display">Hũ Hóa Trị II</h5>
                <p className="text-[9px] text-stone-400 block mt-0.5">Ca, Mg, Ba, Zn, SO₄, CO₃...</p>
              </div>
            </motion.div>

            {/* POT III & OTHER */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSort('III_other')}
              className={`bg-white rounded-3xl border-2 border-garden-pink p-5 cursor-pointer text-center space-y-3 soft-card-shadow transition-colors group ${
                shakeJar === 'iii_other' ? 'animate-bounce border-rose-500' : 'hover:bg-rose-50/40'
              }`}
            >
              <div className="w-14 h-14 bg-gradient-to-tr from-purple-300 to-purple-400 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:rotate-6 transition-all">
                <span className="text-sm font-extrabold font-display leading-[14px]">III / Khác</span>
              </div>
              <div>
                <h5 className="text-xs font-extrabold text-purple-950 font-display">Hũ Khác (III+)</h5>
                <p className="text-[9px] text-stone-400 block mt-0.5">Al, PO₄, P, Fe, S...</p>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* SUMMARY PANEL */}
      {gameState === 'summary' && (
        <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 p-8 rounded-3xl border-2 border-garden-pink soft-card-shadow text-center space-y-6 max-w-lg mx-auto animate-fade-in" id="sorting-summary">
          <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center mx-auto text-6xl shadow-sm border border-yellow-250 animate-pulse">
            👑🍯
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold font-display text-amber-950">
              Chiến Tích Hũ Phép Thuật!
            </h3>
            <p className="text-xs text-amber-900/60 leading-relaxed px-5">
              Hũ phép hóa trị đã lấp lánh sương sao ngọt ngào. Hãy xem thành tích nhạy bén của bạn sau 45 giây liên tiếp:
            </p>
          </div>

          {/* Stats details layout */}
          <div className="grid grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-rose-100">
            <div className="text-center border-r border-rose-100">
              <span className="text-[9px] text-stone-400 font-bold uppercase block">Điểm quy đổi</span>
              <span className="text-2xl font-black font-display text-rose-500 block">{score}</span>
            </div>
            <div className="text-center">
              <span className="text-[9px] text-stone-400 font-bold uppercase block">Kỷ lục chuỗi đúng</span>
              <span className="text-2xl font-black font-display text-yellow-500 block">{maxStreak} cái</span>
            </div>
          </div>

          <div className="bg-amber-100/30 p-4 rounded-xl text-left border border-amber-200/50">
            <p className="text-xs leading-relaxed text-amber-950 font-medium">
              🌈 <strong>Sơ đồ phân xạ:</strong> Trò chơi phân loại nhanh giúp kích thích khả năng phản xạ thị giác cực kỳ đắc lực khi đối diện với các bài toán lập công thức hóa học phức tạp (vd: tính số mol, viết phản ứng trao đổi). Bạn đang rèn luyện cực tốt rồi đó!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={initGame}
              className="flex-1 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-2xl text-xs soft-card-shadow hover:scale-102 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Chinh Phục Lần Nữa</span>
            </button>
            <button
              onClick={() => setGameState('idle')}
              className="flex-1 bg-white hover:bg-rose-50 text-rose-700 border-2 border-garden-pink/60 font-bold py-3 px-4 rounded-2xl text-xs transition-all cursor-pointer"
            >
              Quay Về Màn Hình Vườn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
