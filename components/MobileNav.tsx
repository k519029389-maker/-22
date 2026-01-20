import React from 'react';
import { MessageSquare, LayoutGrid, Users, User, Sparkles } from 'lucide-react';

interface Props {
  activeTab: string;
}

const MobileNav: React.FC<Props> = ({ activeTab }) => {
  const tabs = [
    { id: 'message', label: '消息', icon: <MessageSquare size={24} /> },
    { id: 'workplace', label: '工作台', icon: <LayoutGrid size={24} /> },
    { id: 'ai', label: 'AI', icon: null, isAi: true },
    { id: 'contacts', label: '通讯录', icon: <Users size={24} /> },
    { id: 'me', label: '我的', icon: <User size={24} />, badge: 1 },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-around h-20 px-2 z-40">
      {tabs.map((tab) => (
        <div 
          key={tab.id} 
          className={`flex flex-col items-center justify-center cursor-pointer transition-colors relative ${tab.isAi ? '-mt-10' : ''}`}
        >
          {tab.isAi ? (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-16 h-16 bg-white rounded-full p-1 shadow-lg overflow-hidden border-2 border-slate-50 flex items-center justify-center">
                 <img src="https://picsum.photos/seed/ai-vivi/100/100" className="w-full h-full object-cover rounded-full" />
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-blue-500 text-[8px] text-white px-2 py-0.5 rounded-full font-bold">AI</div>
              </div>
            </div>
          ) : (
            <>
              <div className={`${activeTab === tab.id ? 'text-blue-500' : 'text-slate-400'} mb-1`}>
                {tab.icon}
                {tab.badge && (
                  <div className="absolute top-0 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                    {tab.badge}
                  </div>
                )}
              </div>
              <span className={`text-[10px] ${activeTab === tab.id ? 'text-blue-500 font-bold' : 'text-slate-500'}`}>
                {tab.label}
              </span>
            </>
          )}
        </div>
      ))}
    </nav>
  );
};

export default MobileNav;