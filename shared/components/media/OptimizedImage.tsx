'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon, ExternalLink } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  caption?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  caption,
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center ${className}`}>
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <ImageIcon size={48} className="mx-auto mb-2" />
          <p>Unable to load image</p>
          {caption && <p className="text-sm mt-2">{caption}</p>}
        </div>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ExternalLink size={16} className="mr-2" />
          View Original
        </a>
      </div>
    );
  }

  return (
    <figure className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        
        {/* Image */}
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes}
          quality={quality}
          priority={priority}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${fill ? 'object-cover' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {/* Caption */}
      {caption && (
        <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
} 