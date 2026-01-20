import React from 'react';
import { MapPin, Calendar, ClipboardList, Send, Flower2, MessageCircle, Users, FolderOpen, MoreHorizontal, Pencil, Ban, Trash2, Layout } from 'lucide-react';
import { ViewState } from './MaterialsDrawer';

interface Props {
  onMaterialsClick: (view?: ViewState) => void;
}

const CourseCardMobile: React.FC<Props> = ({ onMaterialsClick }) => {
  return (
    <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-50 transition-all hover:shadow-md cursor-pointer mb-4">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
           <span className="text-slate-500 text-base font-medium">16:00 - 17:30</span>
           <div className="flex items-center gap-5 text-slate-300">
             <Pencil size={18} className="hover:text-blue-500" />
             <Ban size={18} className="hover:text-red-400" />
             <Trash2 size={18} className="hover:text-red-600" />
           </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="px-2 py-0.5 bg-orange-50 rounded-md">
            <span className="text-[10px] font-bold text-orange-400">待开始</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800">课程计划</h3>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
          <MapPin size={18} className="text-slate-300" />
          <span>家里</span>
        </div>
      </div>

      <div className="border-t border-slate-50 px-6 py-4 flex items-center justify-between">
         <div className="p-1 hover:bg-slate-50 rounded-lg transition-colors">
            <Calendar size={20} className="text-slate-300" />
         </div>
         <div className="p-1 hover:bg-slate-50 rounded-lg transition-colors">
            <ClipboardList size={20} className="text-slate-300" />
         </div>
         <div className="p-1 hover:bg-slate-50 rounded-lg transition-colors">
            <Send size={20} className="text-slate-300" />
         </div>
         <div className="p-1 hover:bg-slate-50 rounded-lg transition-colors">
            <Flower2 size={20} className="text-slate-300" />
         </div>
         <div className="p-1 hover:bg-slate-50 rounded-lg transition-colors">
            <MessageCircle size={20} className="text-slate-300" />
         </div>
         <div className="p-1 hover:bg-slate-50 rounded-lg transition-colors">
            <Users size={20} className="text-slate-300" />
         </div>
         <div 
           onClick={(e) => {
             e.stopPropagation();
             // Direct entry into AI Tutoring for the specific lesson materials
             onMaterialsClick({ 
               title: '第1课：巧解一元一次方程', 
               type: 'ai-tutoring', 
               id: 'l1' 
             });
           }}
           className="p-1.5 bg-slate-50/50 rounded-xl hover:bg-blue-50 transition-colors"
         >
           <FolderOpen size={20} className="text-slate-400" />
         </div>
      </div>
    </div>
  );
};

export default CourseCardMobile;