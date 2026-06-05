import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Timer, Sparkles, AlertCircle, RefreshCw, Trophy, Flame, HelpCircle, ArrowRight, HeartPulse } from 'lucide-react';
import { ALL_CHEMICALS_DATA } from '../data';
import { ChemicalItem, QuizQuestion } from '../types';

interface QuizGameProps {
  onUnlockAchievement: (id: string) => void;
  onSaveScore: (score: number, accuracy: number) => void;
}

const FLOWER_STAGES = [
  { stage: 0, text: "Hạt mầm bé bỏng", description: "Đang ủ mình đợi những đáp án đúng lành của cậu...", emoji: "🌱" },
  { stage: 1, text: "Chồi non hé mở", description: "Mầm xanh bé xíu vươn mình chào nắng ấm!", emoji: "🌿" },
  { stage: 2, text: "Hai chiếc lá nhỏ", description: "Thêm một chút dinh dưỡng hóa trị để lớn khôn.", emoji: "🍀" },
  { stage: 3, text: "Nụ hoa chớm nở", description: "Hương hoa ngọt ngào đang e ấp chờ bùng tỏa rực rỡ.", emoji: "🌷" },
  { stage: 4, text: "Bông hoa nở rộ lấp lánh!", description: "Cậu đỉnh lắm! Bông hoa hóa trị kiêu sa đã nở ngát hương thơm.", emoji: "🌸" }
];

export default function QuizGame({ onUnlockAchievement, onSaveScore }: QuizGameProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'wrong_feedback' | 'summary' | 'revive_challenge'>('idle');
  const [isPotShaking, setIsPotShaking] = useState(false);
  const [isSparkling, setIsSparkling] = useState(false);

  // Magic Revive State
  const [reviveQuestion, setReviveQuestion] = useState<{item: ChemicalItem, questionText: string, options: string[], answer: string} | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate 10 random questions
  const generateQuiz = () => {
    const shuffled = [...ALL_CHEMICALS_DATA].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    
    const generated: QuizQuestion[] = selected.map((item, index) => {
      const correctValence = item.valenceText;
      
      // Determine options
      const distractorPool = ["I", "II", "III", "IV", "V", "VI", "II, III", "I, II"];
      let filterPool = distractorPool.filter(v => v !== correctValence);
      
      // Shuffle distractors and pick 3
      filterPool.sort(() => 0.5 - Math.random());
      const rawOptions = [correctValence, ...filterPool.slice(0, 3)];
      
      // Shuffle options
      const options = rawOptions.sort(() => 0.5 - Math.random());

      const subjectType = item.type === 'element' ? 'Nguyên tố' : 'Gốc muối (gốc axit)';
      const questionText = `${subjectType} "${item.name}" (Ký hiệu: ${item.symbol}) có hóa trị hoặc dãy hóa trị thường gặp là bao nhiêu?`;

      return {
        id: `q-${index}-${item.id}`,
        item,
        questionText,
        options,
        correctAnswer: correctValence,
        explanation: item.chemistryTip || `${item.name} (${item.symbol}) mang hóa trị ${correctValence}. ${item.description}`
      };
    });

    setQuestions(generated);
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setLives(3);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setGameState('playing');
  };

  // Turn active timer on
  useEffect(() => {
    if (gameState === 'playing' && !isAnswered) {
      setTimeLeft(30);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentIdx, isAnswered]);

  const handleTimeout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedAnswer(""); // empty string represents timeout
    setIsAnswered(true);
    setStreak(0);
    setLives(prev => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        // Trigger revive or show summary
        return 0;
      }
      return nextLives;
    });
    setIsPotShaking(true);
    setTimeout(() => setIsPotShaking(false), 600);
  };

  const handleAnswerSubmit = (option: string) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(option);
    setIsAnswered(true);
    
    const currentQ = questions[currentIdx];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      const currentStreak = streak + 1;
      setStreak(currentStreak);
      if (currentStreak > maxStreak) setMaxStreak(currentStreak);
      
      // Calculate points with multipliers for streak
      const streakBonus = Math.floor(currentStreak / 3) * 10;
      const pointsEarned = 10 + streakBonus;
      setScore(prev => prev + pointsEarned);
      
      // Visual sparkle!
      setIsSparkling(true);
      setTimeout(() => setIsSparkling(false), 1200);

      // Achievements triggers
      onUnlockAchievement('first_quiz_win');
      if (currentStreak >= 5) {
        onUnlockAchievement('perfect_streak');
      }
    } else {
      setStreak(0);
      setLives(prev => prev - 1);
      
      // Visual shaking
      setIsPotShaking(true);
      setTimeout(() => setIsPotShaking(false), 600);
    }
  };

  const currentFlowerStageIndex = () => {
    // 0 to 10 questions. Break down into 5 stages
    if (score < 10) return 0;
    if (score < 30) return 1;
    if (score < 50) return 2;
    if (score < 80) return 3;
    return 4;
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);

    if (lives <= 0) {
      prepareReviveChallenge();
    } else if (currentIdx + 1 >= questions.length) {
      finishGame();
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const prepareReviveChallenge = () => {
    // Generate one simple True/False or direct chemical spelling question to restore hearts
    const randomItem = ALL_CHEMICALS_DATA[Math.floor(Math.random() * ALL_CHEMICALS_DATA.length)];
    const correctVal = randomItem.valenceText;
    const isTrue = Math.random() > 0.5;
    
    let queryValence = correctVal;
    if (!isTrue) {
      // Pick a false one
      const wrongPool = ["I", "II", "III", "IV"].filter(v => v !== correctVal);
      queryValence = wrongPool[Math.floor(Math.random() * wrongPool.length)] || "Hóa trị bí ẩn";
    }

    const questionText = `Bạn có muốn đổi đáp án để tích luỹ tim? Thật hay giả: "${randomItem.name} (${randomItem.symbol}) có hóa trị ${queryValence}"?`;
    
    setReviveQuestion({
      item: randomItem,
      questionText,
      options: ["Chính Xác (True)", "Sai Rồi (False)"],
      answer: isTrue ? "Chính Xác (True)" : "Sai Rồi (False)"
    });
    setGameState('revive_challenge');
  };

  const handleReviveAnswer = (option: string) => {
    if (!reviveQuestion) return;
    if (option === reviveQuestion.answer) {
      // Revival success! Add 2 hearts, continue game
      setLives(2);
      setGameState('playing');
      setIsSparkling(true);
      setTimeout(() => setIsSparkling(false), 1200);
      if (currentIdx + 1 >= questions.length) {
        finishGame();
      } else {
        setCurrentIdx(prev => prev + 1);
      }
    } else {
      // Failed revival, go directly to summary
      finishGame();
    }
  };

  const finishGame = () => {
    setGameState('summary');
    const accuracy = Math.round((questions.filter((q, i) => q.correctAnswer === (selectedAnswer ?? "")).length) / questions.length * 100) || 40;
    onSaveScore(score, accuracy);
    if (lives === 3 && score >= 80) {
      onUnlockAchievement('survivor');
    }
  };

  const currentQ = questions[currentIdx];
  const flowerStage = FLOWER_STAGES[currentFlowerStageIndex()];

  return (
    <div className="max-w-4xl mx-auto px-2" id="quiz-viewport">
      {gameState === 'idle' && (
        <div className="bg-white p-8 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow text-center space-y-6 max-w-xl mx-auto" id="quiz-instructions">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-4xl border border-rose-100 shadow-inner">
            🌸
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold font-display text-rose-950">Mảnh Vườn Đố Vui Hóa Trị</h3>
            <p className="text-sm text-amber-900/70 py-1">
              Ươm mầm hạt giống của bạn bằng cách trả lời đúng hóa trị của các nguyên tố và gốc muối. Hoa sẽ nở rộ rực rỡ khi bạn có câu trả lời thông thái!
            </p>
          </div>

          <div className="bg-rose-50/50 p-4 rounded-2xl border border-pink-100 text-left space-y-2.5 text-xs">
            <p className="font-bold text-rose-800 flex items-center gap-1">🌸 Luật chơi rất đáng yêu:</p>
            <div className="space-y-1.5 text-amber-900/80">
              <p>• Có tất cả <strong>10 câu hỏi</strong> ngẫu nhiên về hóa trị.</p>
              <p>• Trả lời trong vòng <strong>30 giây</strong> mỗi câu.</p>
              <p>• Khởi đầu có <strong>3 trái tim</strong> 💖. Trả lời sai mất 1 tim nhưng bạn sẽ nhận được mẹo nhớ bài hữu ích để cố gắng câu sau!</p>
              <p>• Trả lời đúng nhiều câu liên tiếp sẽ kích hoạt <strong>Lửa Chuỗi Flame</strong> tăng điểm thưởng.</p>
              <p>• Nếu mất sạch tim, bạn có <strong>1 cơ hội giải đố Thật hay Giả</strong> để Hồi Sinh hồi phục tim!</p>
            </div>
          </div>

          <button
            onClick={generateQuiz}
            className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold py-3.5 px-6 rounded-2xl text-base soft-card-shadow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Trồng Hoa Ngay Hôm Nay 🌱
          </button>
        </div>
      )}

      {/* GAME STATUS SCREEN */}
      {(gameState === 'playing' && currentQ) && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch" id="quiz-playing">
          {/* LEFT: Flower growing visualizer */}
          <div className="md:col-span-4 bg-white p-6 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow flex flex-col justify-between items-center text-center relative overflow-hidden" id="quiz-flower-column">
            
            {/* Sparkle animations */}
            <AnimatePresence>
              {isSparkling && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
                >
                  <span className="text-4xl text-yellow-400 animate-ping">✨</span>
                  <span className="text-2xl text-pink-400 absolute translate-x-12 -translate-y-8 animate-bounce">💖</span>
                  <span className="text-3xl text-teal-400 absolute -translate-x-14 translate-y-10">💮</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Giai đoạn hoa lớn</span>
              <h4 className="text-sm font-extrabold text-amber-950 mt-1">{flowerStage.text}</h4>
            </div>

            {/* Plant Pot Canvas illustration */}
            <div className={`my-6 relative w-48 h-48 flex items-center justify-center ${isPotShaking ? 'animate-bounce' : ''}`} id="clay-plant-pot">
              {/* Backglow glow ring based on stage */}
              <div className={`absolute w-36 h-36 rounded-full blur-xl pointer-events-none transition-all duration-700 ${
                score < 10 ? 'bg-amber-100/20' : score < 30 ? 'bg-teal-100/30' : score < 50 ? 'bg-indigo-100/40' : 'bg-pink-100/60'
              }`} />
              
              {/* Plant Stem / Leaves visual using cute SVG elements directly */}
              <svg viewBox="0 0 100 100" className="w-full h-full z-1">
                {/* STEM */}
                {currentFlowerStageIndex() >= 1 && (
                  <motion.path
                    d="M 50,75 L 50,45"
                    stroke="#81C784"
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />
                )}
                {/* BRANCHES / LEAVES */}
                {currentFlowerStageIndex() >= 2 && (
                  <>
                    <motion.path d="M 50,60 Q 35,55 30,50" fill="none" stroke="#66BB6A" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="30" cy="50" r="3" fill="#66BB6A" />
                    <motion.path d="M 50,52 Q 65,48 70,45" fill="none" stroke="#66BB6A" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="70" cy="45" r="3" fill="#66BB6A" />
                  </>
                )}
                {/* BUD & PETALS */}
                {currentFlowerStageIndex() === 3 && (
                  <g>
                    <motion.circle cx="50" cy="40" r="10" fill="#F48FB1" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
                    <circle cx="50" cy="40" r="6" fill="#F06292" />
                  </g>
                )}
                {currentFlowerStageIndex() === 4 && (
                  <g id="flower-blooming-magic">
                    <circle cx="50" cy="40" r="10" fill="#FFF" />
                    {/* Petal 1 */}
                    <circle cx="40" cy="40" r="11" fill="#F06292" opacity="0.85" />
                    {/* Petal 2 */}
                    <circle cx="60" cy="40" r="11" fill="#F06292" opacity="0.85" />
                    {/* Petal 3 */}
                    <circle cx="50" cy="30" r="11" fill="#F06292" opacity="0.85" />
                    {/* Petal 4 */}
                    <circle cx="50" cy="50" r="11" fill="#F06292" opacity="0.85" />
                    {/* Petal diagonals */}
                    <circle cx="43" cy="33" r="10" fill="#FF8A08" opacity="0.7" />
                    <circle cx="57" cy="47" r="10" fill="#FF8A08" opacity="0.7" />
                    <circle cx="57" cy="33" r="10" fill="#FF8A08" opacity="0.7" />
                    <circle cx="43" cy="47" r="10" fill="#FF8A08" opacity="0.7" />
                    {/* Yellow Core */}
                    <circle cx="50" cy="40" r="8" fill="#FDD835" />
                    <circle cx="49" cy="39" r="3" fill="#FFF" />
                  </g>
                )}
                {/* EARTH POT */}
                <ellipse cx="50" cy="78" rx="22" ry="7" fill="#8D6E63" />
                <path d="M 32,77 L 36,95 Q 50,98 64,95 L 68,77 Z" fill="#D7CCC8" stroke="#A1887F" strokeWidth="1" />
                <ellipse cx="50" cy="77" rx="18" ry="4" fill="#3E2723" />
                <rect x="35" y="81" width="30" height="2" fill="#D81B60" rx="1" /> {/* Decorative pot band */}
                
                {/* Seed state emoji placeholder */}
                {currentFlowerStageIndex() === 0 && (
                  <text x="50" y="65" textAnchor="middle" fontSize="22" className="animate-pulse">🌱</text>
                )}
              </svg>
              <span className="absolute bottom-5 text-4xl">{flowerStage.emoji === '🌱' ? '' : flowerStage.emoji}</span>
            </div>

            <div className="bg-amber-50/70 p-3 rounded-2xl w-full border border-amber-100">
              <span className="text-[11px] text-amber-900 leading-snug block">{flowerStage.description}</span>
            </div>
          </div>

          {/* RIGHT: Active Question and Options (8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-4" id="quiz-question-column">
            {/* Health Bar, Timer, Score header */}
            <div className="bg-white p-4 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow flex items-center justify-between flex-wrap gap-2 text-sm">
              <div className="flex items-center space-x-1.5" id="lives-display">
                <span className="text-xs text-amber-900/60 font-semibold mr-1">Trái tim:</span>
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 ${
                      i < lives ? 'fill-rose-400 text-rose-500 animate-pulse' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>

              {/* Time Remaining */}
              <div className="flex items-center space-x-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full border border-rose-100">
                <Timer className="w-4 h-4 animate-spin text-rose-600" />
                <span className="font-mono font-bold">{timeLeft}s</span>
              </div>

              {/* Score and Streak indicator */}
              <div className="flex items-center space-x-3">
                {streak >= 3 && (
                  <div className="flex items-center space-x-0.5 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs font-bold animate-bounce">
                    <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                    <span>x{Math.floor(streak / 3) + 1}</span>
                  </div>
                )}
                <div className="text-right">
                  <span className="text-xs text-amber-900/50 block">Điểm số</span>
                  <span className="font-extrabold text-rose-950 font-mono text-base">{score}</span>
                </div>
              </div>
            </div>

            {/* Core Question Card */}
            <div className="bg-white p-6 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow space-y-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs text-amber-900/40 mb-2">
                  <span>Câu hỏi {currentIdx + 1}/10</span>
                  <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                    {currentQ.item.type === 'element' ? 'Nguyên Tố' : 'Gốc Axit'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-amber-950 leading-snug">
                  {currentQ.questionText}
                </h3>
              </div>

              {/* Chemical symbol big preview in the center of the card for girl appeal */}
              <div className="my-3 py-4 bg-gradient-to-r from-rose-50/30 via-pink-50/40 to-indigo-50/25 rounded-2xl border border-rose-100/30 flex items-center justify-center space-x-4">
                <span className="text-4xl font-extrabold font-display tracking-tight text-rose-950 bg-white/90 px-5 py-2.5 rounded-2xl border border-rose-200 shadow-sm">
                  {currentQ.item.symbol}
                </span>
                <div className="text-left">
                  <span className="text-[10px] text-amber-900/50 block font-semibold uppercase">Tên khoa học</span>
                  <span className="text-sm font-bold text-amber-950">{currentQ.item.name}</span>
                </div>
              </div>

              {/* Selection Options */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                {currentQ.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrectAns = option === currentQ.correctAnswer;
                  const isWrongSelection = isSelected && !isCorrectAns;

                  let buttonStyles = "bg-orange-50/30 hover:bg-rose-50/70 border-garden-pink/30 hover:border-garden-pink/60 text-amber-900";
                  
                  if (isAnswered) {
                    if (isCorrectAns) {
                      buttonStyles = "bg-emerald-100 border-emerald-400 text-emerald-950 font-extrabold soft-glow-mint";
                    } else if (isWrongSelection) {
                      buttonStyles = "bg-rose-100 border-rose-400 text-rose-950 soft-glow-pink";
                    } else {
                      buttonStyles = "opacity-40 border-stone-100 text-stone-400 bg-stone-50";
                    }
                  }

                  return (
                    <button
                      key={option}
                      disabled={isAnswered}
                      onClick={() => handleAnswerSubmit(option)}
                      className={`py-3 px-4 rounded-2xl border-2 text-sm font-semibold transition-all cursor-pointer ${buttonStyles}`}
                    >
                      Hóa Trị {option}
                    </button>
                  );
                })}
              </div>

              {/* Timed-out special notification */}
              {isAnswered && selectedAnswer === "" && (
                <div className="flex items-center space-x-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                  <AlertCircle className="w-4 h-4 animate-bounce" />
                  <span>Ối, đã hết thời gian mất rồi! Tim giảm mất một chiếc tẹo nha!</span>
                </div>
              )}
            </div>

            {/* Trial and error feedback block */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className={`p-4 rounded-3xl border-2 soft-card-shadow flex flex-col justify-between ${
                    selectedAnswer === currentQ.correctAnswer
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300'
                      : 'bg-gradient-to-r from-amber-50 to-orange-50/60 border-amber-300'
                  }`}
                  id="quiz-feedback-box"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl mt-0.5 select-none text-rose-400">
                      {selectedAnswer === currentQ.correctAnswer ? '⭐️' : '💡'}
                    </span>
                    <div className="space-y-0.5 text-xs text-amber-950 flex-1">
                      <p className="font-extrabold text-sm">
                        {selectedAnswer === currentQ.correctAnswer 
                          ? 'Cậu giỏi quá! Đáp án đúng chuẩn xác.' 
                          : `Đừng buồn nè! Hóa trị đúng là: ${currentQ.correctAnswer}`
                        }
                      </p>
                      <p className="text-[11px] text-amber-900/80 leading-relaxed italic">
                        "{currentQ.explanation}"
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="mt-3.5 self-end bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white text-xs font-bold py-2 px-4 rounded-full transition-all soft-card-shadow hover:translate-x-0.5 cursor-pointer flex items-center space-x-1"
                  >
                    <span>{currentIdx < questions.length - 1 ? "Câu Tiếp Theo" : "Xem Tổng Kết"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* MAGIC REVIVE CHALLENGE */}
      {gameState === 'revive_challenge' && reviveQuestion && (
        <div className="bg-white p-8 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow text-center space-y-6 max-w-xl mx-auto" id="revive-viewport">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-4xl border border-emerald-100 shadow-inner animate-pulse">
            💖
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold font-display text-emerald-950">Biện Pháp Cứu Hồi: Phép Thuật Hóa Trị</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Bạn ngọc ơi, khu vườn của bạn đang cạn kiệt năng lượng! Hãy vượt qua một câu hỏi Thật-Sai đột xuất để khôi phục <strong>2 mạng sống (trái tim)</strong> để vẽ tiếp đoá hoa của mình nhé!
            </p>
          </div>

          <div className="bg-emerald-50/50 p-6 rounded-2xl border-2 border-emerald-200 text-center text-sm font-semibold text-amber-950">
            <span className="text-3xl font-black font-display text-emerald-800 block mb-3">
              {reviveQuestion.item.symbol}
            </span>
            <span>"{reviveQuestion.questionText}"</span>
          </div>

          <div className="flex gap-4">
            {reviveQuestion.options.map(option => (
              <button
                key={option}
                onClick={() => handleReviveAnswer(option)}
                className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-2 border-emerald-300 font-bold py-3 px-4 rounded-2xl transition-all cursor-pointer text-sm"
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={finishGame}
            className="text-xs text-rose-500 hover:underline cursor-pointer block mx-auto pt-2"
          >
            Chấp nhận kết quả hiện tại, bỏ qua Hồi Sinh
          </button>
        </div>
      )}

      {/* SUMMARY MODAL SCREEN */}
      {gameState === 'summary' && (
        <div className="bg-gradient-to-br from-rose-50 via-white to-pink-50 p-8 rounded-3xl border-2 border-garden-pink soft-card-shadow text-center space-y-6 max-w-lg mx-auto" id="quiz-summary">
          <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center mx-auto text-6xl shadow-sm border border-pink-100">
            {score >= 80 ? '🌸' : score >= 50 ? '🌷' : '🌱'}
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold font-display text-rose-950">
              {score >= 80 ? 'Hoa Đã Nở Khoe Sắc Rực Rỡ!' : score >= 50 ? 'Cây Đã Lấn Sóc Có Hoa!' : 'Mầm Xanh Cần Thêm Ánh Sáng!'}
            </h3>
            <p className="text-xs text-amber-900/60 leading-relaxed px-5">
              Cảm ơn công sức chăm bón vườn hoa hóa học tinh tươm của bạn. Kết quả của lượt chơi:
            </p>
          </div>

          {/* Score details badge with fancy layout */}
          <div className="grid grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-rose-200/60">
            <div className="text-center border-r border-rose-100">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Tổng điểm đạt</span>
              <span className="text-2xl font-black font-display font-mono text-rose-600 block">{score}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Chuỗi cao nhất</span>
              <span className="text-2xl font-black font-display font-mono text-orange-500 block">{maxStreak}🔥</span>
            </div>
          </div>

          <div className="bg-rose-50/50 p-4 rounded-xl text-left border border-rose-100/50">
            <p className="text-xs leading-relaxed text-amber-950 font-medium">
              🌈 <strong>Nhận định chuyên môn:</strong> {score >= 80 
                ? "Thích thật đó! Hóa trị đối với cậu chỉ là những cánh hoa nhẹ nhàng dễ mến. Hãy duy trì trí nhớ siêu sao này nha!" 
                : score >= 50 
                ? "Quá tuyệt! Cây đã ra nụ xinh đẹp. Chỉ cần đọc thêm Sổ Tay Hóa Chất của tớ vài lượt nữa thôi là bông hoa của cậu sẽ nở rực rỡ nhất."
                : "Hạt mầm vẫn ôm ấp đất lành. Không sao hết, thử lại một lần nữa để ươm đáp án trúng lớn hơn nhé!"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={generateQuiz}
              className="flex-1 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-2xl text-xs soft-card-shadow hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Chăm Bón Lại Lượt Mới</span>
            </button>
            <button
              onClick={() => setGameState('idle')}
              className="flex-1 bg-white hover:bg-rose-50 text-rose-700 border-2 border-garden-pink/60 font-bold py-3 px-4 rounded-2xl text-xs transition-all cursor-pointer"
            >
              Về Màn Hình Vườn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
