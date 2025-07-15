'use client';

import { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  showControls?: boolean;
  className?: string;
}

export default function YouTubeEmbed({
  videoId,
  title = 'YouTube Video',
  autoplay = false,
  showControls = true,
  className = ''
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=${showControls ? 1 : 0}&rel=0&modestbranding=1`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const handleLoadVideo = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center ${className}`}>
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <ExternalLink size={48} className="mx-auto mb-2" />
          <p>Unable to load video</p>
        </div>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <ExternalLink size={16} className="mr-2" />
          Watch on YouTube
        </a>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden shadow-lg ${className}`}>
      <div className="relative aspect-video">
        {!isLoaded ? (
          <div className="relative w-full h-full group cursor-pointer" onClick={handleLoadVideo}>
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={handleError}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-300">
              <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                <Play size={32} className="text-white ml-1" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black bg-opacity-70 rounded px-3 py-1">
                <p className="text-white text-sm font-medium truncate">{title}</p>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
      
      {/* Video Info */}
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h3>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 transition-colors"
            title="Watch on YouTube"
          >
            <ExternalLink size={20} />
          </a>
        </div>
      </div>
    </div>
  );
} 