
import React from 'react';
import { 
  Menu, 
  Plus, 
  Diamond, 
  Settings, 
  HelpCircle, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onNewChat }) => {
  return (
    <aside 
      className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out bg-[#1e1f20] border-r border-[#333] ${
        isOpen ? 'w-72' : 'w-0 lg:w-20'
      } overflow-hidden`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Top Header */}
        <div className="flex items-center mb-8 h-10 px-2">
          <button 
            onClick={onToggle}
            className="p-2 hover:bg-[#333] rounded-full text-gray-400 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* New Chat Button */}
        <button 
          onClick={onNewChat}
          className={`flex items-center gap-3 bg-[#333] hover:bg-[#444] text-gray-300 p-3 rounded-full transition-all group overflow-hidden ${
            isOpen ? 'px-4' : 'px-3 w-12'
          }`}
        >
          <Plus size={24} className="min-w-[24px]" />
          <span className={`whitespace-nowrap font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            New Chat
          </span>
        </button>

        {/* Gems Section */}
        <div className="mt-8">
          <div className={`flex items-center justify-between text-xs font-semibold text-gray-500 mb-2 px-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <span>Gems</span>
            <ChevronRight size={14} />
          </div>
          <div className="space-y-1">
            <SidebarItem 
              icon={<Diamond size={20} className="text-purple-400" />} 
              label="Gemini Advanced" 
              isOpen={isOpen} 
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto space-y-1">
          <SidebarItem 
            icon={<HelpCircle size={20} />} 
            label="Help" 
            isOpen={isOpen} 
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            isOpen={isOpen} 
          />
        </div>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isOpen, active }) => {
  return (
    <button 
      className={`flex items-center gap-4 w-full p-3 rounded-full transition-all text-gray-300 hover:bg-[#333] ${
        active ? 'bg-[#333]' : ''
      } group`}
    >
      <div className="min-w-[24px] flex justify-center">
        {icon}
      </div>
      <span className={`whitespace-nowrap transition-opacity text-sm font-medium ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
    </button>
  );
};

export default Sidebar;
