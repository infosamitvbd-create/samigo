import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Crown } from 'lucide-react';
import Sidebar from './components/Sidebar';
import HeroBanner from './components/HeroBanner';
import ContentRow from './components/ContentRow';
import HomeLiveRow from './components/HomeLiveRow';
import LiveTV from './components/LiveTV';
import AdminPanel from './components/AdminPanel';
import VideoPlayer from './components/VideoPlayer';
import { useAuth } from './hooks/useAuth';
import { movieService } from './services/movieService';
import { channelService } from './services/channelService';
import { Movie, ContentType, Channel } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedContent, setSelectedContent] = useState<Movie | Channel | null>(null);
  const { user, isAdmin, login, logout, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubMovies = movieService.subscribeToMovies(setMovies);
    const unsubChannels = channelService.subscribeToChannels(setChannels);
    return () => {
      unsubMovies();
      unsubChannels();
    };
  }, []);

  const browseContent = (type: ContentType) => {
    return movies.filter(m => m.type === type && (
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  };

  const moviesList = movies.filter(m => m.type === ContentType.MOVIE);
  const seriesList = movies.filter(m => m.type === ContentType.SERIES);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLC-6IOFHBEhyphenhyphenMtCMtBFr-pTtDrvDsYxMxjTzyt_iv12nSBSG-ojHGB-1zApY7JKLCWHqHw7x3fN_NILmdknHvGD8vreW2_Xj9y95_4WLxG3lKK3q8GqReEm_tT5t5yaufIEZ67LWZz-ltmh3kcTRQiM39zdTRdTW8qf9q01ShfF4hzNeGeEGW_Mq6j8bh/s1064/AKASH_name_ta_Remove_kore_202605101819.jpeg"
            alt="SAMI GO"
            className="w-24 h-24 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          />
          <div className="text-2xl font-black tracking-[0.2em] text-white">
            <span className="text-[#3b82f6]">SAMI</span> GO
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#02040a] min-h-screen text-white font-sans selection:bg-[#00aeef]/30 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={isAdmin}
        onLogin={login}
        onLogout={logout}
        user={user}
      />

      <main className="flex-1 ml-20 transition-all duration-500 overflow-hidden flex flex-col">
        {/* Header from design */}
        <header className="h-24 px-12 flex items-center justify-between sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-12 flex-1">
            <div className="relative group max-w-xl w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#3b82f6] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search movies, channels, or genres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full py-3.5 pl-14 pr-8 w-full text-sm font-medium focus:outline-none focus:border-[#3b82f6]/50 focus:bg-white/10 transition-all placeholder:text-white/20"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-8 pl-8">
            <div className="hidden lg:flex items-center gap-3 text-[#00aeef]">
              <div className="w-2 h-2 rounded-full bg-[#00aeef] animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live BD: 42 Channels</span>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#00aeef] text-white rounded-lg text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#3b82f6]/20">
              <Crown size={14} />
              Upgrade
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pb-24"
              >
                <HeroBanner />
                <div className="mt-4 space-y-4">
                  <HomeLiveRow 
                    channels={channels}
                    onSelect={setSelectedContent}
                  />
                  
                  {/* Movies Section */}
                  {movies.filter(m => m.type === ContentType.MOVIE).length > 0 && (
                    <div className="space-y-0">
                      <div className="px-12 pt-12 pb-2">
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-1.5 bg-[#3b82f6] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Feature Movies</h2>
                        </div>
                      </div>
                      {Array.from(new Set(movies.filter(m => m.type === ContentType.MOVIE).map(m => m.category))).map(cat => (
                        <ContentRow 
                          key={`movie-${cat}`}
                          title={cat}
                          items={movies.filter(m => m.type === ContentType.MOVIE && m.category === cat)}
                          onSelect={setSelectedContent}
                        />
                      ))}
                    </div>
                  )}

                  {/* Series Section */}
                  {movies.filter(m => m.type === ContentType.SERIES).length > 0 && (
                    <div className="space-y-0">
                      <div className="px-12 pt-12 pb-2">
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-1.5 bg-[#00aeef] rounded-full shadow-[0_0_15px_rgba(0,174,239,0.5)]"></div>
                          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Popular Series</h2>
                        </div>
                      </div>
                      {Array.from(new Set(movies.filter(m => m.type === ContentType.SERIES).map(m => m.category))).map(cat => (
                        <ContentRow 
                          key={`series-${cat}`}
                          title={cat}
                          items={movies.filter(m => m.type === ContentType.SERIES && m.category === cat)}
                          onSelect={setSelectedContent}
                        />
                      ))}
                    </div>
                  )}

                  {/* Natok Section */}
                  {movies.filter(m => m.type === ContentType.NATOK).length > 0 && (
                    <div className="space-y-0">
                      <div className="px-12 pt-12 pb-2">
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-1.5 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Bangla Natok</h2>
                        </div>
                      </div>
                      {Array.from(new Set(movies.filter(m => m.type === ContentType.NATOK).map(m => m.category))).map(cat => (
                        <ContentRow 
                          key={`natok-${cat}`}
                          title={cat}
                          items={movies.filter(m => m.type === ContentType.NATOK && m.category === cat)}
                          onSelect={setSelectedContent}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'movies' && (
              <motion.div
                key="movies"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-12"
              >
                <div className="mb-12">
                  <span className="text-[#3b82f6] font-black text-xs uppercase tracking-[0.3em] mb-2 block">Premium Library</span>
                  <h2 className="text-6xl font-black uppercase tracking-tighter text-white">Movies</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                  {browseContent(ContentType.MOVIE).map(movie => (
                    <motion.div
                      key={movie.id}
                      whileHover={{ scale: 1.05, y: -8 }}
                      onClick={() => setSelectedContent(movie)}
                      className="aspect-[3/4.5] bg-white/5 rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#3b82f6]/50 transition-all shadow-2xl relative"
                    >
                      <img src={movie.thumbnail} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 pt-12">
                        <h3 className="font-black uppercase text-sm tracking-tight mb-1">{movie.title}</h3>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] text-gray-400 font-bold">{movie.year}</span>
                           <span className="w-1 h-1 bg-gray-600 rounded-full" />
                           <span className="text-[10px] text-[#3b82f6] font-black uppercase tracking-widest">{movie.category}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'series' && (
              <motion.div
                key="series"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-12"
              >
                <div className="mb-12">
                  <span className="text-[#00aeef] font-black text-xs uppercase tracking-[0.3em] mb-2 block">Binge Watch</span>
                  <h2 className="text-6xl font-black uppercase tracking-tighter text-white">Series</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                  {browseContent(ContentType.SERIES).map(series => (
                    <motion.div
                      key={series.id}
                      whileHover={{ scale: 1.05, y: -8 }}
                      onClick={() => setSelectedContent(series)}
                      className="aspect-[3/4.5] bg-white/5 rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#00aeef]/50 transition-all shadow-2xl relative"
                    >
                      <img src={series.thumbnail} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 pt-12">
                        <h3 className="font-black uppercase text-sm tracking-tight mb-1">{series.title}</h3>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] text-gray-400 font-bold">{series.year}</span>
                           <span className="w-1 h-1 bg-gray-600 rounded-full" />
                           <span className="text-[10px] text-[#00aeef] font-black uppercase tracking-widest">{series.category}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'natok' && (
              <motion.div
                key="natok"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-12"
              >
                <div className="mb-12">
                  <span className="text-purple-500 font-black text-xs uppercase tracking-[0.3em] mb-2 block">Bangla Culture</span>
                  <h2 className="text-6xl font-black uppercase tracking-tighter text-white">Natok</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                  {browseContent(ContentType.NATOK).map(natok => (
                    <motion.div
                      key={natok.id}
                      whileHover={{ scale: 1.05, y: -8 }}
                      onClick={() => setSelectedContent(natok)}
                      className="aspect-[3/4.5] bg-white/5 rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-purple-500/50 transition-all shadow-2xl relative"
                    >
                      <img src={natok.thumbnail} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 pt-12">
                        <h3 className="font-black uppercase text-sm tracking-tight mb-1">{natok.title}</h3>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] text-gray-400 font-bold">{natok.year}</span>
                           <span className="w-1 h-1 bg-gray-600 rounded-full" />
                           <span className="text-[10px] text-purple-500 font-black uppercase tracking-widest">{natok.category}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'live' && (
              <motion.div
                key="live"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LiveTV onSelect={setSelectedContent} />
              </motion.div>
            )}

            {activeTab === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AdminPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {selectedContent && (
          <VideoPlayer
            url={'videoUrl' in selectedContent ? selectedContent.videoUrl : selectedContent.streamUrl}
            title={'title' in selectedContent ? selectedContent.title : selectedContent.name}
            onClose={() => setSelectedContent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
