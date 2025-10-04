import React from 'react';
import { useI18n } from '../../i18n/useI18n';

interface ScheduleInfoProps {
  schedule: string[];
  time: string[];
  location: string;
}

export const ScheduleInfo: React.FC<ScheduleInfoProps> = ({ schedule, time, location }) => {
  const { t } = useI18n();

  return (
    <section className="schedule-info">
      <div className="info-card">
        <h3>{t.sessions.scheduleTitle}</h3>
        <p>{t.sessions.scheduleDescription}</p>
        <div className="schedule-details">
          {schedule.map((item, index) => (
            <p key={`schedule-${index}`}>📅 {item}</p>
          ))}
          {time.map((item, index) => (
            <p key={`time-${index}`}>⏰ {item}</p>
          ))}
          <p>📍 {t.common.location}： {location}</p>
        </div>
      </div>
      
      <div className="info-card">
        <h3>{t.sessions.whatToBring.title}</h3>
        <ul>
          {t.sessions.whatToBring.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

