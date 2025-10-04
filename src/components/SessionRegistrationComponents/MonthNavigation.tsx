import React from 'react';
import { useI18n } from '../../i18n/useI18n';

interface MonthNavigationProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
}

export const MonthNavigation: React.FC<MonthNavigationProps> = ({ selectedMonth, onMonthChange }) => {
  const { language } = useI18n();

  const handlePrevMonth = () => {
    const newMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1);
    onMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1);
    onMonthChange(newMonth);
  };

  const getMonthLabel = () => {
    return selectedMonth.toLocaleDateString(
      language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : 'en-US',
      { year: 'numeric', month: 'long' }
    );
  };

  return (
    <div className="month-navigation">
      <button onClick={handlePrevMonth} className="nav-button">
        ←
      </button>
      <h2>{getMonthLabel()}</h2>
      <button onClick={handleNextMonth} className="nav-button">
        →
      </button>
    </div>
  );
};

