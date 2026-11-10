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

> 完整的写作指南见 [写文章指南](writing.md)：语法速查、MDX、智能标点的坑、发布前检查清单。

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

| 字段          | 必填 | 说明                                                    |
| ------------- | ---- | ------------------------------------------------------- |
| `title`       | 是   | 文章标题                                                |
| `description` | 是   | 一句话摘要，用于 SEO、RSS 和 Open Graph                  |
| `pubDate`     | 是   | 发布日期，只取「日」，见下方说明                         |
| `updatedDate` | 否   | 最后更新日期，同样只取「日」                             |
| `heroImage`   | 否   | 文章头图，路径相对 Markdown 文件；会渲染在标题下方、并作为分享图 |
| `lang`        | 否   | `zh` / `en` / `ja`，显示在列表上的语言标签，同时决定 `<html lang>` |
| `draft`       | 否   | `true` 时不出现在列表、RSS 和构建结果中                   |

### 关于日期

博客只关心「哪一天」，不关心具体时刻。构建时 `pubDate` / `updatedDate` 会被统一归一到**该日的 UTC 零点**，
页面、列表分组和 RSS 都按 UTC 读取，所以换一台机器、换一个时区构建，日期都不会跳一天。

写法上推荐 `'Nov 07 2026'` 这种不含时区、也不含时刻的形式，只要能被 `Date` 解析就行。
**不要**写 `'2026-11-07'` 这类 ISO 短日期：它会被当成 UTC 零点，而归一化用的是本地年月日，在 UTC 负时区构建会整体提前一天（详见 [写文章指南](writing.md#22-日期怎么写这里有个真坑)）。
同样**不要**写带时刻或时区的字符串（如 `'2026-11-07 08:00 -0800'`），换算后可能在别的时区差一天。

### 关于 `lang`

`lang` 现在同时决定 `<html lang>` 与正文 `<article lang>`：`zh` → `zh-CN`，`ja` → `ja`，`en` → `en`。
不填时按站点定位回落为 `zh-CN`，所以中文文章可以不写这个字段。

头图示例（`src/assets/` 里放你自己的图片，路径相对这篇 Markdown 文件）：

```yaml
heroImage: ../../assets/my-post-cover.jpg
```

头图会以三种宽度（640 / 960 / 1280）输出响应式 `srcset`，并额外压一张 1200px 宽的 PNG 作为 `og:image` 分享图。
`alt` 目前固定为空字符串——纯装饰性头图这样处理是合适的，如果头图承载信息，需要在 `src/layouts/BlogPost.astro` 里补上 `alt`。

阅读时长根据正文自动估算：中文 400 字/分钟，英文 200 词/分钟，最少 1 分钟。

## Markdown 扩展

Astro 7 默认的 Markdown 处理器是 Sätteri，插件通过 `@astrojs/markdown-satteri` 的 `mdastPlugins` / `hastPlugins` 挂载。

当前启用的自定义插件只有一个：`plugins/satteri-heading-anchor.mjs`。
它给正文里的 `h1`–`h6` 生成 slug `id`，并在标题末尾追加一个 `#` 锚点（悬停显现，与 antfu.me 一致）。

内置能力（无需配置即可用）：

| 能力           | 用法                                            |
| -------------- | ----------------------------------------------- |
| GFM            | 表格、任务列表、删除线、自动链接                |
| 脚注           | `脚注[^1]` + `[^1]: 内容`                       |
| 代码高亮       | 围栏代码块，vitesse-light / vitesse-dark 双主题 |
| 智能标点       | `--` → 短横，`...` → 省略号等                   |
| 标题 id / 锚点 | 自动生成，可直接用 `#标题` 深链                  |

想加插件就在 `astro.config.mjs` 的 `satteri({ hastPlugins: [...] })` 里追加，
`hastPlugins` 在「标题 id」之前运行，`mdastPlugins` 在解析阶段运行。


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
| `astro.config.mjs`                | 站点域名、字体、Shiki 代码主题、Markdown 插件 |
| `src/components/Logo.astro`       | 顶部 R 图标                              |
| `public/favicon.svg` / `favicon.ico` | 浏览器标签页图标                      |
| `public/site.webmanifest`         | PWA 名称、图标、主题色                   |
| `src/styles/global.css`           | 配色、排版、动画等全局样式               |

`astro.config.mjs` 的 `site` 会用于 canonical、RSS、Sitemap 和 Open Graph，必须与最终域名一致。

## 链接与路径

站点启用了 `trailingSlash: 'always'`，构建输出为目录形式（`/about/index.html`）。
因此站内链接要写成带尾斜杠的形式：

```html
<a href="/blog/">Blog</a>      <!-- ✅ -->
<a href="/blog">Blog</a>       <!-- ⚠️ 会多一次 301 -->
```

导航栏、文章返回链接、RSS 里的 `link` 都已按此处理。新增页面时注意保持一致。

`public/robots.txt` 里写死了 sitemap 地址，换域名时一并修改。

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

plugins/            # 自定义 Markdown 插件（Sätteri hast / mdast）
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
