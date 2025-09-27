import React, { useState, useEffect, useRef } from 'react';
import './LazyImage.css';

interface OptimizedImageProps {
  src: string;
  webpSrc?: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  threshold?: number;
  // 响应式图片源
  srcSet?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  webpSrc,
  alt, 
  className = '', 
  sizes,
  loading = 'lazy',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjIwMCIgeT0iMTUwIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjE5cHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=',
  threshold = 0.1,
  srcSet
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (loading === 'eager') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading, threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // 如果不在视口内，显示占位符
  if (!isInView) {
    return (
      <div className={`lazy-image-container ${className}`}>
        <img
          ref={imgRef}
          src={placeholder}
          alt={alt}
          className="lazy-image loading"
          loading="lazy"
        />
      </div>
    );
  }

  // 生成 srcset 字符串
  const generateSrcSet = () => {
    if (!srcSet) return undefined;
    
    const srcSetArray = [];
    if (srcSet.mobile) srcSetArray.push(`${srcSet.mobile} 768w`);
    if (srcSet.tablet) srcSetArray.push(`${srcSet.tablet} 1024w`);
    if (srcSet.desktop) srcSetArray.push(`${srcSet.desktop} 1920w`);
    
    return srcSetArray.join(', ');
  };

  // 如果支持 WebP，使用 picture 元素
  if (webpSrc) {
    return (
      <div className={`lazy-image-container ${className}`}>
        <picture>
          <source 
            srcSet={webpSrc} 
            type="image/webp"
          />
          <source 
            srcSet={generateSrcSet() || src} 
            type="image/jpeg"
          />
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            onLoad={handleLoad}
            className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
            loading={loading}
            sizes={sizes}
          />
        </picture>
        {!isLoaded && (
          <div className="lazy-image-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    );
  }

  // 标准 img 元素
  return (
    <div className={`lazy-image-container ${className}`}>
      <img
        ref={imgRef}
        src={src}
        srcSet={generateSrcSet()}
        alt={alt}
        onLoad={handleLoad}
        className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
        loading={loading}
        sizes={sizes}
      />
      {!isLoaded && (
        <div className="lazy-image-spinner">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
