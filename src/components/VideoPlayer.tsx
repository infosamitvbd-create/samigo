import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

interface VideoPlayerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export default function VideoPlayer({ url, title, onClose }: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center pt-16"
    >
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-8 z-10">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <button
          onClick={onClose}
          className="p-3 hover:bg-white/10 rounded-full text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="relative w-full h-full max-h-screen aspect-video">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <ReactPlayer
          url={url}
          playing={isReady}
          volume={volume}
          muted={muted}
          width="100%"
          height="100%"
          controls
          onReady={() => setIsReady(true)}
          onError={(e) => {
            console.error("Video error:", e);
            setIsReady(true);
          }}
          config={{
            youtube: { 
              playerVars: { 
                showinfo: 0, 
                modestbranding: 1, 
                autoplay: 1,
                origin: window.location.origin
              } 
            } as any,
            file: { attributes: { crossOrigin: 'anonymous', controlsList: 'nodownload' } }
          }}
        />
      </div>
    </motion.div>
  );
}
