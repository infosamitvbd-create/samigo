import { motion } from 'motion/react';
import { Channel } from '../types';

interface LiveRowProps {
  channels: Channel[];
  onSelect: (channel: Channel) => void;
}

export default function HomeLiveRow({ channels, onSelect }: LiveRowProps) {
  if (channels.length === 0) return null;

  return (
    <div className="py-6">
      <div className="flex items-center gap-2 px-12 mb-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Live TV</h2>
        <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse mt-1" />
      </div>
      
      <div className="flex gap-4 overflow-x-auto px-12 pb-6 no-scrollbar">
        {channels.map((channel, idx) => (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.03 }}
            whileHover={{ scale: 1.05 }}
            className="flex-none w-36 aspect-square bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer shadow-xl relative group"
            onClick={() => onSelect(channel)}
          >
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="flex-1 w-full flex items-center justify-center p-1">
                <img 
                  src={channel.logo} 
                  alt={channel.name}
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[9px] font-black text-white/70 uppercase tracking-tighter text-center leading-none mt-1">
                {channel.name}
              </span>
            </div>
            
            {/* Hover overlay for better feedback */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
