import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, BookOpen, Bookmark, Info, Star, ChevronRight } from 'lucide-react';
import { ALL_CHEMICALS_DATA, MNEMONIC_PEOM, CHEMISTRY_PUNS_AND_MESSAGES } from '../data';
import { ChemicalItem } from '../types';

interface HandbookProps {
  onUnlockAchievement: (id: string) => void;
}

export default function Handbook({ onUnlockAchievement }: HandbookProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'element' | 'radical'>('all');
  const [selectedItem, setSelectedItem] = useState<ChemicalItem>(ALL_CHEMICALS_DATA[0]);
  const [readCount, setReadCount] = useState<string[]>([]);
  const [randomQuote, setRandomQuote] = useState('');

  useEffect(() => {
    // Pick a random chemistry cute pun
    const rIdx = Math.floor(Math.random() * CHEMISTRY_PUNS_AND_MESSAGES.length);
    setRandomQuote(CHEMISTRY_PUNS_AND_MESSAGES[rIdx]);
  }, []);

  const handleSelectItem = (item: ChemicalItem) => {
    setSelectedItem(item);
    if (!readCount.includes(item.id)) {
      const updated = [...readCount, item.id];
      setReadCount(updated);
      if (updated.length >= 5) {
        onUnlockAchievement('bookworm');
      }
    }
  };

  const filteredItems = ALL_CHEMICALS_DATA.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.valenceText.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    return matchesSearch && item.type === activeFilter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto px-2" id="handbook-viewport">
      {/* LEFT COLUMN: Search & List (7 cols on large screens) */}
      <div className="lg:col-span-7 flex flex-col space-y-4" id="handbook-search-list">
        {/* Filters and search box */}
        <div className="bg-white p-5 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow space-y-4">
          <div className="flex items-center space-x-2 text-rose-600">
            <BookOpen className="w-5 h-5" id="handbook-title-icon" />
            <h2 className="text-xl font-bold font-display" id="handbook-header-title">Thư Viện Vườn Hoa Hóa Trị</h2>
          </div>
          <p className="text-sm text-amber-900/70"> Tra cứu nhanh hóa trị các nguyên tố trung học phổ thông & gốc muối cơ bản kèm những bài vè ghi nhớ dễ thương.</p>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-rose-300">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Nhập tên nguyên tố, ký hiệu (vd: Na, SO4) hoặc hóa trị (I, II)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm w-full bg-orange-50/50 rounded-2xl border-2 border-garden-pink/30 hover:border-garden-pink/60 focus:border-garden-pink focus:outline-none focus:ring-2 focus:ring-garden-pink/20 transition-all font-sans text-amber-950"
            />
          </div>

          <div className="flex gap-2 text-xs flex-wrap justify-start">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm'
                  : 'bg-rose-50/50 border border-garden-pink/30 hover:border-garden-pink text-rose-700'
              }`}
            >
              Tất Cả ({ALL_CHEMICALS_DATA.length})
            </button>
            <button
              onClick={() => setActiveFilter('element')}
              className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                activeFilter === 'element'
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-white shadow-sm'
                  : 'bg-teal-50/40 border border-teal-100 hover:border-teal-300 text-teal-800'
              }`}
            >
              Nguyên Tố ({ALL_CHEMICALS_DATA.filter(i => i.type === 'element').length})
            </button>
            <button
              onClick={() => setActiveFilter('radical')}
              className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                activeFilter === 'radical'
                  ? 'bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow-sm'
                  : 'bg-indigo-50/40 border border-indigo-100 hover:border-indigo-300 text-indigo-800'
              }`}
            >
              Gốc Muối ({ALL_CHEMICALS_DATA.filter(i => i.type === 'radical').length})
            </button>
          </div>
        </div>

        {/* Scalable Container for chemical items list */}
        <div className="bg-white p-5 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow flex-1">
          <h3 className="text-xs font-semibold text-rose-400 mb-3 uppercase tracking-wider font-display">Danh sách tìm thấy ({filteredItems.length})</h3>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-amber-800/40 space-y-2">
              <Info className="w-10 h-10 mx-auto opacity-50" />
              <p className="text-sm">Không tìm thấy vật phẩm nào khớp với tìm kiếm!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[420px] pr-1" id="chemical-grid-cards">
              {filteredItems.map((item, idx) => {
                const isSelected = selectedItem.id === item.id;
                const filterStyles = item.type === 'element' 
                  ? 'bg-teal-50/40 hover:bg-teal-50 border-teal-100 text-teal-950' 
                  : 'bg-indigo-50/40 hover:bg-indigo-50 border-indigo-100 text-indigo-950';
                
                const selectedStyles = item.type === 'element'
                  ? 'ring-2 ring-teal-400 bg-teal-100/50 border-teal-300'
                  : 'ring-2 ring-indigo-400 bg-indigo-100/50 border-indigo-300';
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.02, 0.4) }}
                    onClick={() => handleSelectItem(item)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected ? selectedStyles : filterStyles
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-2xl font-bold font-display tracking-tight">{item.symbol}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.type === 'element' ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {item.valenceText}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-semibold block truncate">{item.name}</span>
                      <span className="text-[9px] text-amber-900/60 block">{item.category}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Selection Details & Poem (5 cols on large screens) */}
      <div className="lg:col-span-5 flex flex-col space-y-4" id="handbook-details-poem">
        {/* Detail Panel */}
        <div className="bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 rounded-3xl border-2 border-garden-pink soft-card-shadow relative overflow-hidden flex-1 flex flex-col justify-between">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-32 h-32 bg-rose-200/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b border-rose-100 pb-3">
              <div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  selectedItem.type === 'element' ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {selectedItem.type === 'element' ? 'Nguyên Tố Hóa Học' : 'Gốc Axit (Gốc Muối)'}
                </span>
                <h3 className="text-2xl font-extrabold font-display text-rose-950 mt-1">{selectedItem.name}</h3>
                <p className="text-xs text-amber-900/60 mt-0.5">{selectedItem.category}</p>
              </div>
              <div className="bg-gradient-to-tr from-pink-400 to-rose-400 text-white w-14 h-14 rounded-2xl flex flex-col justify-center items-center shadow-md rotate-1">
                <span className="text-[10px] uppercase font-bold text-rose-100">Hóa Trị</span>
                <span className="text-lg font-black font-display tracking-wide">{selectedItem.valenceText}</span>
              </div>
            </div>

            {/* Symbol large callout */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-rose-200/50 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-amber-900/50 uppercase font-semibold">Ký hiệu hóa học</p>
                <p className="text-3xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-500 tracking-tight">
                  {selectedItem.symbol}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-amber-900/50 uppercase font-semibold">Hóa trị dạng số</p>
                <div className="flex gap-1 justify-end mt-1">
                  {selectedItem.valences.map(v => (
                    <span key={v} className="bg-purple-100 text-purple-700 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs text-pink-600 font-bold">
                <Info className="w-3.5 h-3.5" />
                <span>Tìm hiểu khoa học</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed bg-white/50 p-3 rounded-xl border border-pink-100/30">
                {selectedItem.description}
              </p>
            </div>

            {/* Mnemonic tip */}
            {selectedItem.chemistryTip && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200 p-4 rounded-2xl space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-amber-700 font-bold">
                  <Sparkles className="w-4.5 h-4.5 text-yellow-500 animate-pulse" />
                  <span>Mẹo nhớ siêu nhanh (Thần chú hóa trị)</span>
                </div>
                <p className="text-xs italic text-amber-900 font-medium">
                  "{selectedItem.chemistryTip}"
                </p>
              </div>
            )}
          </div>

          {/* Cute quote footer */}
          <div className="border-t border-rose-100 pt-3 mt-4 flex items-center space-x-2 text-[10px] text-rose-400 italic">
            <span className="text-base select-none">🍯</span>
            <p>{randomQuote || "Hóa học luôn ngọt ngào như tình bạn của đôi mình vậy!"}</p>
          </div>
        </div>

        {/* "Bài ca hóa trị" Collapsible / Scrollable block */}
        <div className="bg-white p-5 rounded-3xl border-2 border-garden-pink/60 soft-card-shadow flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-purple-600 mb-2">
            <Bookmark className="w-4 h-4" />
            <h4 className="text-sm font-bold font-display">Bí Kíp: Bài Ca Hóa Trị THPT</h4>
          </div>
          <p className="text-[11px] text-amber-900/60 mb-3">Bài thơ dân gian huyền thoại giúp ghi nhớ toàn diện hóa trị các nguyên tố khó nhớ nhất.</p>
          
          <div className="bg-purple-50/50 rounded-2xl p-4 overflow-y-auto max-h-[220px] border border-purple-100 space-y-2">
            {MNEMONIC_PEOM.map((poem, idx) => (
              <div key={idx} className="flex flex-col text-[11px] border-b border-purple-100/30 pb-1.5 last:border-b-0 space-y-0.5">
                <span className="font-bold text-purple-950">✿ {poem.line}</span>
                <span className="text-[10px] text-amber-900/60 ml-3 italic">➔ {poem.comment}</span>
              </div>
            ))}
          </div>

          <div className="text-center text-[10px] text-amber-900/40 mt-2">
            Tip: Học thuộc các câu thơ trên sẽ giúp bạn "vô địch" các màn game tiếp theo!
          </div>
        </div>
      </div>
    </div>
  );
}
