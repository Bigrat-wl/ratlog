# ratlog

个人博客，使用 [Astro](https://astro.build) 构建。视觉风格参考 [antfu.me](https://antfu.me)：极简排版、65ch 正文宽度、明暗主题、年份分组文章列表。

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

可选字段：

| 字段          | 说明                                        |
| ------------- | ------------------------------------------- |
| `updatedDate` | 最后更新时间                                |
| `lang`        | `zh` / `en` / `ja`，显示在列表上的语言标签  |
| `draft`       | `true` 时不会出现在列表、RSS 和构建结果中    |

阅读时长会根据正文自动估算（中文 400 字/分钟，英文 200 词/分钟）。

## 加友链

编辑 `src/data/friends.ts`，复制一行改成对方的站点信息：

```ts
{ name: 'Antfu', url: 'https://antfu.me', description: 'Vue 核心团队成员。' }
```

`avatar` 可选，不填会显示站点名首字母。页面在 `/friends`，顶部导航已有入口。

## 改站点信息

- `src/consts.ts`：站点标题、描述、作者、社交链接、邮箱
- `astro.config.mjs`：站点域名、字体、代码高亮主题
- `src/components/Logo.astro` 和 `public/favicon.svg`：站点图标
- `src/styles/global.css`：配色、排版、动画等全局样式

## 常用命令

| 命令           | 作用                       |
| -------------- | -------------------------- |
| `pnpm install` | 安装依赖                   |
| `pnpm dev`     | 启动开发服务器（4321）     |
| `pnpm build`   | 构建到 `dist/`             |
| `pnpm preview` | 本地预览构建结果           |

## 结构

```text
src/
├── components/     # Header、Footer、Logo、Icon、日期
├── content/blog/   # Markdown / MDX 文章
├── data/           # 友链数据
├── layouts/        # BaseLayout、BlogPost
├── pages/          # 首页、/blog、/about、/friends、RSS、404
├── styles/         # global.css
└── utils/          # 阅读时长估算
```
