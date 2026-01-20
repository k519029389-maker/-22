import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, Search, Plus, ChevronRight, FileText, Play, Music, 
  BookOpen, Folder, Layout, Sparkles, Send, 
  Filter, FileType2, Presentation, FileEdit, Clock,
  ChevronDown, Cloud, HardDrive, List, Calendar as CalendarIcon,
  ChevronLeft, Image as ImageIcon, FileQuestion, Zap,
  Wand2, Upload, BrainCircuit, MessageSquare, CheckCircle2,
  ChevronUp, FolderPlus, MoreVertical, ChevronRight as ChevronRightIcon,
  Home, User, Bookmark, ExternalLink, Download, Bot, Lightbulb, GraduationCap, Eye, Check, Info
} from 'lucide-react';
import { MaterialItem, TeachingFolder, MaterialCategory } from '../types';

export type ViewState = {
  title: string;
  type: 'courses' | 'lessons' | 'files' | 'categories' | 'ai-tutoring';
  id?: string;
  meta?: any;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialView?: ViewState;
}

// Netdisk style item structure
interface ExplorerItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: MaterialCategory;
  size?: string;
  date: string;
  children?: ExplorerItem[];
}

const initialMineMaterials: ExplorerItem[] = [
  {
    id: 'm-f1', name: '我的收藏', type: 'folder', date: '2024-11-12',
    children: [
      { id: 'm-f1-1', name: '奥数竞赛重点.pptx', type: 'file', fileType: 'PPT', size: '8.2 MB', date: '2024-11-12' },
    ]
  },
  { id: 'm-file1', name: '个人错题集.pdf', type: 'file', fileType: 'TestPaper', size: '15.2 MB', date: '2024-11-10' },
  { id: 'm-file2', name: '英语听力练习.mp3', type: 'file', fileType: 'Audio', size: '4.5 MB', date: '2024-11-09' },
];

const disciplines = [
  { id: 'd1', name: '数学', icon: 'H' },
  { id: 'd2', name: '语文', icon: '语' },
  { id: 'd3', name: '英语', icon: '英' },
  { id: 'd4', name: '物理', icon: '物' },
];

const mineCourses: Record<string, TeachingFolder[]> = {
  'd1': [
    { id: 'mc1', name: '大宝的奥数特训班', count: 12, type: 'course' },
    { id: 'mc2', name: '数学提优小班', count: 8, type: 'course' },
  ],
  'd2': [
    { id: 'mc3', name: '语文作文提升课', count: 15, type: 'course' },
  ]
};

const lessons: Record<string, TeachingFolder[]> = {
  'mc1': [
    { id: 'l1', name: '第1课：函数单调性', count: 6, type: 'lesson' },
    { id: 'l2', name: '第2课：几何图形的平移', count: 4, type: 'lesson' },
  ]
};

const lessonMaterials: Record<string, (MaterialItem & { label: string })[]> = {
  'l1': [
    { id: 'm1', title: '01.函数单调性精讲课件.pptx', date: '2024-11-01', size: '4.2MB', type: 'PPT', label: '演示课件' },
    { id: 'm2', title: '核心考点梳理讲义.pdf', date: '2024-11-01', size: '1.8MB', type: 'Word', label: '核心讲义' },
    { id: 'm3', title: '课堂实录：判定定理推导.mp4', date: '2024-11-05', size: '128.5MB', type: 'Video', label: '课堂回放' },
  ]
};

type Message = {
  id: string;
  role: 'assistant' | 'user' | 'system-card';
  content: string;
  materials?: (MaterialItem & { label: string })[];
};

const MaterialsDrawer: React.FC<Props> = ({ isOpen, onClose, initialView }) => {
  const [mineCategory, setMineCategory] = useState<'personal' | 'courses'>('courses');
  const [selectedDiscipline, setSelectedDiscipline] = useState(disciplines[0].id);
  const [notification, setNotification] = useState<string | null>(null);
  
  const [mineFiles, setMineFiles] = useState<ExplorerItem[]>(initialMineMaterials);
  const [mineNavPath, setMineNavPath] = useState<ExplorerItem[]>([]);

  const [viewStack, setViewStack] = useState<ViewState[]>([]);
  const [tutoringMessages, setTutoringMessages] = useState<Message[]>([]);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<Set<string>>(new Set());
  const [inputValue, setInputValue] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialView) {
        setViewStack([initialView]);
        if (initialView.type === 'ai-tutoring') {
          initTutoringMode(initialView.id || 'l1', initialView.title);
        }
      } else {
        setViewStack([]);
      }
    }
  }, [isOpen, initialView]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tutoringMessages]);

  const initTutoringMode = (lessonId: string, lessonTitle: string) => {
    const materials = lessonMaterials[lessonId] || lessonMaterials['l1'];
    setSelectedMaterialIds(new Set(materials.map(m => m.id)));
    
    setTutoringMessages([
      { 
        id: 'init-greet', 
        role: 'assistant', 
        content: `同学你好！我是你的 AI 伴学助手。👋\n\n我已经为你整理好了《${lessonTitle}》的全部教学资料。我们是针对全部资料进行深度研读，还是你先选几份感兴趣的开始互动提问？` 
      },
      { 
        id: 'init-card', 
        role: 'system-card', 
        content: '本节课核心资料包',
        materials: materials
      }
    ]);
  };

  const isSubPanel = viewStack.length > 0;
  const currentView = isSubPanel ? viewStack[viewStack.length - 1] : null;

  const pushView = (view: ViewState) => {
    setViewStack([...viewStack, view]);
    if (view.type === 'ai-tutoring') {
      initTutoringMode(view.id || 'l1', view.title);
    }
  };

  const popView = () => setViewStack(viewStack.slice(0, -1));
  const resetStack = () => {
    setViewStack([]);
    setMineNavPath([]);
  };

  const handleMineCategoryChange = (cat: 'personal' | 'courses') => {
    setMineCategory(cat);
    resetStack();
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const toggleMaterialSelection = (id: string) => {
    const newSelected = new Set(selectedMaterialIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedMaterialIds(newSelected);
  };

  const handleStartStudy = () => {
    if (selectedMaterialIds.size === 0) {
      showNotification('请至少选择一份资料进行研读');
      return;
    }
    handleSendMessage('立即开始深度研读');
  };

  const handleSendMessage = (text?: string) => {
    const messageContent = text || inputValue;
    if (!messageContent.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: messageContent };
    setTutoringMessages(prev => [...prev, userMsg]);
    setInputValue('');
    
    setTimeout(() => {
      const selectedCount = selectedMaterialIds.size;
      const responses: Record<string, string> = {
        '立即开始深度研读': `太棒了！我已经准备好和你一起研读这 ${selectedCount} 份资料。我们可以从“函数单调性的定义”开始，或者你对课件中的哪一部分有疑问？`,
        '总结本课资料': `针对你选中的资料，我为你梳理了一下核心内容：本课主要涵盖了函数单调性的基本定义、图像表现以及判定方法。其中最关键的是理解“随自变量增大而增大”的数学表达。`,
        '核心难点串讲': `函数单调性的证明是这一章的难点。特别是利用定义证明时，四个步骤：取值、作差、变形、定号，缺一不可。`,
      };

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: responses[messageContent] || `关于你的提问，这部分的重点在于理解函数的变化趋势。建议你结合视频回放的第 15 分钟来看判定定理的推导过程。` 
      };
      setTutoringMessages(prev => [...prev, aiMsg]);
    }, 800);
  };

  const getTypeStyle = (type: MaterialCategory | 'folder') => {
    if (type === 'folder') return { bg: 'bg-blue-50', text: 'text-blue-500', icon: <Folder size={20} /> };
    switch (type) {
      case 'PPT': return { bg: 'bg-orange-50', text: 'text-orange-500', icon: <Presentation size={20} /> };
      case 'Word': return { bg: 'bg-blue-50', text: 'text-blue-500', icon: <FileText size={20} /> };
      case 'TestPaper': return { bg: 'bg-purple-50', text: 'text-purple-500', icon: <FileType2 size={20} /> };
      case 'Homework': return { bg: 'bg-green-50', text: 'text-green-500', icon: <FileEdit size={20} /> };
      case 'Video': return { bg: 'bg-indigo-50', text: 'text-indigo-500', icon: <Play size={20} /> };
      case 'Audio': return { bg: 'bg-teal-50', text: 'text-teal-500', icon: <Music size={20} /> };
      case 'Image': return { bg: 'bg-pink-50', text: 'text-pink-500', icon: <ImageIcon size={20} /> };
      case 'Other': return { bg: 'bg-slate-50', text: 'text-slate-500', icon: <FileQuestion size={20} /> };
      default: return { bg: 'bg-slate-50', text: 'text-slate-500', icon: <FileText size={20} /> };
    }
  };

  const findInTree = (nodes: ExplorerItem[], targetId: string): ExplorerItem | null => {
    for (const node of nodes) {
      if (node.id === targetId) return node;
      if (node.children) {
        const found = findInTree(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const currentMineFiles = useMemo(() => {
    if (mineNavPath.length === 0) return mineFiles;
    const currentFolder = findInTree(mineFiles, mineNavPath[mineNavPath.length - 1].id);
    return currentFolder?.children || [];
  }, [mineNavPath, mineFiles]);

  const navigateToFolder = (item: ExplorerItem) => {
    setMineNavPath([...mineNavPath, item]);
  };

  const jumpToBreadcrumb = (index: number) => {
    if (index === -1) setMineNavPath([]);
    else setMineNavPath(mineNavPath.slice(0, index + 1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose}></div>
      
      {notification && (
        <div className="fixed top-6 right-6 z-[110] bg-slate-900 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top fade-in duration-300">
          <CheckCircle2 size={16} className="text-green-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      <div className={`relative w-full max-w-[450px] h-full bg-[#F7F9FC] shadow-2xl flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-hidden`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {isSubPanel ? (
              <button onClick={popView} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <ChevronLeft size={20} />
              </button>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl">
                <BookOpen size={20} />
              </div>
            )}
            <div>
              <h2 className="text-lg font-black text-slate-800 leading-tight">
                {currentView?.type === 'ai-tutoring' ? 'AI 智能辅导' : '我的资料'}
              </h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                {currentView?.type === 'ai-tutoring' ? 'AI Tutoring Mode' : 'My Materials'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Tabs Hidden in Tutoring Mode */}
        {!isSubPanel && (
          <div className="px-4 pt-4 bg-white z-10 border-b border-slate-100">
            <div className="flex items-center gap-8 pb-2 text-sm font-black">
              <button 
                onClick={() => handleMineCategoryChange('courses')} 
                className={`flex items-center gap-1.5 pb-2 transition-all relative ${mineCategory === 'courses' ? 'text-blue-600' : 'text-slate-400'}`}
              >
                我的课程资料 {mineCategory === 'courses' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"></div>}
              </button>
              <button 
                onClick={() => handleMineCategoryChange('personal')} 
                className={`flex items-center gap-1.5 pb-2 transition-all relative ${mineCategory === 'personal' ? 'text-blue-600' : 'text-slate-400'}`}
              >
                个人资料 {mineCategory === 'personal' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"></div>}
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden relative">
          {!isSubPanel && mineCategory === 'courses' && (
            <div className="w-16 bg-white border-r border-slate-100 flex flex-col items-center py-4 gap-5 overflow-y-auto no-scrollbar">
              {disciplines.map(d => (
                <button key={d.id} onClick={() => { setSelectedDiscipline(d.id); resetStack(); }} className="flex flex-col items-center gap-1 w-full">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-[14px] transition-all shadow-sm ${selectedDiscipline === d.id ? 'bg-blue-500 text-white' : 'bg-[#F7F9FC] text-slate-400'}`}>
                    <span className="text-xs font-black">{d.icon}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 flex flex-col min-w-0">
            {currentView?.type !== 'ai-tutoring' && (
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input type="text" placeholder="搜索资源..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-2xl text-xs outline-none focus:ring-4 ring-blue-500/5 shadow-sm" />
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-300" />
                  </div>
                </div>

                {!isSubPanel && mineCategory === 'personal' && (
                  <div className="flex items-center gap-1 text-[10px] overflow-hidden whitespace-nowrap px-1">
                    <button onClick={() => jumpToBreadcrumb(-1)} className="p-1 text-slate-400 font-bold hover:text-blue-600 flex items-center gap-1">
                      <User size={12} /> 全部
                    </button>
                    {mineNavPath.map((folder, idx) => (
                      <React.Fragment key={folder.id}>
                        <ChevronRightIcon size={10} className="text-slate-300" />
                        <button onClick={() => jumpToBreadcrumb(idx)} className={`px-1 py-0.5 rounded truncate max-w-[80px] ${idx === mineNavPath.length - 1 ? 'text-slate-800 font-black' : 'text-slate-400'}`}>
                          {folder.name}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={`flex-1 overflow-y-auto ${currentView?.type === 'ai-tutoring' ? 'p-0 bg-[#F7F9FC]' : 'p-4 pb-24'}`}>
              {isSubPanel ? (
                <div className="h-full flex flex-col">
                  {currentView?.type === 'lessons' && (
                    <div className="space-y-3 p-4">
                      {(lessons[currentView?.id || ''] || []).map(lesson => (
                        <div key={lesson.id} onClick={() => pushView({ title: lesson.name, type: 'files', id: lesson.id })} className="flex items-center gap-4 p-5 bg-white border border-slate-50 rounded-[24px] cursor-pointer shadow-sm">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                             <Folder size={20} className="fill-current" />
                          </div>
                          <div className="flex-1 truncate text-sm font-bold text-slate-800">{lesson.name}</div>
                          <ChevronRight size={18} className="text-slate-200" />
                        </div>
                      ))}
                    </div>
                  )}
                  {currentView?.type === 'files' && (
                    <div className="space-y-4 p-4">
                      {/* AI Tutoring Entrance */}
                      <div 
                        onClick={() => pushView({ title: currentView?.title || 'AI 辅导', type: 'ai-tutoring', id: currentView?.id })}
                        className="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[28px] shadow-lg shadow-blue-500/20 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all border border-blue-400/20"
                      >
                         <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                           <Bot size={28} />
                         </div>
                         <div className="flex-1">
                           <h4 className="text-white font-black text-sm mb-0.5">进入 AI 答疑辅导模式</h4>
                           <p className="text-blue-100 text-[10px] font-bold">针对本课时资料进行深度互动学习</p>
                         </div>
                         <ChevronRight size={20} className="text-white/60" />
                      </div>

                      <div className="space-y-3">
                        {(lessonMaterials[currentView?.id || 'l1'] || []).map(material => {
                          const style = getTypeStyle(material.type);
                          return (
                            <div key={material.id} className="flex items-center gap-4 p-4 bg-white border border-slate-50 rounded-[24px] shadow-sm">
                              <div className={`w-10 h-10 ${style.bg} ${style.text} rounded-xl flex items-center justify-center flex-shrink-0`}>{style.icon}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate">{material.title}</p>
                                <p className="text-[10px] text-slate-400">{material.size} • {material.date}</p>
                              </div>
                              <div className="flex gap-1">
                                 <button onClick={() => showNotification('已开始预览')} className="p-2 text-blue-600 bg-blue-50 rounded-xl"><ExternalLink size={16} /></button>
                                 <button onClick={() => showNotification('已收藏')} className="p-2 text-orange-500 bg-orange-50 rounded-xl"><Bookmark size={16} /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {currentView?.type === 'ai-tutoring' && (
                    <div className="flex flex-col h-full relative">
                      {/* Tutoring Content */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-40">
                         {tutoringMessages.map((msg) => {
                           if (msg.role === 'system-card') {
                             return (
                               <div key={msg.id} className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-blue-100 text-blue-500 flex items-center justify-center shadow-sm">
                                      <Bot size={18} />
                                    </div>
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">EDUSPACE AI</span>
                                  </div>

                                  <div className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-blue-500/5 border border-blue-50">
                                    {/* Card Header */}
                                    <div className="px-5 py-4 bg-blue-50/30 flex items-center justify-between border-b border-blue-100/30">
                                      <div className="flex items-center gap-2">
                                        <Info size={16} className="text-blue-500" />
                                        <span className="text-sm font-black text-blue-900">{msg.content}</span>
                                      </div>
                                      <div className="bg-white text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">已同步</div>
                                    </div>

                                    {/* Card Body - Materials List */}
                                    <div className="p-4 space-y-3">
                                      {msg.materials?.map(material => {
                                        const style = getTypeStyle(material.type);
                                        const isSelected = selectedMaterialIds.has(material.id);
                                        return (
                                          <div 
                                            key={material.id}
                                            onClick={() => toggleMaterialSelection(material.id)}
                                            className={`group flex items-center gap-4 p-4 rounded-[22px] border transition-all cursor-pointer ${isSelected ? 'bg-blue-50/40 border-blue-100' : 'bg-white border-slate-100'}`}
                                          >
                                             <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-slate-200 text-transparent'}`}>
                                               <Check size={12} strokeWidth={4} />
                                             </div>
                                             <div className={`w-10 h-10 ${style.bg} ${style.text} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-active:scale-95`}>
                                               {style.icon}
                                             </div>
                                             <div className="flex-1 min-w-0">
                                               <h4 className="text-sm font-black text-slate-800 truncate">{material.title}</h4>
                                               <div className="flex items-center gap-2 mt-0.5">
                                                 <span className="text-[10px] text-slate-400 font-bold">{material.size}</span>
                                                 <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[8px] font-black">{material.label}</span>
                                               </div>
                                             </div>
                                             <button 
                                              onClick={(e) => { e.stopPropagation(); showNotification('文件已加入下载队列'); }} 
                                              className="p-2 text-slate-300 hover:text-blue-500"
                                             >
                                               <Download size={18} />
                                             </button>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* Card Footer - Action Button */}
                                    <div className="px-4 pb-4">
                                      <button 
                                        onClick={handleStartStudy}
                                        className="w-full h-14 bg-blue-600 text-white rounded-[20px] font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all hover:bg-blue-700"
                                      >
                                        <MessageSquare size={20} />
                                        立即开始深度研读
                                      </button>
                                    </div>
                                  </div>
                               </div>
                             );
                           }

                           return (
                             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                               <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                 <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-white border border-blue-100 text-blue-500'}`}>
                                   {msg.role === 'user' ? <User size={16} /> : <Bot size={18} />}
                                 </div>
                                 <div className={`px-5 py-4 rounded-[28px] text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white font-bold rounded-tr-none' : 'bg-white text-slate-800 font-medium rounded-tl-none border border-slate-100'}`}>
                                   {msg.content.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
                                 </div>
                               </div>
                             </div>
                           );
                         })}
                         <div ref={chatEndRef} />
                      </div>

                      {/* Input & Suggested Chips */}
                      <div className="p-5 bg-white border-t border-slate-100 z-10 shadow-2xl pb-10">
                        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                           {[
                             { label: '总结本课资料', icon: <Lightbulb size={12} /> },
                             { label: '核心难点串讲', icon: <BrainCircuit size={12} /> },
                             { label: '针对性练习建议', icon: <GraduationCap size={12} /> }
                           ].map((chip, idx) => (
                             <button 
                                key={idx}
                                onClick={() => handleSendMessage(chip.label)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-600 shadow-sm whitespace-nowrap active:scale-95 transition-all hover:bg-white hover:border-blue-200"
                             >
                               {chip.icon}
                               {chip.label}
                             </button>
                           ))}
                        </div>
                        <div className="flex items-center bg-[#F7F9FC] border border-slate-100 rounded-2xl pl-4 pr-1.5 py-1.5 group focus-within:bg-white focus-within:ring-4 ring-blue-500/5 transition-all">
                          <Sparkles className="text-blue-500 w-4 h-4 mr-2" />
                          <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="在这里问任何关于资料的问题..." 
                            className="flex-1 bg-transparent border-none text-sm font-bold outline-none placeholder:text-slate-300 py-2" 
                          />
                          <button 
                            onClick={() => handleSendMessage()}
                            className="p-2.5 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 active:scale-90 transition-transform hover:bg-blue-600"
                          >
                            <Send size={18} fill="currentColor" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {mineCategory === 'personal' && (
                    <div className="flex flex-col gap-3">
                      {currentMineFiles.map(item => {
                        const style = getTypeStyle(item.type === 'folder' ? 'folder' : item.fileType || 'Other');
                        return (
                          <div 
                            key={item.id} 
                            onClick={() => item.type === 'folder' ? navigateToFolder(item) : null} 
                            className={`flex items-center gap-4 p-5 bg-white border border-slate-50 rounded-[24px] shadow-sm group ${item.type === 'folder' ? 'cursor-pointer' : ''}`}
                          >
                            <div className={`w-11 h-11 ${style.bg} ${style.text} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-active:scale-95`}>
                              {item.type === 'folder' ? <Folder size={24} className="fill-current" /> : style.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-bold truncate ${item.type === 'folder' ? 'text-slate-800' : 'text-slate-700'}`}>{item.name}</h4>
                              <div className="text-[10px] text-slate-400 mt-1">{item.date} {item.size ? `• ${item.size}` : ''}</div>
                            </div>
                            {item.type === 'file' ? (
                               <button className="text-slate-300 hover:text-blue-500"><Download size={18} /></button>
                            ) : (
                               <ChevronRight size={18} className="text-slate-200" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {mineCategory === 'courses' && (
                    <div className="grid grid-cols-1 gap-4">
                      {(mineCourses[selectedDiscipline] || []).map(course => (
                        <div key={course.id} onClick={() => pushView({ title: course.name, type: 'lessons', id: course.id })} className="p-6 bg-white border border-slate-50 rounded-[32px] cursor-pointer shadow-sm hover:ring-2 ring-blue-500/5 transition-all flex flex-col items-start">
                          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
                             <Folder size={28} className="fill-current" />
                          </div>
                          <h4 className="text-base font-black text-slate-800 truncate mb-1">{course.name}</h4>
                          <p className="text-xs font-bold text-slate-400">{course.count} 个学习资源</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer Search */}
        {!isSubPanel && (
          <div className="p-5 bg-white border-t border-slate-100 pb-10">
            <div className="flex items-center bg-[#F7F9FC] border border-slate-100 rounded-full px-5 py-2.5 shadow-inner">
              <Sparkles className="text-blue-500 w-4 h-4 mr-2" />
              <input type="text" placeholder="搜索我的全部资料..." className="flex-1 bg-transparent border-none text-xs font-bold outline-none placeholder:text-slate-300" />
              <button className="p-2 bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/20">
                <Send size={14} fill="currentColor" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsDrawer;