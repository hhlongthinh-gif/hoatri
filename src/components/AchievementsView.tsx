import React from 'react';
import { motion } from 'motion/react';
import { Award, Lock, Sparkles, Trophy, Calendar, CheckCircle } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export default function AchievementsView({ achievements }: AchievementsViewProps) {
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const percentage = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-2" id="achievements-viewport">
      {/* Achievements Header summary */}
      <div className="bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 rounded-3xl border-2 border-garden-pink soft-card-shadow flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-rose-600">
            <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-100" />
            <h2 className="text-xl font-bold font-display">Bảng Vàng Danh Hiệu</h2>
          </div>
          <p className="text-xs text-amber-900/60 leading-relaxed max-w-lg">
            Hoàn tất các thử thách hóa học ngọt ngào để gieo trồng đủ loại huy chương hoa kiêu sa quý quyến rũ vào khu vườn tâm thức của bạn!
          </p>

          {/* Progress bar */}
          <div className="pt-2">
            <div className="flex justify-between text-[11px] text-amber-900/60 font-semibold mb-1">
              <span>Đã mở khóa: {unlockedCount} / {achievements.length} bộ huy chương</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-rose-100 p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 rounded-full"
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* Big trophy medal graphics */}
        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm flex flex-col items-center justify-center text-center w-36">
          <span className="text-4xl animate-bounce">🏆</span>
          <span className="text-[10px] text-stone-400 font-bold block mt-2">Xếp Hạng Danh Dự</span>
          <span className="text-sm font-black font-display text-rose-900 mt-0.5">
            {unlockedCount === achievements.length 
              ? 'Nữ Hoàng Hóa Học 👑' 
              : unlockedCount >= 4 
              ? 'Học Giả Ưu Tú 🌸' 
              : unlockedCount >= 1 
              ? 'Tập Sự Vườn Hoa 🌱' 
              : 'Hạt Mầm Thơ Ngây 🌾'}
          </span>
        </div>
      </div>

      {/* Grid of badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="achievements-badges-grid">
        {achievements.map((achievement, idx) => {
          const { id, title, description, icon, isUnlocked, unlockedAt, requirementText } = achievement;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-5 rounded-3xl border-2 transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px] ${
                isUnlocked
                  ? 'bg-white border-garden-pink soft-card-shadow'
                  : 'bg-stone-50/50 border-stone-200 opacity-75'
              }`}
            >
              {isUnlocked && (
                <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-16 h-16 bg-gradient-to-tr from-pink-400 to-rose-400 opacity-15 rounded-full blur-xl pointer-events-none" />
              )}

              <div className="space-y-2.5">
                {/* Icon box */}
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${
                    isUnlocked 
                      ? 'bg-rose-50 border-rose-100 text-rose-500' 
                      : 'bg-stone-100 border-stone-200 text-stone-400'
                  }`}>
                    {isUnlocked ? icon : '🔒'}
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center space-x-0.5 text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Đã Đạt</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-0.5 text-[9px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-bold">
                      <Lock className="w-3 h-3" />
                      <span>Đang Khóa</span>
                    </span>
                  )}
                </div>

                {/* Info titles */}
                <div className="space-y-0.5">
                  <h4 className="text-sm font-extrabold text-rose-950 font-display">
                    {title}
                  </h4>
                  <p className="text-xs text-amber-900/70 leading-normal">
                    {description}
                  </p>
                </div>
              </div>

              {/* Requirement footer or Date unlocked */}
              <div className="border-t border-dashed border-stone-100 pt-2.5 mt-2.5">
                {isUnlocked ? (
                  <div className="flex items-center space-x-1 text-[9px] text-stone-400 italic">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>Mở khoá lúc: {unlockedAt || "Gần đây"}</span>
                  </div>
                ) : (
                  <p className="text-[10px] text-amber-900/40 line-clamp-2">
                    Yêu cầu: {requirementText}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
