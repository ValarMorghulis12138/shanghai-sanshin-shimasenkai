# 部署指南 - Shanghai Sanshi Shimasenkai

## 第一步：配置 Git（使用个人 GitHub 账户）

### 1. 运行配置脚本
```bash
./setup-git.sh
```
按提示输入您的个人 GitHub 用户名和邮箱。

### 2. 创建 GitHub 仓库
1. 登录您的个人 GitHub 账户
2. 创建新的私有仓库（Private Repository）
   - 仓库名：`shanghai-sanshin-shimasenkai`
   - **不要**勾选 "Initialize this repository with a README"
   - **不要**添加 .gitignore 或 license

### 3. 连接远程仓库
复制您的仓库地址（SSH 或 HTTPS），然后运行：
```bash
# 使用 SSH（推荐，如果您已配置 SSH keys）
git remote add origin git@github.com:YOUR_USERNAME/shanghai-sanshin-shimasenkai.git

# 或使用 HTTPS
git remote add origin https://github.com/YOUR_USERNAME/shanghai-sanshin-shimasenkai.git
```

### 4. 首次提交和推送
```bash
git add .
git commit -m "Initial commit: Shanghai Sanshi Shimasenkai website"
git branch -M main
git push -u origin main
```

## 第二步：启用 GitHub Pages

### 1. 配置仓库设置
1. 在 GitHub 仓库页面，点击 "Settings"
2. 左侧菜单找到 "Pages"
3. Source 选择 "Deploy from a branch"
4. Branch 选择 "gh-pages"（稍后会创建）
5. 点击 "Save"

### 2. 构建和部署
```bash
# 安装依赖（如果还没安装）
npm install

# 构建项目
npm run build

# 部署到 GitHub Pages
npm run deploy
```

## 第三步：配置自定义域名（可选）

### 1. 编辑 CNAME 文件
将 `CNAME` 文件中的 `your-domain.com` 改为您的域名：
```bash
echo "您的域名.com" > CNAME
```

### 2. 配置 DNS
在您的域名服务商处添加以下记录：

**方式一：使用 CNAME（推荐子域名）**
```
类型: CNAME
名称: www（或其他子域名）
值: YOUR_USERNAME.github.io
```

**方式二：使用 A 记录（用于根域名）**
```
类型: A
名称: @
值: 185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
```

### 3. 在 GitHub Pages 设置中
1. 返回仓库的 Settings > Pages
2. 在 "Custom domain" 输入您的域名
3. 勾选 "Enforce HTTPS"

## 第四步：更新 Vite 配置

如果使用自定义域名，需要更新 `vite.config.ts`：
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/', // 使用自定义域名时改为 '/'
})
```

如果不使用自定义域名，保持现有配置：
```typescript
base: process.env.NODE_ENV === 'production' ? '/shanghai-sanshin-shimasenkai/' : '/',
```

## 常见问题

### Q: 如何更新网站？
```bash
# 修改代码后
git add .
git commit -m "更新说明"
git push origin main

# 重新部署
npm run deploy
```

### Q: 部署后看不到网站？
- 等待 5-10 分钟让 GitHub Pages 生效
- 检查是否选择了正确的分支（gh-pages）
- 清除浏览器缓存

### Q: 如何保持公司项目不受影响？
项目级别的 Git 配置只影响当前项目。您的其他项目仍会使用全局配置。

## 访问您的网站

部署成功后，您可以通过以下地址访问：
- GitHub Pages 默认地址：`https://YOUR_USERNAME.github.io/shanghai-sanshin-shimasenkai/`
- 自定义域名：`https://您的域名.com`

---

需要帮助？请通过网站的 Contact 页面联系我们。
