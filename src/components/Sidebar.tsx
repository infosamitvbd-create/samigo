import { 
  Home, 
  Film, 
  Tv, 
  MonitorPlay, 
  ShieldCheck, 
  LogOut, 
  LogIn,
  Menu,
  X,
  Search,
  Heart,
  LayoutGrid,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  user: any;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isAdmin, 
  onLogin, 
  onLogout,
  user 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const menuItems = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'home', label: 'Home', icon: Home },
    { id: 'live', label: 'Live TV', icon: Tv },
    { id: 'natok', label: 'Natok', icon: MonitorPlay },
    { id: 'movies', label: 'Browse', icon: LayoutGrid },
    { id: 'series', label: 'Categories', icon: Layers },
    { id: 'favorite', label: 'My List', icon: Heart },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck });
  } else {
    menuItems.push({ id: 'settings', label: 'Settings', icon: Menu });
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '240px' }}
      className="h-screen bg-[#010206] border-r border-white/5 flex flex-col fixed left-0 top-0 z-50 overflow-hidden"
    >
      <div className="p-6 flex flex-col items-center">
        <div className="w-12 h-12 relative group cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLC-6IOFHBEhyphenhyphenMtCMtBFr-pTtDrvDsYxMxjTzyt_iv12nSBSG-ojHGB-1zApY7JKLCWHqHw7x3fN_NILmdknHvGD8vreW2_Xj9y95_4WLxG3lKK3q8GqReEm_tT5t5yaufIEZ67LWZz-ltmh3kcTRQiM39zdTRdTW8qf9q01ShfF4hzNeGeEGW_Mq6j8bh/s1064/AKASH_name_ta_Remove_kore_202605101819.jpeg" 
            alt="SAMI GO Logo" 
            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-transform group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <nav className="flex-1 flex flex-col items-center py-4 gap-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "relative flex flex-col items-center gap-1 transition-all duration-300 group",
              activeTab === item.id ? "text-[#3b82f6]" : "text-white/40 hover:text-white"
            )}
          >
            <item.icon size={24} className={cn(
              "transition-transform group-hover:scale-110",
              activeTab === item.id && "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            )} />
            {!isCollapsed ? (
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
            ) : (
              <div className="absolute left-full ml-4 px-3 py-1 bg-[#1a1a2e] text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/5 uppercase tracking-widest">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-white/5 flex flex-col items-center gap-4">
        {user ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full p-0.5 overflow-hidden transition-transform hover:scale-110">
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=00aeef&color=fff`} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {!isCollapsed && (
              <button
                onClick={onLogout}
                className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400"
              >
                Logout
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-[#3b82f6] hover:bg-white/10 transition-all"
          >
            <LogIn size={20} />
          </button>
        )}
      </div>
    </motion.aside>
  );
}
