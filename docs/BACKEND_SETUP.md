# 后端功能设置指南 / Backend Setup Guide

## 概述 / Overview

当前的 Sessions 页面展示了一个静态的课程管理系统原型。要实现完整的动态功能（老师创建课程、学生在线报名、实时更新），您需要添加后端服务。

## 推荐方案 / Recommended Solutions

### 1. Firebase (推荐 / Recommended) 🔥
**优点 / Pros:**
- 免费层级足够使用 (Free tier is sufficient)
- 实时数据同步 (Real-time data sync)
- 简单的身份验证 (Simple authentication)
- 无需服务器 (Serverless)
- 完美支持静态网站 (Perfect for static sites)

**实施步骤 / Implementation:**
1. 创建 Firebase 项目: https://console.firebase.google.com
2. 启用 Firestore Database
3. 复制 `src/services/firebase.example.ts` 为 `firebase.ts`
4. 填入您的配置信息
5. 安装依赖: `npm install firebase`

### 2. Supabase (备选 / Alternative) 🐘
**优点 / Pros:**
- 开源替代方案 (Open source alternative)
- PostgreSQL 数据库
- 慷慨的免费层级 (Generous free tier)
- 内置身份验证 (Built-in auth)

### 3. Google Sheets API (简单方案 / Simple Solution) 📊
**优点 / Pros:**
- 老师可以直接在 Google Sheets 中管理
- 免费且熟悉的界面
- 通过 API 读取数据

**缺点 / Cons:**
- 不支持实时更新
- 需要定期刷新

## 数据结构设计 / Data Structure

```typescript
// Sessions Collection
{
  id: string,
  date: string, // YYYY-MM-DD
  location: string,
  createdBy: string, // Teacher ID
  createdAt: timestamp,
  classes: [
    {
      id: string,
      type: 'experience' | 'beginner' | 'intermediate',
      startTime: string, // HH:mm
      duration: number, // minutes
      maxParticipants: number,
      instructor: string,
      registrations: [
        {
          name: string,
          timestamp: number
        }
      ]
    }
  ]
}
```

## 功能实现 / Feature Implementation

### 老师功能 / Teacher Features
1. **登录系统** - 使用 Firebase Auth 或简单密码
2. **创建课程** - 在日历上选择日期，填写课程信息
3. **查看报名** - 实时查看每节课的报名情况
4. **管理课程** - 编辑或取消课程

### 学生功能 / Student Features
1. **查看课程** - 浏览月度课程安排
2. **简单报名** - 只需输入姓名即可报名
3. **查看状态** - 查看课程是否已满

## 实施建议 / Implementation Tips

1. **先使用 Firebase 免费层级测试**
   - Firestore: 1GB 存储, 10GB/月 传输
   - 足够支持数百名学生使用

2. **安全规则设置**
   ```javascript
   // Firestore Rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Anyone can read sessions
       match /sessions/{session} {
         allow read: if true;
         // Only authenticated teachers can write
         allow write: if request.auth != null && 
           request.auth.token.role == 'teacher';
       }
     }
   }
   ```

3. **离线支持**
   - Firebase 自动支持离线缓存
   - 学生可以在网络不稳定时查看课程

## 部署到 GitHub Pages

即使添加了 Firebase，网站仍然可以部署到 GitHub Pages：

1. 构建项目: `npm run build`
2. 部署: `npm run deploy`
3. Firebase 会从客户端直接连接

## 联系方式 / Contact

如需技术支持或有疑问，请通过 Contact 页面联系我们。
