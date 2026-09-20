# 照片墙 / Photo galleries

把压缩好的照片放到对应城市文件夹，用 GitHub 网页上传即可。上传时 GitHub 会自动生成 commit；推送到 `main` 后会自动构建并更新网站，**不用改代码**。

| 城市 | 文件夹 |
| --- | --- |
| 上海 | [`galleries/shanghai/`](./shanghai/) |
| 北京 | [`galleries/beijing/`](./beijing/) |
| 东京 | [`galleries/tokyo/`](./tokyo/) |

## 添加照片

1. 打开上表中的城市文件夹。
2. 点击 **Add file → Upload files**。
3. 拖入已经压缩好的照片（`jpg` / `jpeg` / `png` / `webp`）。
4. 在页面底部填写说明，例如 `Add Tokyo gallery photo`，然后 **Commit changes**。
5. 等待仓库的 **Actions** 变成绿色（大约几分钟），刷新网站即可看到新照片。

## 删除或替换照片

- 删除：打开照片 → **Delete this file** → Commit。
- 替换：先删除旧文件，再上传同名或新文件。

## 排序

照片按**文件名**排序（数字会按 1、2、10 而不是 1、10、2）。建议命名：

```text
01_合照.jpg
02_练习.jpg
03_演出.jpg
```

## 照片规格（请先压缩再上传）

- 格式：`jpg` / `png` / `webp`（不要用 iPhone 的 `HEIC`）
- 最长边建议不超过 **1920px**
- 单张建议小于 **1MB**
- 可用预览 App、微信「图片压缩」，或 macOS 预览里导出 JPEG

## 权限说明

操作的人需要对这个仓库有写入权限。如果没有，请把照片发给仓库管理员代为上传，或通过 Pull Request 提交。
