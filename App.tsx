import React, { useState } from 'react';
import MobileNav from './components/MobileNav';
import CourseCardMobile from './components/CourseCardMobile';
import CourseDetail from './components/CourseDetail';
import MaterialsDrawer, { ViewState } from './components/MaterialsDrawer';
import { Search, Filter, ChevronDown, Plus, ChevronLeft, ChevronRight, FolderOpen, ClipboardCheck, MessageSquare, Star, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'detail'>('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [initialView, setInitialView] = useState<ViewState | undefined>(undefined);
  const [notification, setNotification] = useState<string | null>(null);

  const openMaterials = (view?: ViewState) => {
    setInitialView(view);
    setIsDrawerOpen(true);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const quickActions = [
    { id: 'materials', label: '资料', icon: <FolderOpen size={24} />, color: 'text-blue-500', bg: 'bg-blue-50', action: () => openMaterials() },
    { id: 'checkin', label: '签到', icon: <ClipboardCheck size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-50', action: () => showNotification('签到功能即将开放') },
    { id: 'homework', label: '作业', icon: <MessageSquare size={24} />, color: 'text-purple-500', bg: 'bg-purple-50', action: () => showNotification('作业功能即将开放') },
    { id: 'eval', label: '评价', icon: <Star size={24} />, color: 'text-orange-500', bg: 'bg-orange-50', action: () => showNotification('评价功能即将开放') },
  ];

  return (
    <div className="flex justify-center bg-slate-100 min-h-screen">
      {/* Mobile Container Emulation */}
      <div className="w-full max-w-[450px] bg-[#F7F9FC] min-h-screen shadow-2xl flex flex-col relative overflow-hidden">
        
        {notification && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/90 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-300">
            <CheckCircle2 size={18} className="text-blue-400" />
            <span className="text-sm font-bold tracking-tight">{notification}</span>
          </div>
        )}

        {currentPage === 'dashboard' ? (
          <div className="flex-1 flex flex-col pb-24">
            {/* Header */}
            <div className="px-5 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1 cursor-pointer">
                  <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px]">👤</span>
                  </div>
                  <span className="text-base font-bold text-slate-800">陈廷凯教育空间</span>
                  <ChevronDown size={16} className="text-slate-500" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src="https://picsum.photos/seed/teacher/80/80" className="w-8 h-8 rounded-full border border-white shadow-sm" />
                  </div>
                  <div className="flex gap-1 text-slate-400">
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                  </div>
                  <ChevronRight size={20} className="text-slate-400 ml-1" />
                </div>
              </div>

              {/* Main Tabs */}
              <div className="flex items-center gap-6 mb-6 overflow-x-auto no-scrollbar">
                {['课程管理', '商品管理', '成员管理', '奖励管理'].map((tab, idx) => (
                  <div key={tab} className="relative flex-shrink-0">
                    <span className={`text-lg font-bold ${idx === 0 ? 'text-slate-800' : 'text-slate-300'}`}>
                      {tab}
                    </span>
                    {idx === 0 && <div className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-500 rounded-full"></div>}
                  </div>
                ))}
              </div>

              {/* Toggle Buttons */}
              <div className="flex p-1 bg-white rounded-xl border border-slate-100 mb-6 shadow-sm">
                <button className="flex-1 py-2 text-sm font-bold text-blue-600 bg-blue-50/50 rounded-lg">课程履约</button>
                <button className="flex-1 py-2 text-sm font-bold text-slate-400">全部课程</button>
              </div>

              {/* Quick Actions Entrance */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {quickActions.map((action) => (
                  <button 
                    key={action.id}
                    onClick={action.action}
                    className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
                  >
                    <div className={`w-14 h-14 ${action.bg} ${action.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                      {action.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-600">{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="搜索" 
                    className="w-full bg-white border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm shadow-sm focus:ring-4 ring-blue-500/5 transition-all" 
                  />
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-300" />
                </div>
                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-50">
                  <Filter className="text-slate-400" size={18} />
                </div>
              </div>

              {/* Calendar Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">2026年01月20日</h3>
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">今</div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-4 px-2 uppercase tracking-widest">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
                <div className="flex justify-between items-center relative px-1">
                  {[18, 19, 20, 21, 22, 23, 24].map(day => (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-2xl text-base font-black transition-all ${day === 20 ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/30' : 'text-slate-800 hover:bg-white hover:shadow-sm'}`}>
                        {day}
                      </div>
                      <div className={`w-1 h-1 rounded-full ${day >= 19 && day <= 23 ? 'bg-blue-400' : 'bg-transparent'}`}></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-2">
                   <ChevronDown size={20} className="text-slate-200" />
                </div>
              </div>

              {/* Course Card List */}
              <div className="space-y-4">
                <div onClick={() => setCurrentPage('detail')}>
                  <CourseCardMobile onMaterialsClick={(view) => openMaterials(view)} />
                </div>
                <button className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[24px] bg-white/50 text-slate-500 flex items-center justify-center gap-2 text-sm font-black hover:bg-white transition-all shadow-sm">
                  <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center text-xs text-blue-500">+</div>
                  创建教学计划
                </button>
              </div>
            </div>
          </div>
        ) : (
          <CourseDetail onBack={() => setCurrentPage('dashboard')} onMaterialsClick={() => openMaterials()} />
        )}

        {/* Floating Action Button */}
        {currentPage === 'dashboard' && (
          <button className="fixed bottom-28 right-[calc(50%-180px)] w-14 h-14 bg-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-10">
            <Plus size={32} />
          </button>
        )}

        {/* Navigation Bar */}
        <MobileNav activeTab={currentPage === 'dashboard' ? 'workplace' : 'none'} />

        {/* Materials Drawer */}
        <MaterialsDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          initialView={initialView}
        />
      </div>
    </div>
  );
};

export default App;