#!/bin/bash

# 安装必要的工具（如果还没有安装）
# brew install imagemagick

# 创建优化后的图片目录
mkdir -p src/assets/photos-optimized

# 复制目录结构
cd src/assets/photos
find . -type d | while read dir; do
  mkdir -p "../photos-optimized/$dir"
done
cd ../../..

# 优化图片
echo "开始优化图片..."

# 处理JPG文件
find src/assets/photos -name "*.jpg" -o -name "*.jpeg" | while read img; do
  output=$(echo "$img" | sed 's/photos/photos-optimized/')
  echo "优化: $img"
  
  # 获取原始图片尺寸
  width=$(identify -format "%w" "$img")
  
  # 如果宽度大于1920px，则缩小到1920px（保持纵横比）
  if [ "$width" -gt 1920 ]; then
    convert "$img" -resize 1920x -quality 85 -strip "$output"
  else
    convert "$img" -quality 85 -strip "$output"
  fi
done

# 处理PNG文件
find src/assets/photos -name "*.png" | while read img; do
  output=$(echo "$img" | sed 's/photos/photos-optimized/')
  echo "优化: $img"
  
  # PNG优化
  convert "$img" -strip -quality 85 "$output"
done

# 显示优化结果
echo -e "\n优化完成！对比文件大小："
echo "原始图片大小："
du -sh src/assets/photos
echo -e "\n优化后图片大小："
du -sh src/assets/photos-optimized

echo -e "\n详细对比："
find src/assets/photos -type f \( -name "*.jpg" -o -name "*.png" \) | while read original; do
  optimized=$(echo "$original" | sed 's/photos/photos-optimized/')
  if [ -f "$optimized" ]; then
    original_size=$(ls -lh "$original" | awk '{print $5}')
    optimized_size=$(ls -lh "$optimized" | awk '{print $5}')
    echo "$original: $original_size -> $optimized_size"
  fi
done
