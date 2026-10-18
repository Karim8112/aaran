import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import type IVideo from "../../Model/IVideo";
import { convertToEmbedUrl, getYouTubeThumbnailUrl } from "../../lib/youtube";
import { useVideos } from "./useVideo";
import LoadingScreen from "../Loading";

export default function YouTubeGallery() {
  const [activeVideo, setActiveVideo] = useState<IVideo | null>(null);
  const VideoHook = useVideos();

  return VideoHook.loading ? (
    <LoadingScreen what="Videos" />
  ) : (
    <div className="min-h-screen w-full! bg-zinc-950 text-zinc-100 font-sans p-8!">
      <div className="w-full! mx-auto space-y-8!">
        <header className="flex items-center justify-between border-b border-zinc-800 pb-6!">
          <h1 className="text-3xl! font-bold text-white">
            Videos from <span className="text-[#D1B797]">AARAN</span>
          </h1>
        </header>

        {/* 4-COLUMN VIDEO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 ">
          {VideoHook.data?.data.map((video) => {
            return (
              getYouTubeThumbnailUrl(video.path) && (
                <motion.div
                  key={video._id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => setActiveVideo(video)}
                  className="group cursor-pointer bg-zinc-900 rounded-2xl border border-zinc-800 p-3! space-y-3!"
                >
                  <div className="relative aspect-video w-full! overflow-hidden rounded-xl bg-zinc-950">
                    <img
                      src={getYouTubeThumbnailUrl(video.path) as string}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12! h-12! rounded-full bg-[#D1B797] text-zinc-950 flex items-center justify-center shadow-lg">
                        <Play className="w-5! h-5! fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-sm! font-semibold text-zinc-100 group-hover:text-[#D1B797]">
                    {video.title}
                  </h3>
                  <p className="text-xs! text-zinc-400">{video.title}</p>
                </motion.div>
              )
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4! z-50"
          >
            <div className="relative w-full max-w-4xl bg-zinc-900 border border-[#D1B797]/30 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4! bg-zinc-950 flex items-center justify-between border-b border-zinc-800">
                <h2 className="text-sm! font-semibold text-zinc-100">
                  {activeVideo.title}
                </h2>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5! rounded bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={convertToEmbedUrl(activeVideo.path)}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
