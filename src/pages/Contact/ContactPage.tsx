import React from 'react';
import { useI18n } from '../../i18n/useI18n';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="contact-page">
      <div className="container">
        <section className="page-header">
          <h1>{t.contact.title}</h1>
        </section>

        <section className="section contact-info-section">
          <div className="contact-content single-column">
            <div className="contact-info">
              <div className="info-item">
                <h3>📍 {t.contact.location.title}</h3>
                {t.contact.location.address.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>

              <div className="info-item">
                <h3>📧 {t.contact.email}</h3>
                <p>
                  <a href="mailto:keisuke.nishihara@gmail.com">keisuke.nishihara@gmail.com</a>
                </p>
            </div>

              <div className="info-item">
                <h3>💬 {t.contact.wechat}</h3>
                <p>{t.contact.wechatId}: keisuke34</p>
              </div>

              <div className="faq-section">
                <h3>{t.contact.faq.title}</h3>
                
                <div className="faq-item">
                  <h4>{t.contact.faq.questions.ownSanshin.question}</h4>
                  <p>{t.contact.faq.questions.ownSanshin.answer}</p>
                </div>

                <div className="faq-item">
                  <h4>{t.contact.faq.questions.experience.question}</h4>
                  <p>{t.contact.faq.questions.experience.answer}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
