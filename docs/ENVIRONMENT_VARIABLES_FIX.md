# 环境变量和 GitHub Pages 部署问题解决方案

## 问题描述

当使用 GitHub Pages 部署时，编辑功能（创建/删除 session、注册等）突然停止工作。

## 根本原因

1. **GitHub Pages 是静态托管**：不支持服务器端环境变量
2. **`.env.local` 文件不会被提交**：出于安全考虑，环境变量文件通常在 `.gitignore` 中
3. **Vite 构建行为**：
   - 在本地运行 `npm run build` 时，Vite 会读取 `.env.local` 并将变量值硬编码到构建文件中
   - 但如果在没有 `.env.local` 的环境中构建（如 CI/CD），这些变量会是 `undefined`

## 为什么之前能工作？

- 您可能之前在本地构建并部署，环境变量被包含在构建文件中
- 但当重新构建或在不同环境构建时，环境变量丢失了

## 解决方案

### 方案 1：配置文件方法（已实施）

创建一个配置文件 `src/config/jsonbin.config.ts`，包含默认的 JSONBin 凭据：

```typescript
export const JSONBIN_CONFIG = {
  SESSIONS_BIN_ID: 'your-sessions-bin-id',
  REGISTRATIONS_BIN_ID: 'your-registrations-bin-id',
  API_KEY: 'your-api-key',
  ADMIN_CONFIG_BIN_ID: 'your-admin-config-bin-id'
};
```

然后在服务中使用：
```typescript
const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY || JSONBIN_CONFIG.API_KEY;
```

**优点**：
- 简单直接
- 适合公开的演示数据
- 不需要额外的构建步骤

**缺点**：
- API 密钥暴露在代码中（对于演示数据可以接受）

### 方案 2：构建时注入（推荐用于生产）

使用 GitHub Actions 在构建时注入环境变量：

1. 在 GitHub 仓库设置中添加 Secrets
2. 创建 GitHub Actions 工作流：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build with environment variables
        env:
          VITE_JSONBIN_API_KEY: ${{ secrets.JSONBIN_API_KEY }}
          VITE_SESSIONS_BIN_ID: ${{ secrets.SESSIONS_BIN_ID }}
          VITE_REGISTRATIONS_BIN_ID: ${{ secrets.REGISTRATIONS_BIN_ID }}
          VITE_ADMIN_CONFIG_BIN_ID: ${{ secrets.ADMIN_CONFIG_BIN_ID }}
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 方案 3：使用公共 API（适合开源项目）

如果数据不敏感，可以：
1. 创建公共的 JSONBin bins
2. 使用只读 API 密钥
3. 通过其他方式控制写权限

## 当前状态

我们已经实施了方案 1，您的网站现在应该可以正常工作了。配置文件包含了您的 JSONBin 凭据作为默认值。

## 安全建议

如果您的数据包含敏感信息：
1. 不要使用方案 1（配置文件中的硬编码值）
2. 使用方案 2（GitHub Actions + Secrets）
3. 或考虑使用需要后端的其他托管方案（如 Vercel、Netlify）

## 测试步骤

1. 清除浏览器缓存
2. 访问您的网站
3. 测试所有编辑功能
4. 检查浏览器控制台是否有错误

如果仍有问题，请检查：
- JSONBin 服务是否正常
- API 密钥是否有效
- 网络连接是否正常
