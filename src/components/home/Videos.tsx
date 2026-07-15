import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videos = [
  {
    id: 1,
    title: 'Grand Diwali Celebration',
    thumbnail: 'https://img.youtube.com/vi/8a1Sz6RClz4/maxresdefault.jpg',
    embedId: '8a1Sz6RClz4', // Extracted from https://youtu.be/8a1Sz6RClz4
  },
  {
    id: 2,
    title: 'Premium Sky Rockets',
    thumbnail: 'https://img.youtube.com/vi/lxisS97Vh4s/maxresdefault.jpg',
    embedId: 'lxisS97Vh4s',
  },
  {
    id: 3,
    title: 'Flower Pots & Ground Spinners',
    thumbnail: 'https://img.youtube.com/vi/snWuppFxBCU/maxresdefault.jpg',
    embedId: 'snWuppFxBCU',
  }
];

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <section id="videos" className="py-20 bg-brand-dark relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-brand-black/90 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our <span className="text-brand-gold">Videos</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Experience the magic of our premium fireworks in action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              whileHover={{ y: -10 }}
              className="group cursor-pointer rounded-2xl overflow-hidden relative shadow-lg shadow-black/50 border border-white/10"
              onClick={() => setSelectedVideo(video.embedId)}
            >
              {/* Thumbnail Image */}
              <div className="aspect-video w-full relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-brand-gold/90 rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-brand-black p-4 border-t border-white/10">
                <h3 className="text-lg font-bold text-white group-hover:text-brand-gold transition-colors">{video.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-xl shadow-2xl border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-brand-gold transition-colors"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full absolute inset-0 rounded-xl"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
