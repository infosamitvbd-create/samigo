import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  description: string;
  videoUrl: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: '1',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi0c7VYm37qBzdXNhr_gTI4X87rZ1YpLkdlBWP0eb41kZpUh21Ly_SJiyAdnpEd8_tS02SdN_bYbfb9zU1Z48yEdhgJymYN6kWsTD2VplNLDYj6IX1ur-EHp4dNuWywTl5KTK29FkMI5OjLmxmClLne7IZF-rX6-ipK6GlxHpHugbMGQHWv0eP2cPEgLc4F/s2752/logo_ta_change_kore_1st_202605101829.jpeg',
    title: 'SAMI GO PREMIER',
    description: 'Experience pure cinematic excellence with our new optimized streaming experience.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: '2',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9MV2pGsd9CcA2tiualGXz_4xf4Ap8lxRupo0r24GEa4y-qp6mKjttPIfgiIkNuYrH8vf157v0GfDfPrCbxLcqr_dcmNJR3izyOIYubvCdX388l6iGOxovnFwZMnyWTllkr2nAh7BoY_mhdsrz4mJDagWQjLUIh1V62Z-JAR_pmxbcwGg2bWtIhnsh1yvE/s2752/fast_image_er_logo_niye_202605101849.jpeg',
    title: 'Neon Nights',
    description: 'Explore the vibrant pulse of a city that never sleeps.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1920&h=1080',
    title: 'Nature Unleashed',
    description: 'The raw beauty of Bangladeshi landscapes captured in stunning 4K.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DEFAULT_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % DEFAULT_SLIDES.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + DEFAULT_SLIDES.length) % DEFAULT_SLIDES.length);

  return (
    <div className="relative h-[65vh] w-full overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Layered gradients for cinematic depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10" />
          <img
            src={DEFAULT_SLIDES[currentIndex].image}
            alt={DEFAULT_SLIDES[currentIndex].title}
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 z-20 px-12 pb-16 max-w-4xl">
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 z-30 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={prevSlide} className="p-3 bg-black/40 hover:bg-[#3b82f6] hover:text-white text-white rounded-full backdrop-blur-sm transition-all">
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 z-30 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={nextSlide} className="p-3 bg-black/40 hover:bg-[#3b82f6] hover:text-white text-white rounded-full backdrop-blur-sm transition-all">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Decorative Pagination - Centered like reference */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {DEFAULT_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-700 h-2.5 w-2.5 rounded-full ${
              idx === currentIndex ? 'bg-[#00aeef] scale-125 shadow-[0_0_10px_#00aeef]' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
