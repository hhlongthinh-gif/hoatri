import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, ArrowRight, RefreshCw, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { ALL_CHEMICALS_DATA } from '../data';
import { MatchCard } from '../types';

interface MatchGameProps {
  onUnlockAchievement: (id: string) => void;
  onSaveScore: (score: number, accuracy: number) => void;
}

export default function MatchGame({ onUnlockAchievement, onSaveScore }: MatchGameProps) {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]); // Indexes of selected cards
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'summary'>('idle');
  const [sparklePairs, setSparklePairs] = useState<string[]>([]); // track items that sparkled

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (isTimerRunning && gameState === 'playing') {
      timerInterval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isTimerRunning, gameState]);

  const initGame = () => {
    // Pick 6 random chemical items (mix of elements & radicals)
    const shuffled = [...ALL_CHEMICALS_DATA].sort(() => 0.5 - Math.random());
    const selectedItems = shuffled.slice(0, 6);

    const generatedCards: MatchCard[] = [];

    // Colors to decorate cards softly
    const softColorClasses = [
      'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 text-pink-900',
      'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 text-teal-900',
      'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 text-rose-900',
      'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-900',
      'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-900',
      'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 text-amber-900'
    ];

    selectedItems.forEach((item, index) => {
      const color = softColorClasses[index % softColorClasses.length];
      
      // Card a: Chemical Name and Symbol
      generatedCards.push({
        id: `card-name-${item.id}`,
        content: `${item.symbol} (${item.name})`,
        type: 'name',
        itemId: item.id,
        isMatched: false,
        isFlipped: false,
        colorClass: color
      });

      // Card b: Roman Valence representation
      generatedCards.push({
        id: `card-val-${item.id}`,
        content: `Hóa trị ${item.valenceText}`,
        type: 'valence',
        itemId: item.id,
        isMatched: false,
        isFlipped: false,
        colorClass: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-900'
      });
    });

    // Shuffle the 12 generated cards
    const shuffledCards = generatedCards.sort(() => 0.5 - Math.random());
    setCards(shuffledCards);
    setSelectedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setElapsedTime(0);
    setIsTimerRunning(true);
    setGameState('playing');
  };

  const handleCardClick = (clickedIdx: number) => {
    // Basic guards
    if (gameState !== 'playing') return;
    if (cards[clickedIdx].isMatched || cards[clickedIdx].isFlipped) return;
    if (selectedCards.length >= 2) return; // ignore fast third clicking

    const updatedCards = [...cards];
    updatedCards[clickedIdx].isFlipped = true;
    setCards(updatedCards);

    const newSelected = [...selectedCards, clickedIdx];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves(prev => prev + 1);
      checkForMatch(newSelected);
    }
  };

  const checkForMatch = (currentSelected: number[]) => {
    const [firstIdx, secondIdx] = currentSelected;
    const firstCard = cards[firstIdx];
    const secondCard = cards[secondIdx];

    // Perfect match if referring to the same chemical item and are different card types
    const isMatched = 
      firstCard.itemId === secondCard.itemId && 
      firstCard.type !== secondCard.type;

    if (isMatched) {
      setTimeout(() => {
        const updated = [...cards];
        updated[firstIdx].isMatched = true;
        updated[secondIdx].isMatched = true;
        
        // Keep sparkled items
        setSparklePairs(prev => [...prev, firstCard.itemId]);

        setCards(updated);
        setSelectedCards([]);
        
        const nextMatchedCount = matchedPairs + 1;
        setMatchedPairs(nextMatchedCount);

        if (nextMatchedCount === 6) {
          endGame();
        }
      }, 500);
    } else {
      // Shaking or flip back on delay (trial error)
      setTimeout(() => {
        const updated = [...cards];
        updated[firstIdx].isFlipped = false;
        updated[secondIdx].isFlipped = false;
        setCards(updated);
        setSelectedCards([]);
      }, 1200);
    }
  };

  const endGame = () => {
    setIsTimerRunning(false);
    setGameState('summary');
    
    // Rewards achievements
    if (elapsedTime <= 45) {
      onUnlockAchievement('fast_matcher');
    }

    // Score based on speed and move economy
    // baseline 50 pt card clearance, extra for low moves and remaining time
    const moveFactor = Math.max(0, 20 - (moves - 6)) * 2;
    const timeFactor = Math.max(0, 60 - elapsedTime) * 2;
    const totalScore = 50 + moveFactor + timeFactor;

    // Accuracy
    const accuracy = Math.round((6 / moves) * 100) || 50;

    onSaveScore(totalScore, accuracy);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-2" id="match-viewport">
      {gameState === 'idle' && (
        <div className="bg-white p-8 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow text-center space-y-6 max-w-xl mx-auto" id="match-instructions">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-4xl border border-rose-100 shadow-inner">
            🔮
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold font-display text-rose-950">Thẻ Bài Kết Đôi Ma Thuật</h3>
            <p className="text-sm text-amber-900/70 leading-relaxed">
              Thử thách trí nhớ siêu phàm bằng mối tương giao đồng điệu. Hãy ghép cặp các nguyên tố hoặc gốc muối với đúng các thẻ chứa chữ số hóa trị tương thích của chúng!
            </p>
          </div>

          <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100 text-left space-y-2 text-xs">
            <p className="font-bold text-indigo-800">🔮 Hướng dẫn ma thuật dễ thương:</p>
            <div className="space-y-1 text-amber-900/80">
              <p>• Có tổng cộng <strong>12 thẻ bài</strong> nằm ngửa ngẫu nhiên.</p>
              <p>• Nhấp vào <strong>1 thẻ nguyên tố/gốc muối</strong> và nhấp tiếp <strong>1 thẻ hóa trị tương thích</strong>.</p>
              <p>• Ghép trúng, thẻ tan thành bông hoa lấp lánh 🌸.</p>
              <p>• Ghép sai, thẻ sẽ tự động lật úp ngược lại để bạn <strong>thử sai thoải mái</strong> mà không mất tim!</p>
              <p>• Hãy cố gắng chinh phục mục tiêu dưới <strong>45 giây</strong> để mở khóa Danh Hiệu quý phái!</p>
            </div>
          </div>

          <button
            onClick={initGame}
            className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold py-3.5 px-6 rounded-2xl text-base soft-card-shadow hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            Mở Khóa Tập Bài Ma Thuật ✨
          </button>
        </div>
      )}

      {/* MATCH GRID PLAYING VIEW */}
      {gameState === 'playing' && (
        <div className="space-y-5" id="match-playing-grid-wrapper">
          {/* Header row information stats */}
          <div className="bg-white p-4 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow flex items-center justify-between text-sm flex-wrap gap-3">
            <div className="flex items-center space-x-1.5 text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
              <Timer className="w-4 h-4 text-rose-600" />
              <span className="font-semibold text-xs">Thời gian:</span>
              <span className="font-mono font-bold tracking-wider">{formatTime(elapsedTime)}</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-amber-900/50 block">Số lượt ghép cặp</span>
              <span className="font-extrabold text-indigo-950 font-mono text-base">{moves} lượt</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-amber-900/50 block">Tiến độ</span>
              <span className="font-extrabold text-rose-600 font-display text-base">{matchedPairs} / 6 cặp</span>
            </div>
          </div>

          {/* Cards board grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" id="magic-cards-board">
            {cards.map((card, idx) => {
              const isSelected = selectedCards.includes(idx);
              const { isMatched, isFlipped } = card;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className="aspect-[4/3] relative cursor-pointer select-none group h-24"
                >
                  <AnimatePresence initial={false} mode="wait">
                    {!isFlipped && !isMatched ? (
                      /* BACK: Cute floral back of the card */
                      <motion.div
                        key="back"
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-gradient-to-tr from-pink-100 via-rose-100 to-amber-100 border-2 border-dashed border-garden-rose p-3 rounded-2xl flex flex-col items-center justify-center text-center soft-card-shadow hover:scale-102 active:scale-95 transition-all text-rose-400 group-hover:border-garden-purple"
                      >
                        <span className="text-2xl animate-pulse">✿</span>
                        <span className="text-[10px] text-rose-500/60 mt-0.5 uppercase tracking-widest font-black">Hóa Trị</span>
                      </motion.div>
                    ) : isMatched ? (
                      /* MATCHED: Dissolved faded nice block */
                      <motion.div
                        key="matched"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.9 }}
                        className="absolute inset-0 bg-emerald-50/50 border-2 border-dashed border-emerald-300 rounded-2xl flex flex-col items-center justify-center text-center opacity-40 text-emerald-800"
                      >
                        <span className="text-xl">🌸 Match!</span>
                        <span className="text-[10px] font-bold line-through">{card.content}</span>
                      </motion.div>
                    ) : (
                      /* SIGN: Clicked / reveal card face content */
                      <motion.div
                        key="face"
                        initial={{ rotateY: -90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute inset-0 border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center soft-card-shadow font-bold ${
                          card.colorClass
                        } ${isSelected ? 'ring-2 ring-purple-400 border-purple-300' : ''}`}
                      >
                        {/* Sparkle star for matched ones */}
                        {card.type === 'name' ? (
                          <>
                            <span className="text-lg font-extrabold font-display leading-tight">{card.content.split(' ')[0]}</span>
                            <span className="text-[9px] text-amber-900/60 font-semibold">{card.content.substring(card.content.indexOf(' ') + 1)}</span>
                          </>
                        ) : (
                          <span className="text-sm font-extrabold font-display">{card.content}</span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="text-center text-xs text-amber-900/40">
            Mách nhỏ: Bạn luôn có thể xem ngửa bất kỳ lúc nào, tập trung ghi lại vị trí lá hóa trị để ghép đôi lẹ nhất nhé!
          </div>
        </div>
      )}

      {/* MATCH SUMMARY SCREEN */}
      {gameState === 'summary' && (
        <div className="bg-gradient-to-br from-violet-50 via-white to-pink-50 p-8 rounded-3xl border-2 border-garden-purple soft-card-shadow text-center space-y-6 max-w-lg mx-auto" id="match-summary">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-6xl shadow-sm border border-purple-100 animate-bounce">
            🔮✨
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold font-display text-indigo-950">
              {elapsedTime <= 45 ? 'Hoàn Thành Xuất Sắc!' : 'Luyện Ghép Cặp Thắng Lợi!'}
            </h3>
            <p className="text-xs text-amber-900/60 leading-relaxed px-5">
              Tất cả các thẻ bài hóa trị ma thuật đã được ghép đôi ăn ý và tiêu tán vào cỏ ngọt thơm mát.
            </p>
          </div>

          {/* Score grid details */}
          <div className="grid grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-indigo-100">
            <div className="text-center border-r border-indigo-50">
              <span className="text-[9px] text-stone-400 font-bold uppercase block">Thời gian</span>
              <span className="text-xl font-black font-display text-indigo-600 block">{formatTime(elapsedTime)}</span>
            </div>
            <div className="text-center border-r border-indigo-50">
              <span className="text-[9px] text-stone-400 font-bold uppercase block">Số lượt ghép</span>
              <span className="text-xl font-black font-display text-purple-600 block">{moves} lượt</span>
            </div>
            <div className="text-center">
              <span className="text-[9px] text-stone-400 font-bold uppercase block">Độ chuẩn xác</span>
              <span className="text-xl font-black font-display text-emerald-600 block">{Math.round((6 / moves) * 100)}%</span>
            </div>
          </div>

          <div className="bg-indigo-50/50 p-4 rounded-xl text-left border border-indigo-100/50">
            <p className="text-xs leading-relaxed text-amber-950 font-medium">
              💡 <strong>Kiến thức ghi nhận:</strong> Các thẻ cặp mà bạn đã ghép nối giúp phát triển tư duy tương quan sâu giữa ký hiệu (vd: CO₃, Sắt Fe) và hóa trị chữ số La Mã cực tốt cho kỳ thi đại học và phổ thông sắp tới.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={initGame}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-2xl text-xs soft-card-shadow hover:scale-102 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử Sức Ván Khác</span>
            </button>
            <button
              onClick={() => setGameState('idle')}
              className="flex-1 bg-white hover:bg-rose-50 text-purple-700 border-2 border-garden-purple/60 font-bold py-3 px-4 rounded-2xl text-xs transition-all cursor-pointer"
            >
              Quay Về Sân Vườn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
