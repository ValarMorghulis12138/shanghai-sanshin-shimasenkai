import React, { useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/useI18n';
import LazyImage from '../../components/LazyImage';
import './HomePage.css';

// 延迟加载图片 - 只导入关键的首屏图片
import heroBackground from '../../assets/photos/sanshin_member/shanghai_sanshin_shimasenkai.jpg';
import keisukeSenseiPhoto from '../../assets/photos/keisuke_sensei/keisuke_sensei_photo.jpg';

// 其他图片通过动态导入
const loadImage = (path: string) => {
  return new Promise<string>((resolve) => {
    import(path).then(module => resolve(module.default));
  });
};

const HomePage: React.FC = () => {
  const { t } = useI18n();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 图片路径配置 - 延迟加载
  const [galleryImages] = useState([
    { path: '../../assets/photos/haisai/haisai_sanshin_band.jpg', alt: "Haisai Sanshin Band Performance" },
    { path: '../../assets/photos/sanshin_member/shimasenkai_member_1.jpg', alt: "Sanshin Shimasenkai Members" },
    { path: '../../assets/photos/sanshin_member/shimasenkai_member_2.jpg', alt: "Teaching Scene" },
    { path: '../../assets/photos/sanshin_member/shimasenkai_member_3.jpg', alt: "Group Practice Session" },
    { path: '../../assets/photos/sanshin_member/三线会_古武道.jpg', alt: "Sanshin and Okinawan Kobudo Collaboration" },
    { path: '../../assets/photos/sanshin_member/shimasenkai_event.jpg', alt: "Sanshin Shimasenkai Event" }
  ]);

  const [loadedGalleryImages, setLoadedGalleryImages] = useState<{[key: number]: string}>({});

  // 预加载当前和下一张图片
  React.useEffect(() => {
    const loadGalleryImage = async (index: number) => {
      if (!loadedGalleryImages[index] && galleryImages[index]) {
        try {
          const imgSrc = await loadImage(galleryImages[index].path);
          setLoadedGalleryImages(prev => ({ ...prev, [index]: imgSrc }));
        } catch (error) {
          console.error('Failed to load image:', error);
        }
      }
    };

    // 加载当前图片
    loadGalleryImage(currentImageIndex);
    
    // 预加载下一张
    const nextIndex = (currentImageIndex + 1) % galleryImages.length;
    loadGalleryImage(nextIndex);
  }, [currentImageIndex, galleryImages, loadedGalleryImages]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  const changeImage = (newIndex: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  };

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % galleryImages.length;
    changeImage(newIndex);
  };

  const prevImage = () => {
    const newIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
    changeImage(newIndex);
  };

  const goToImage = (index: number) => {
    if (index !== currentImageIndex) {
      changeImage(index);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section - 优先加载 */}
      <section className="hero" style={{ backgroundImage: `url(${heroBackground})` }}>
        <div className="hero-content">
          <h1 className="hero-title">
            {t.home.hero.title}
          </h1>
        </div>
      </section>

      {/* Hero Description - 移到图片下方 */}
      <section className="hero-description-section">
        <div className="container">
          <div className="hero-text-content">
            <h2 className="hero-subtitle">{t.home.hero.subtitle}</h2>
            <p className="hero-description">{t.home.hero.description}</p>
          </div>
        </div>
      </section>

      {/* About Teacher Section */}
      <section className="about-section" id="about">
        <div className="container">
          <h2 className="section-title">{t.home.teacher.title}</h2>
          <div className="teacher-content">
            <div className="teacher-photo">
              <LazyImage
                src={keisukeSenseiPhoto}
                alt="Keisuke Sensei"
                className="teacher-image"
              />
            </div>
            <div className="teacher-info">
              <h3 className="teacher-name">{t.home.teacher.name}</h3>
              <p className="teacher-description">{t.home.teacher.description}</p>
              <div className="teacher-achievements">
                <h4>{t.home.teacher.achievements}</h4>
                <ul>
                  {t.home.teacher.achievementsList.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Section - 懒加载 */}
      <section className="certification-section">
        <div className="container">
          <h2 className="section-title">{t.home.certification.title}</h2>
          <div className="certification-grid">
            <div className="certification-item">
              <LazyImage
                src="/src/assets/photos/keisuke_sensei/三線・教師免許（教师证.jpg"
                alt={t.home.certification.teacherLicense}
                className="certification-photo"
              />
              <h3>{t.home.certification.teacherLicense}</h3>
              <p>{t.home.certification.licenseDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section - 懒加载 */}
      <section className="awards-section">
        <div className="container">
          <h2 className="section-title">{t.home.awards.title}</h2>
          <div className="certification-grid">
            <div className="award-item">
              <LazyImage
                src="/src/assets/photos/keisuke_sensei/沖縄民間大使表彰.jpg"
                alt={t.home.awards.ambassador}
                className="certification-photo"
              />
              <h3>{t.home.awards.ambassador}</h3>
              <p>{t.home.awards.ambassadorYear}</p>
            </div>
            <div className="award-item">
              <LazyImage
                src="/src/assets/photos/keisuke_sensei/2024年在外公馆长表彰.jpg"
                alt={t.home.awards.consulGeneral}
                className="certification-photo"
              />
              <h3>{t.home.awards.consulGeneral}</h3>
              <p>{t.home.awards.consulGeneralYear}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">{t.home.features.title}</h2>
          <div className="features-grid">
            {t.home.features.items.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - 懒加载并优化 */}
      <section className="gallery-section">
        <div className="container">
          <h2 className="section-title">{t.home.gallery.title}</h2>
          <div className="gallery-slider">
            <div className="gallery-main">
              <button className="gallery-nav gallery-nav-prev" onClick={prevImage} aria-label="Previous image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div 
                className="gallery-image-container"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {loadedGalleryImages[currentImageIndex] ? (
                  <img
                    src={loadedGalleryImages[currentImageIndex]}
                    alt={galleryImages[currentImageIndex].alt}
                    className={`gallery-main-image ${isTransitioning ? 'transitioning' : ''}`}
                  />
                ) : (
                  <div className="gallery-placeholder">
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
              <button className="gallery-nav gallery-nav-next" onClick={nextImage} aria-label="Next image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
            <div className="gallery-dots">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  className={`gallery-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => goToImage(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>{t.home.cta.title}</h2>
          <p>{t.home.cta.subtitle}</p>
          <div className="cta-buttons">
            <Link to="/shanghai" className="btn btn-primary">{t.home.cta.joinButton}</Link>
            <Link to="/contact" className="btn btn-secondary">{t.home.cta.contactButton}</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
