import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { Movie } from '../types';

interface ContentRowProps {
  title: string;
  items: Movie[];
  onSelect: (item: Movie) => void;
}

export default function ContentRow({ title, items, onSelect }: ContentRowProps) {
  if (items.length === 0) return null;

  return (
    <div className="py-6">
      <div className="flex items-center justify-between px-12 mb-4">
        <h2 className="text-sm font-black tracking-[0.2em] uppercase text-white/90 flex items-center gap-2">
          {title}
        </h2>
        <span className="text-[#00aeef] text-[10px] font-black cursor-pointer hover:underline uppercase tracking-widest">
          View All
        </span>
      </div>
      
      <div className="relative group/row">
        <div className="flex gap-4 overflow-x-auto px-12 pb-6 scroll-smooth no-scrollbar">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="flex-none w-[320px] aspect-video relative rounded-xl overflow-hidden cursor-pointer group shadow-2xl transition-all"
              onClick={() => onSelect(item)}
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <h4 className="text-white font-black text-sm uppercase tracking-tight mb-1">{item.title}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] px-1 border border-[#3b82f6] text-[#3b82f6] rounded font-bold">4K</span>
                  <div className="flex items-center gap-1 text-[10px] text-white/50 uppercase font-black tracking-widest">
                    <span>{item.category}</span>
                    <span className="w-0.5 h-0.5 bg-gray-500 rounded-full" />
                    <span>{item.year}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
