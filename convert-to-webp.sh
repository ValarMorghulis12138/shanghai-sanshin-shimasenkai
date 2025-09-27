#!/bin/bash

# WebP 图片转换脚本
# 需要先安装: brew install webp

echo "🖼️  开始转换图片为 WebP 格式..."

# 创建 WebP 输出目录
mkdir -p src/assets/photos-webp

# 复制目录结构
cd src/assets/photos
find . -type d | while read dir; do
  mkdir -p "../photos-webp/$dir"
done
cd ../../..

# 统计信息
total_files=0
converted_files=0

# 转换 JPG/JPEG 文件
find src/assets/photos -type f \( -name "*.jpg" -o -name "*.jpeg" \) | while read img; do
  ((total_files++))
  output=$(echo "$img" | sed 's/photos/photos-webp/' | sed 's/\.jpg$/\.webp/' | sed 's/\.jpeg$/\.webp/')
  
  echo "转换: $(basename "$img")"
  
  # 使用 cwebp 转换，质量设置为 85
  if cwebp -q 85 -mt "$img" -o "$output" 2>/dev/null; then
    ((converted_files++))
    
    # 显示文件大小对比
    original_size=$(ls -lh "$img" | awk '{print $5}')
    webp_size=$(ls -lh "$output" | awk '{print $5}')
    echo "  ✅ $original_size → $webp_size"
  else
    echo "  ❌ 转换失败"
  fi
done

# 转换 PNG 文件
find src/assets/photos -type f -name "*.png" | while read img; do
  ((total_files++))
  output=$(echo "$img" | sed 's/photos/photos-webp/' | sed 's/\.png$/\.webp/')
  
  echo "转换: $(basename "$img")"
  
  # PNG 转换为 WebP（无损压缩）
  if cwebp -lossless "$img" -o "$output" 2>/dev/null; then
    ((converted_files++))
    
    # 显示文件大小对比
    original_size=$(ls -lh "$img" | awk '{print $5}')
    webp_size=$(ls -lh "$output" | awk '{print $5}')
    echo "  ✅ $original_size → $webp_size"
  else
    echo "  ❌ 转换失败"
  fi
done

echo -e "\n📊 转换完成统计："
echo "总文件数: $total_files"
echo "成功转换: $converted_files"

echo -e "\n💾 存储空间对比："
original_size=$(du -sh src/assets/photos | awk '{print $1}')
webp_size=$(du -sh src/assets/photos-webp | awk '{print $1}')
echo "原始大小: $original_size"
echo "WebP大小: $webp_size"

echo -e "\n💡 使用提示："
echo "1. 在组件中使用 <picture> 标签支持 WebP："
echo '   <picture>'
echo '     <source srcset="image.webp" type="image/webp">'
echo '     <img src="image.jpg" alt="Description">'
echo '   </picture>'
echo ""
echo "2. 或使用我们的 LazyImage 组件，它会自动处理 WebP 支持"
