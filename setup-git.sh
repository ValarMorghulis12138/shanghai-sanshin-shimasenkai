#!/bin/bash

echo "=== 配置项目级别的 Git 用户信息 ==="
echo "这不会影响您的全局 Git 配置"
echo ""

# 提示用户输入个人 GitHub 信息
read -p "请输入您的个人 GitHub 用户名: " github_username
read -p "请输入您的个人 GitHub 邮箱: " github_email

# 设置项目级别的 Git 配置
git config user.name "$github_username"
git config user.email "$github_email"

echo ""
echo "✅ 项目 Git 配置完成！"
echo "用户名: $github_username"
echo "邮箱: $github_email"
echo ""
echo "=== 下一步 ==="
echo "1. 在您的个人 GitHub 账户创建一个新的私有仓库"
echo "   仓库名建议: shanghai-sanshin-shimasenkai"
echo "   不要初始化 README, .gitignore 或 license"
echo ""
echo "2. 创建完成后，复制仓库的 SSH 或 HTTPS URL"
echo "   例如: git@github.com:$github_username/shanghai-sanshin-shimasenkai.git"
echo ""
echo "3. 运行以下命令添加远程仓库:"
echo "   git remote add origin [您的仓库URL]"
echo ""
echo "4. 如果您想使用自定义域名，编辑 CNAME 文件，将 'your-domain.com' 改为您的域名"
