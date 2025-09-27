#!/bin/bash

# 使用 macOS 自带的 sips 工具压缩图片
echo "🖼️  开始压缩大图片..."

# 创建备份目录
mkdir -p src/assets/photos-backup

# 需要压缩的大图片列表
declare -a large_images=(
  "src/assets/photos/keisuke_sensei/三線・教師免許（教师证.jpg"
  "src/assets/photos/keisuke_sensei/沖縄民間大使表彰.jpg"
  "src/assets/photos/sanshin_member/三线会_古武道.jpg"
  "src/assets/photos/sanshin_member/shimasenkai_fuzhou.jpg"
  "src/assets/photos/keisuke_sensei/2024年在外公馆长表彰.jpg"
  "src/assets/photos/sanshin_member/shanghai_sanshin_shimasenkai.jpg"
  "src/assets/photos/sanshin_member/shimasenkai_event.jpg"
  "src/assets/photos/sanshin_member/shimasenkai_member_3.jpg"
)

# 压缩函数
compress_image() {
  local input_file="$1"
  local backup_file="src/assets/photos-backup/$(basename "$input_file")"
  
  if [ -f "$input_file" ]; then
    # 获取原始文件大小
    original_size=$(ls -lh "$input_file" | awk '{print $5}')
    
    # 备份原始文件
    cp "$input_file" "$backup_file"
    
    # 获取图片尺寸
    dimensions=$(sips -g pixelWidth -g pixelHeight "$input_file" | tail -n 2)
    width=$(echo "$dimensions" | grep pixelWidth | awk '{print $2}')
    height=$(echo "$dimensions" | grep pixelHeight | awk '{print $2}')
    
    echo "处理: $(basename "$input_file")"
    echo "  原始尺寸: ${width}x${height}, 大小: $original_size"
    
    # 如果宽度大于 1920px，缩小到 1920px
    if [ "$width" -gt 1920 ]; then
      echo "  缩小到最大宽度 1920px..."
      sips -Z 1920 "$input_file" --out "$input_file" >/dev/null 2>&1
    fi
    
    # 设置 JPEG 质量为 85%
    sips -s format jpeg -s formatOptions 85 "$input_file" --out "$input_file" >/dev/null 2>&1
    
    # 获取压缩后的文件大小
    new_size=$(ls -lh "$input_file" | awk '{print $5}')
    echo "  ✅ 压缩后大小: $new_size"
    echo ""
  else
    echo "  ❌ 文件不存在: $input_file"
  fi
}

# 压缩所有大图片
for image in "${large_images[@]}"; do
  compress_image "$image"
done

# 显示总结
echo "📊 压缩完成！"
echo "备份文件保存在: src/assets/photos-backup/"
echo ""
echo "压缩结果对比:"
for image in "${large_images[@]}"; do
  if [ -f "$image" ]; then
    backup="src/assets/photos-backup/$(basename "$image")"
    if [ -f "$backup" ]; then
      original_size=$(ls -lh "$backup" | awk '{print $5}')
      new_size=$(ls -lh "$image" | awk '{print $5}')
      echo "$(basename "$image"): $original_size → $new_size"
    fi
  fi
done

echo ""
echo "💡 提示："
echo "1. 如果对压缩结果满意，可以删除备份目录: rm -rf src/assets/photos-backup"
echo "2. 如果需要恢复原图，运行: cp src/assets/photos-backup/* src/assets/photos/"
