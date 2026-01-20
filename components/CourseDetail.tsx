import React from 'react';
import { ChevronLeft, X, Sparkles, Send, Star, UserCircle2, CheckCircle2, ClipboardCheck, MessageSquare, List } from 'lucide-react';

interface Props {
  onBack: () => void;
  onMaterialsClick: () => void;
}

const CourseDetail: React.FC<Props> = ({ onBack, onMaterialsClick }) => {
  return (
    <div className="flex-1 flex flex-col bg-[#F7F9FC]">
      {/* Header */}
      <div className="px-4 h-14 bg-white flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <List size={20} className="text-slate-800" />
          <span className="text-blue-600 font-black text-xl tracking-tighter">VVAI</span>
        </div>
        <h2 className="text-base font-bold text-slate-800">课程履约</h2>
        <X size={24} className="text-slate-400 cursor-pointer" onClick={onBack} />
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-40">
        {/* Robot/Bot Icon */}
        <div className="flex items-start mb-6">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center p-1.5 shadow-sm">
             <img src="https://picsum.photos/seed/ai-vivi/100/100" className="w-full h-full object-cover rounded-lg" />
           </div>
        </div>

        {/* Learning Evaluation Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-50 mb-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-slate-800">学习评价</h3>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-12 bg-blue-500 text-white rounded-[14px] flex items-center justify-center font-bold text-sm mb-3">
              大宝
            </div>
            <span className="text-lg font-bold text-slate-800 mb-6">大宝</span>

            <span className="text-slate-600 text-base mb-4">暂无评价</span>
            
            <div className="flex gap-2 mb-10">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={40} fill="#E2E8F0" stroke="none" className="transition-colors hover:fill-yellow-400" />
              ))}
            </div>

            <button className="w-full py-4 border border-dashed border-slate-200 rounded-2xl bg-[#FDFDFF] text-blue-500 flex items-center justify-center gap-2 text-sm font-bold hover:bg-white transition-all">
              <span className="text-xl">+</span> 添加评语
            </button>
          </div>
        </div>
      </div>

      {/* Footer Chat & Actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] p-5 pb-10 bg-white/60 backdrop-blur-xl border-t border-slate-100 z-30">
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
           <button className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-slate-100 rounded-full text-slate-700 text-xs font-bold shadow-sm whitespace-nowrap">
             <Star size={14} className="text-slate-400" /> 评价
           </button>
           <button className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-slate-100 rounded-full text-slate-700 text-xs font-bold shadow-sm whitespace-nowrap">
             <ClipboardCheck size={14} className="text-slate-400" /> 签到
           </button>
           <button 
             onClick={onMaterialsClick}
             className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-slate-100 rounded-full text-slate-700 text-xs font-bold shadow-sm whitespace-nowrap"
           >
             <MessageSquare size={14} className="text-slate-400" /> 作业
           </button>
        </div>
        
        <div className="flex items-center bg-[#F7F9FC] border border-slate-100 rounded-full pl-5 pr-1.5 py-1.5 group focus-within:bg-white focus-within:ring-4 ring-blue-500/5 transition-all shadow-inner">
          <input type="text" placeholder="我可以帮您做什么？" className="flex-1 bg-transparent border-none text-base outline-none placeholder:text-slate-400 py-1.5" />
          <button className="p-2.5 bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors">
            <Send size={18} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;