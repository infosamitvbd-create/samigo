import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Tv, Search } from 'lucide-react';
import { channelService } from '../services/channelService';
import { Channel } from '../types';

interface LiveTVProps {
  onSelect: (channel: Channel) => void;
}

export default function LiveTV({ onSelect }: LiveTVProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    return channelService.subscribeToChannels(setChannels);
  }, []);

  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(channels.map(c => c.category)));

  return (
    <div className="p-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-[#00aeef] font-black text-xs uppercase tracking-[0.3em] mb-2 block">Satellite Stream</span>
          <h2 className="text-6xl font-black uppercase tracking-tighter text-white">Live TV</h2>
        </div>
      </div>

      <div className="space-y-12">
        {categories.map(category => {
          const categoryChannels = filteredChannels.filter(c => c.category === category);
          if (categoryChannels.length === 0) return null;

          return (
            <section key={category} className="space-y-6">
              <div className="px-0">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-1.5 bg-[#00aeef] rounded-full shadow-[0_0_15px_rgba(0,174,239,0.5)]"></div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{category}</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
                {categoryChannels.map((channel, idx) => (
                  <motion.div
                    key={channel.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.02 }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    onClick={() => onSelect(channel)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all group-hover:bg-white/10 group-hover:border-[#00aeef]/50 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-red-600 rounded text-[9px] font-black uppercase tracking-widest text-white z-10">LIVE</div>
                      <div className="w-20 h-20 rounded-xl bg-white/5 overflow-hidden p-3 shadow-inner group-hover:scale-110 transition-transform flex items-center justify-center">
                        <img 
                          src={channel.logo} 
                          alt={channel.name}
                          className="w-full h-full object-contain filter drop-shadow-lg"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-xs font-black text-white/80 text-center uppercase tracking-widest group-hover:text-[#00aeef] transition-colors line-clamp-1 px-2">
                        {channel.name}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#00aeef]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {channels.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-700">
          <Tv size={64} className="mb-4 opacity-10" />
          <p className="text-sm font-black uppercase tracking-widest">No signals found</p>
        </div>
      )}
    </div>
  );
}
