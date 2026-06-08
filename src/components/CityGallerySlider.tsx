import React, { useState, useEffect, useCallback } from 'react';
import './CityGallerySlider.css';

export interface GalleryImageItem {
  src: string;
  alt: string;
}

interface CityGallerySliderProps {
  images: GalleryImageItem[];
  autoPlayIntervalMs?: number;
  pauseOnHover?: boolean;
}

const CityGallerySlider: React.FC<CityGallerySliderProps> = ({
  images,
  autoPlayIntervalMs,
  pauseOnHover = false,
}) => {
  const [isGalleryReady, setIsGalleryReady] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const windowWithIdleCallback = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (windowWithIdleCallback.requestIdleCallback) {
      const idleCallbackId = windowWithIdleCallback.requestIdleCallback(() => {
        setIsGalleryReady(true);
      }, { timeout: 1200 });

      return () => {
        windowWithIdleCallback.cancelIdleCallback?.(idleCallbackId);
      };
    }

    const timeoutId = window.setTimeout(() => {
      setIsGalleryReady(true);
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const preloadImage = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length && !loadedImages.has(index)) {
        const img = new Image();
        img.src = images[index].src;
        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(index));
        };
      }
    },
    [images, loadedImages]
  );

  useEffect(() => {
    if (!isGalleryReady || images.length === 0) return;
    preloadImage(0);
  }, [images.length, isGalleryReady, preloadImage]);

  const changeImage = useCallback(
    (newIndex: number) => {
      if (isTransitioning) return;

      if (!loadedImages.has(newIndex)) {
        setIsImageLoading(true);
      }

      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(newIndex);
        setIsTransitioning(false);
      }, 150);
    },
    [isTransitioning, loadedImages]
  );

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    const newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    changeImage(newIndex);
    const preloadIndex = newIndex === images.length - 1 ? 0 : newIndex + 1;
    preloadImage(preloadIndex);
  }, [changeImage, currentImageIndex, images.length, preloadImage]);

  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    const newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    changeImage(newIndex);
    const preloadIndex = newIndex === 0 ? images.length - 1 : newIndex - 1;
    preloadImage(preloadIndex);
  }, [changeImage, currentImageIndex, images.length, preloadImage]);

  const goToImage = (index: number) => {
    if (!isGalleryReady) return;
    if (index !== currentImageIndex) {
      changeImage(index);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isGalleryReady) return;
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  useEffect(() => {
    if (!autoPlayIntervalMs || images.length <= 1) return;

    const timer = window.setInterval(() => {
      if (!pauseOnHover || !isPaused) {
        nextImage();
      }
    }, autoPlayIntervalMs);

    return () => window.clearInterval(timer);
  }, [autoPlayIntervalMs, images.length, isPaused, nextImage, pauseOnHover]);

  if (images.length === 0) return null;

  return (
    <div
      className="city-gallery-slider"
      onMouseEnter={pauseOnHover ? () => setIsPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setIsPaused(false) : undefined}
    >
      <div className="city-gallery-main">
        <button
          className="city-gallery-nav city-gallery-nav-prev"
          onClick={prevImage}
          aria-label="Previous image"
          disabled={!isGalleryReady || images.length <= 1}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div
          className="city-gallery-image-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {!isGalleryReady && (
            <div className="city-gallery-loading city-gallery-initial-loading">
              <div className="city-gallery-loading-spinner"></div>
            </div>
          )}
          {isImageLoading && (
            <div className="city-gallery-loading">
              <div className="city-gallery-loading-spinner"></div>
            </div>
          )}
          {isGalleryReady && (
            <img
              key={currentImageIndex}
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className={`city-gallery-main-image ${isTransitioning ? 'transitioning' : ''} ${isImageLoading ? 'loading' : ''}`}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              onLoad={() => {
                setIsImageLoading(false);
                setLoadedImages((prev) => new Set(prev).add(currentImageIndex));
              }}
              onError={() => {
                setIsImageLoading(false);
              }}
            />
          )}
        </div>

        <button
          className="city-gallery-nav city-gallery-nav-next"
          onClick={nextImage}
          aria-label="Next image"
          disabled={!isGalleryReady || images.length <= 1}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="city-gallery-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`city-gallery-dot ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => goToImage(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CityGallerySlider;
