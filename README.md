# ratlog

一个使用 [Astro](https://astro.build) 构建的个人博客。极简排版、65ch 正文宽度、明暗主题、年份分组文章列表，视觉风格参考 [antfu.me](https://antfu.me)。

## 特性

- 纯静态输出，构建快，部署简单
- Inter + DM Mono 字体，正文 65ch
- 明暗主题切换，localStorage 记忆，无闪烁
- 文章按年份分组，支持中文 / 英文 / 日文标签
- 自动估算阅读时长
- RSS、Sitemap、代码高亮
- 友链页与响应式布局
- 项目页展示作品（`/projects`）

## 快速开始

```bash
pnpm install
pnpm dev
```

打开 <http://localhost:4321> 即可预览。

## 文档

- [使用手册](docs/usage.md)：加友链、加项目、改站点信息、部署
- [写文章指南](docs/writing.md)：frontmatter 字段、Markdown/MDX 语法、常见坑与报错

## 技术栈

Astro · TypeScript · Shiki（vitesse-light / vitesse-dark）· Astro Fonts

## 链接

- GitHub：<https://github.com/Bigrat-wl>
- 友链页：`/friends`
- 项目页：`/projects`

## 许可

文章内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)。
