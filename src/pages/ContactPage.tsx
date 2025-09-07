import React from 'react';
import { useI18n } from '../i18n/useI18n';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="contact-page">
      <div className="container">
        <section className="page-header">
          <h1>{t.contact.title}</h1>
          <p className="page-description">
            {t.contact.description}
          </p>
        </section>

        <div className="contact-content single-column">
          <div className="contact-info">
            <h2>{t.contact.contactInfo}</h2>
            
            <div className="info-item">
              <h3>📍 {t.contact.location.title}</h3>
              {t.contact.location.address.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>

            <div className="info-item">
              <h3>📧 {t.contact.email}</h3>
              <p>
                <a href="mailto:info@shanghaisanshin.org">info@shanghaisanshin.org</a>
              </p>
            </div>

            <div className="info-item">
              <h3>💬 {t.contact.wechat}</h3>
              <p>ShanghaiSanshin</p>
              <div className="wechat-qr-placeholder">
                <p>WeChat QR Code</p>
              </div>
            </div>

            <div className="info-item">
              <h3>🕐 {t.contact.responseTime.title}</h3>
              <p>{t.contact.responseTime.description}</p>
            </div>

            <div className="faq-section">
              <h3>{t.contact.faq.title}</h3>
              
              <div className="faq-item">
                <h4>{t.contact.faq.questions.ownSanshin.question}</h4>
                <p>{t.contact.faq.questions.ownSanshin.answer}</p>
              </div>

              <div className="faq-item">
                <h4>{t.contact.faq.questions.cost.question}</h4>
                <p>{t.contact.faq.questions.cost.answer}</p>
              </div>

              <div className="faq-item">
                <h4>{t.contact.faq.questions.experience.question}</h4>
                <p>{t.contact.faq.questions.experience.answer}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="map-section">
          <h2>{t.contact.map.title}</h2>
          <div className="map-placeholder">
            <p>{t.contact.map.interactiveMap}</p>
            {t.contact.location.address.slice(0, 2).map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
