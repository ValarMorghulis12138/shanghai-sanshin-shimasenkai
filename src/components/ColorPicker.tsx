import React from 'react';
import './ColorPicker.css';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  language: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange, language }) => {
  // 预定义的颜色选项
  const colors = [
    '#E53E3E', // 红色
    '#DD6B20', // 橙色
    '#D69E2E', // 黄色
    '#38A169', // 绿色
    '#3182CE', // 蓝色
    '#805AD5', // 紫色
    '#D53F8C', // 粉色
    '#2D3748', // 灰色
    '#319795', // 青色
    '#718096', // 中灰色
    '#B7791F', // 棕色
    '#1A365D', // 深蓝色
  ];

  const getLabel = () => {
    switch (language) {
      case 'zh':
        return '选择您的标签颜色';
      case 'ja':
        return 'ラベルの色を選択';
      case 'en':
      default:
        return 'Choose your tag color';
    }
  };

  return (
    <div className="color-picker">
      <label className="color-picker-label">{getLabel()}</label>
      <div className="color-options">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className={`color-option ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            aria-label={`选择颜色 ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
