import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Import, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { movieService } from '../services/movieService';
import { channelService } from '../services/channelService';
import { Movie, Channel, ContentType } from '../types';

const BOOTSTRAP_EMAIL = 'info.samitv.bd@gmail.com';

const BD_CHANNELS = [
  { name: 'Somoy TV', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Somoy_TV_logo.svg/1200px-Somoy_TV_logo.svg.png', streamUrl: 'https://www.youtube.com/watch?v=kYI9WvP0bGs', category: 'News', isYouTube: true },
  { name: 'Jamuna TV', logo: 'https://e7.pngegg.com/pngimages/111/484/png-clipart-jamuna-television-television-logo-jamuna-group-brand-television-text-logo.png', streamUrl: 'https://www.youtube.com/watch?v=5_u-nL9vI7s', category: 'News', isYouTube: true },
  { name: 'Independent TV', logo: 'https://cdn.freelogovectors.net/wp-content/uploads/2023/11/independent_television_logo-freelogovectors.net_.png', streamUrl: 'https://www.youtube.com/watch?v=KzE7_dAt7M0', category: 'News', isYouTube: true }
];

export default function AdminPanel() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [mode, setMode] = useState<'content' | 'channels'>('content');
  const [isActuallyAdmin, setIsActuallyAdmin] = useState(false);

  useEffect(() => {
    const unsubMovies = movieService.subscribeToMovies(setMovies);
    const unsubChannels = channelService.subscribeToChannels(setChannels);
    
    // Check if user is in admins collection
    const checkAdmin = async () => {
      if (auth.currentUser) {
        const { getDoc } = await import('firebase/firestore');
        const adminDoc = await getDoc(doc(db, 'admins', auth.currentUser.uid));
        setIsActuallyAdmin(adminDoc.exists());
      }
    };
    checkAdmin();

    return () => {
      unsubMovies();
      unsubChannels();
    };
  }, []);

  const handleBootstrapAdmin = async () => {
    if (auth.currentUser && auth.currentUser.email === BOOTSTRAP_EMAIL) {
      await setDoc(doc(db, 'admins', auth.currentUser.uid), {
        email: auth.currentUser.email,
        uid: auth.currentUser.uid
      });
      setIsActuallyAdmin(true);
    }
  };

  const handleBulkImport = async () => {
    for (const channel of BD_CHANNELS) {
      const exists = channels.find(c => c.name === channel.name);
      if (!exists) {
        await channelService.addChannel({
          ...channel,
          order: channels.length + 1
        });
      }
    }
  };

  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    category: 'Trending',
    type: ContentType.MOVIE,
    year: new Date().getFullYear(),
    duration: '2h 10m'
  });

  const [newChannel, setNewChannel] = useState({
    name: '',
    logo: '',
    streamUrl: '',
    category: 'News',
    isYouTube: true
  });

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    await movieService.addMovie({
      ...newMovie,
      createdAt: Date.now()
    });
    setNewMovie({ ...newMovie, title: '', description: '', thumbnail: '', videoUrl: '' });
  };

  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    await channelService.addChannel({ ...newChannel, order: channels.length + 1 });
    setNewChannel({ ...newChannel, name: '', logo: '', streamUrl: '' });
  };

  if (!isActuallyAdmin && auth.currentUser?.email !== BOOTSTRAP_EMAIL) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center p-12 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-6 opacity-20" />
        <h2 className="text-2xl font-black uppercase text-white mb-2">Access Resticted</h2>
        <p className="text-white/40">You do not have permission to access the Command Center.</p>
      </div>
    );
  }

  if (!isActuallyAdmin && auth.currentUser?.email === BOOTSTRAP_EMAIL) {
    return (
      <div className="h-[80vh] flex items-center justify-center p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-12 max-w-lg text-center"
        >
          <ShieldAlert size={64} className="mx-auto mb-6 text-[#3b82f6] drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          <h2 className="text-3xl font-black uppercase text-white mb-4 tracking-tighter">Admin Initializer</h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Authorized developer account detected (**{BOOTSTRAP_EMAIL}**). <br />
            Click below to initialize your secure admin session.
          </p>
          <button 
            onClick={handleBootstrapAdmin}
            className="w-full bg-gradient-to-r from-[#3b82f6] to-[#00aeef] text-white font-black py-4 rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-[#3b82f6]/30 uppercase tracking-widest text-sm"
          >
            Activate Control Panel
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Admin Command Center</h2>
          <p className="text-gray-400 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#00aeef]" /> 
            Admin session active
          </p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setMode('content')}
            className={`px-6 py-2 rounded-xl transition-all font-bold ${mode === 'content' ? 'bg-[#3b82f6] text-white' : 'text-gray-400'}`}
          >
            Content
          </button>
          <button
            onClick={() => setMode('channels')}
            className={`px-6 py-2 rounded-xl transition-all font-bold ${mode === 'channels' ? 'bg-[#00aeef] text-white' : 'text-gray-400'}`}
          >
            Channels
          </button>
        </div>
      </div>

      {mode === 'content' ? (
        <div className="space-y-12">
          {/* Add Content Form */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="text-[#3b82f6]" /> Add New Content
            </h3>
            <form onSubmit={handleAddMovie} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={newMovie.title}
                onChange={e => setNewMovie({ ...newMovie, title: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6]"
                required
              />
              <input
                type="text"
                placeholder="Category (e.g. Trending, Action)"
                value={newMovie.category}
                onChange={e => setNewMovie({ ...newMovie, category: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6]"
                required
              />
              <input
                type="text"
                placeholder="Thumbnail URL"
                value={newMovie.thumbnail}
                onChange={e => setNewMovie({ ...newMovie, thumbnail: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6]"
                required
              />
              <input
                type="text"
                placeholder="Video URL (YouTube or Direct)"
                value={newMovie.videoUrl}
                onChange={e => setNewMovie({ ...newMovie, videoUrl: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6]"
                required
              />
              <textarea
                placeholder="Description"
                value={newMovie.description}
                onChange={e => setNewMovie({ ...newMovie, description: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] md:col-span-2"
                rows={3}
              />
              <div className="flex items-center gap-4 md:col-span-2">
                <select 
                  value={newMovie.type}
                  onChange={e => setNewMovie({...newMovie, type: e.target.value as ContentType})}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white"
                >
                  <option value={ContentType.MOVIE}>Movie</option>
                  <option value={ContentType.SERIES}>Series</option>
                  <option value={ContentType.NATOK}>Natok</option>
                </select>
                <button type="submit" className="flex-1 bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white font-bold py-3 rounded-xl transition-all">
                  Add to Library
                </button>
              </div>
            </form>
          </section>

          {/* Library List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map(movie => (
              <div key={movie.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-center">
                <img src={movie.thumbnail} className="w-20 aspect-video object-cover rounded-lg" referrerPolicy="no-referrer" />
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-white font-bold truncate">{movie.title}</h4>
                  <p className="text-xs text-gray-500 uppercase font-black">{movie.category}</p>
                </div>
                <button 
                  onClick={() => movieService.deleteMovie(movie.id)}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Channel Controls */}
          <div className="flex gap-4">
            <button 
              onClick={handleBulkImport}
              className="flex items-center gap-2 bg-[#00aeef] hover:bg-[#00aeef]/90 text-black font-bold px-6 py-3 rounded-xl shadow-lg shadow-[#00aeef]/20 transition-all"
            >
              <Import size={20} />
              Import Bangladeshi Channels
            </button>
          </div>

          <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="text-[#00aeef]" /> Add Manually
            </h3>
            <form onSubmit={handleAddChannel} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Channel Name"
                value={newChannel.name}
                onChange={e => setNewChannel({ ...newChannel, name: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00aeef]"
                required
              />
              <input
                type="text"
                placeholder="Category (e.g. Sports, News)"
                value={newChannel.category}
                onChange={e => setNewChannel({ ...newChannel, category: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00aeef]"
                required
              />
              <input
                type="text"
                placeholder="Logo URL"
                value={newChannel.logo}
                onChange={e => setNewChannel({ ...newChannel, logo: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00aeef]"
                required
              />
              <input
                type="text"
                placeholder="Stream URL (m3u8, YouTube, etc.)"
                value={newChannel.streamUrl}
                onChange={e => setNewChannel({ ...newChannel, streamUrl: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00aeef]"
                required
              />
              <button type="submit" className="md:col-span-2 bg-[#00aeef] hover:bg-[#00aeef]/90 text-white font-bold py-3 rounded-xl transition-all">
                Add Channel
              </button>
            </form>
          </section>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {channels.map(channel => (
              <div key={channel.id} className="relative bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center group">
                <img src={channel.logo} className="w-12 h-12 object-contain bg-white rounded-lg p-1 mb-2" referrerPolicy="no-referrer" />
                <h4 className="text-white text-xs font-bold text-center truncate w-full">{channel.name}</h4>
                <button 
                  onClick={() => channelService.deleteChannel(channel.id)}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
