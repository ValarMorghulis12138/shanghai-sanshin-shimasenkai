import React from 'react';
import { useI18n } from '../../i18n/useI18n';

interface MonthNavigationProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
}

export const MonthNavigation: React.FC<MonthNavigationProps> = ({ selectedMonth, onMonthChange }) => {
  const { language } = useI18n();

  // Calculate current month and max month (current + 12 months)
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 12, 1);

  // Check if we can navigate to previous/next month
  const canGoPrev = selectedMonth > currentMonth;
  const canGoNext = selectedMonth < maxMonth;

  const handlePrevMonth = () => {
    if (canGoPrev) {
      const newMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1);
      onMonthChange(newMonth);
    }
  };

  const handleNextMonth = () => {
    if (canGoNext) {
      const newMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1);
      onMonthChange(newMonth);
    }
  };

  const getMonthLabel = () => {
    return selectedMonth.toLocaleDateString(
      language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : 'en-US',
      { year: 'numeric', month: 'long' }
    );
  };

  return (
    <div className="month-navigation">
      <button 
        onClick={handlePrevMonth} 
        className="nav-button"
        disabled={!canGoPrev}
        style={{ opacity: canGoPrev ? 1 : 0.3, cursor: canGoPrev ? 'pointer' : 'not-allowed' }}
      >
        ←
      </button>
      <h2>{getMonthLabel()}</h2>
      <button 
        onClick={handleNextMonth} 
        className="nav-button"
        disabled={!canGoNext}
        style={{ opacity: canGoNext ? 1 : 0.3, cursor: canGoNext ? 'pointer' : 'not-allowed' }}
      >
        →
      </button>
    </div>
  );
};

