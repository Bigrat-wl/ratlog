# ratlog 使用手册

[← 返回 README](../README.md)

## 环境要求

- Node.js >= 22.23.4
- pnpm

## 常用命令

| 命令            | 作用                     |
| --------------- | ------------------------ |
| `pnpm install`  | 安装依赖                 |
| `pnpm dev`      | 启动开发服务器（4321）   |
| `pnpm build`    | 构建到 `dist/`           |
| `pnpm preview`  | 本地预览构建结果         |

## 写文章

在 `src/content/blog/` 下新建 `.md` 或 `.mdx` 文件：

```md
---
title: '文章标题'
description: '一句话摘要，会用于 SEO 和 RSS'
pubDate: 'Nov 07 2026'
lang: zh
---

正文……
```

### Frontmatter

| 字段          | 必填 | 说明                                              |
| ------------- | ---- | ------------------------------------------------- |
| `title`       | 是   | 文章标题                                          |
| `description` | 是   | 一句话摘要，用于 SEO、RSS 和 Open Graph            |
| `pubDate`     | 是   | 发布日期，可被 `Date` 解析                        |
| `updatedDate` | 否   | 最后更新时间                                      |
| `heroImage`   | 否   | 文章头图，路径相对 Markdown 文件                  |
| `lang`        | 否   | `zh` / `en` / `ja`，显示在列表上的语言标签        |
| `draft`       | 否   | `true` 时不出现在列表、RSS 和构建结果中            |

头图示例：

```yaml
heroImage: ../../assets/blog-placeholder-1.jpg
```

阅读时长根据正文自动估算：中文 400 字/分钟，英文 200 词/分钟，最少 1 分钟。

## 加友链

- 页面：`src/pages/friends.astro`，地址为 `/friends`
- 数据：`src/data/friends.ts`

复制一行改成对方的站点信息：

```ts
export const FRIENDS: FriendLink[] = [
	{
		name: 'Antfu',
		url: 'https://antfu.me',
		description: 'Vue 核心团队成员。',
		avatar: 'https://github.com/antfu.png',
	},
];
```

`avatar` 可选；不填会显示站点名首字母。加完第一条后，页面会自动从空状态切换成卡片网格。

「本站信息」里的链接来自 `astro.config.mjs` 的 `site`，部署前记得改成真实域名。

## 加项目

- 页面：`src/pages/projects.astro`，地址为 `/projects`
- 数据：`src/data/projects.ts`

复制一条改成自己的作品：

```ts
export const PROJECTS: Project[] = [
	{
		name: '项目名',
		description: '一句话说明做了什么。',
		url: 'https://example.com',        // 线上地址，可选
		repo: 'https://github.com/you/repo', // 源码地址，可选
		tags: ['Vue', 'TypeScript'],
		year: '2026',
	},
];
```

`url` 和 `repo` 至少填一个：有 `url` 时标题链接到网站，否则链接到源码；两个都填时卡片底部会同时出现「网站 ↗」和「源码 ↗」。`tags`、`year` 都可选。

## 改站点信息

| 文件                              | 内容                                     |
| --------------------------------- | ---------------------------------------- |
| `src/consts.ts`                   | 站点标题、描述、作者、社交链接、邮箱     |
| `astro.config.mjs`                | 站点域名、字体、Shiki 代码主题           |
| `src/components/Logo.astro`       | 顶部 R 图标                              |
| `public/favicon.svg` / `favicon.ico` | 浏览器标签页图标                      |
| `src/styles/global.css`           | 配色、排版、动画等全局样式               |

`astro.config.mjs` 的 `site` 会用于 canonical、RSS、Sitemap 和 Open Graph，必须与最终域名一致。

## 主题

- 明暗主题由 `<html>` 上的 `dark` class 控制
- 用户选择保存在 localStorage 的 `theme` 键
- 首屏恢复脚本在 `src/components/BaseHead.astro`，用于避免闪烁
- 切换按钮在 `src/components/Header.astro`
- 配色变量在 `src/styles/global.css` 的 `:root` 和 `html.dark`

## 部署

1. 修改 `astro.config.mjs` 里的 `site`
2. 运行 `pnpm build`
3. 把 `dist/` 部署到任意静态托管，例如 Cloudflare Pages、Vercel、Netlify 或对象存储

`dist/` 是纯静态文件，不需要 Node.js 运行时。

## 目录结构

```text
src/
├── components/     # Header、Footer、Logo、Icon、日期
├── content/blog/   # Markdown / MDX 文章
├── data/           # 友链、项目数据
├── layouts/        # BaseLayout、BlogPost
├── pages/          # 首页、/blog、/about、/projects、/friends、RSS、404
├── styles/         # global.css
└── utils/          # 阅读时长估算
```

## 常见问题

### 端口 4321 被占用

换一个端口启动：

```bash
pnpm dev -- --port 4322
```

### 改了图标，浏览器还是旧的

浏览器会单独缓存 favicon。硬刷新，或直接访问 `/favicon.svg?v=2` 确认新图标。

### 文章没有出现在列表里

依次检查：

1. `draft` 是否为 `true`
2. `pubDate` 是否能被 `Date` 解析
3. 文件是否在 `src/content/blog/` 下

### 首屏主题闪烁

`BaseHead.astro` 里的内联脚本必须在样式和正文之前执行，不要把它移到 `body` 末尾。
