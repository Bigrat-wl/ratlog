# 写文章指南

[← 返回 README](../README.md)

这份文档讲的是**怎么给 ratlog 写一篇文章**：文件放哪、头部信息怎么填、正文里哪些语法真的能用、哪些看起来能用其实是个坑，以及常见的报错怎么修。

上手只需要一句话：在 `src/content/blog/` 里新建一个 `.md`（需要写组件时用 `.mdx`），填好 frontmatter，写正文，`pnpm dev` 看效果。

## 目录

1. [新建一篇文章](#1-新建一篇文章) — 文件放哪、URL 怎么来
2. [Frontmatter 字段](#2-frontmatter-字段) — 每个字段的作用与日期坑
3. [正文语法速查](#3-正文语法速查) — 一张表看完什么能用
4. [智能标点](#4-智能标点最大的隐形坑) — **技术写作最容易踩的坑**
5. [代码块](#5-代码块) — 语言名、主题、不能用的花活
6. [图片](#6-图片) — 三种来源与路径规则
7. [标题锚点](#7-标题锚点) — id 怎么生成、怎么引用
8. [GFM 扩展](#8-gfm-扩展语法) — 表格、脚注、任务列表
9. [MDX](#9-mdx什么时候需要) — 什么时候需要、`{}` 的坑
10. [可选语法扩展](#10-可选语法扩展sätteri-features) — 公式、上下标、属性语法
11. [写作约定](#11-写作约定) — 结构、篇幅、description
12. [发布前检查清单](#12-发布前检查清单)
13. [常见报错对照](#13-常见报错对照)
14. [常用片段库](#14-常用片段库) — 直接复制
15. [管线图](#15-一张图记住整条管线)

---

## 1. 新建一篇文章

### 1.1 最小可用的模板

复制下面这段，存成 `src/content/blog/我的文章.md`：

```md
---
title: '文章标题'
description: '一句话摘要，会出现在搜索引擎、RSS 和社交卡片上。'
pubDate: 'Nov 10 2026'
lang: zh
---

正文从这里开始。

## 第一个小节

写点什么。
```

三分钟能看到效果：

```bash
pnpm dev
# 打开 http://localhost:4321/blog
```

### 1.2 文件名决定 URL

| 文件路径 | 生成的地址 |
| --- | --- |
| `src/content/blog/hello-world.md` | `/blog/hello-world/` |
| `src/content/blog/2026/astro-notes.md` | `/blog/2026/astro-notes/` |
| `src/content/blog/中文标题.md` | `/blog/中文标题/` |

规则：

- 文件可以放在子目录里，子目录会变成 URL 的一部分（适合按年归档）。
- 不要用空格。中文文件名能用，但链接里会变成百分号编码，分享出去很难看，建议用英文小写 + 连字符。
- 改文件名 = 改 URL = 旧链接失效。文章发出后就别再改名了。
- 想在不改文件名的前提下换 URL，用 frontmatter 里的 `slug`（见 2.3）。
- 不同子目录下的同名文件没问题（`a/same.md` 和 `b/same.md` 是两篇）。但**两篇文章用了同一个 `slug` 不会报错，后构建的会静默覆盖前一个**，只有一篇能访问到。多个文件手动写 `slug` 时务必唯一。

### 1.3 frontmatter 结束的分隔线不能忘

头部用两行 `---` 夹住，**结尾那一行必须独占一行且不能省**。少了它，整篇文件被当成正文，frontmatter 根本没被解析，构建时会直接报错：

```text
[InvalidContentEntryDataError] blog → xxx data does not match collection schema.
  title**: **title: Required
  description**: **description: Required
  pubDate**: **pubDate: Expected type "date", received "object"
```

看到这三个字段一起「Required」，先回头检查是不是少写了结尾的 `---`（而不是去补字段）。

---

## 2. Frontmatter 字段

本站的 schema 定义在 `src/content.config.ts`，**所有字段都会被强校验**：写错字段名、漏必填项、类型不对，`pnpm build` 直接失败（不是警告，是报错）。

### 2.1 字段一览

| 字段 | 必填 | 类型 | 作用 |
| --- | --- | --- | --- |
| `title` | ✅ | 字符串 | 文章标题，渲染成页面 `<h1>`、`<title>`、RSS 标题 |
| `description` | ✅ | 字符串 | 摘要，用于 `<meta name="description">`、OG 卡片、RSS |
| `pubDate` | ✅ | 日期 | 发布日期，列表按它倒序排 |
| `updatedDate` | ❌ | 日期 | 最后更新时间，填了会额外显示「更新于 …」 |
| `heroImage` | ❌ | 本地图片路径 | 头图，显示在标题下方，同时作为社交分享图 |
| `lang` | ❌ | `zh` / `en` / `ja` | 语言标签，在列表和标题上方显示小徽章 |
| `draft` | ❌ | 布尔 | `true` 时完全隐藏（列表、RSS、页面都不生成） |

一个字段都不多、一个字段也不少——`tags`、`author`、`cover` 这类常见字段**没有**定义，写了会被 schema 静默丢掉，别指望它们生效。

### 2.2 日期怎么写（这里有个真坑）

日期会先被 `Date` 解析，再**归一化到「当地时间的年月日」对应的 UTC 零点**。所以写法不同，跨时区构建的结果会不同。

推荐这两种，任何时区都稳定：

```yaml
pubDate: 'Nov 10 2026'      # 推荐，和现有文章一致
pubDate: '2026/11/10'       # 也可以
```

**不要写 ISO 短日期**：

```yaml
pubDate: '2026-11-10'       # ⚠️ 危险
```

因为 `2026-11-10` 会被当成 UTC 零点，而 `dateOnly` 转换用的是本地 `getFullYear()/getMonth()/getDate()`。在 UTC 负时区（比如美国）构建，日期会变成 **11 月 9 日**，列表、RSS、`<time>` 全部提前一天。本地看不出来，等 CI 跑在别的时区就会翻车。

同理，也别手写时刻和时区：

```yaml
pubDate: '2026-11-10 08:00 -0800'   # ⚠️ 换算后在上海会变成 11 月 11 日
```

带时刻的写法会先被换算成 UTC，再取本地年月日，所以同一个字符串在不同时区构建可能差一天。**只写日期，不写时刻**，是唯一稳妥的做法。

`updatedDate` 规则完全一样。

### 2.3 `slug`：换 URL 不改文件名

```yaml
slug: 'my-custom-url'
```

生成 `/blog/my-custom-url/`。`slug` 不在 schema 里，但加载器会优先读它，所以是能用的。建议只在「已经发出去、又想改文件名」的时候用。

### 2.4 `lang` 的隐藏作用

它不只是列表上的小标签，还会决定 `<html lang>`：`zh` → `zh-CN`，`en` → `en`，`ja` → `ja`。**不填时按 `zh-CN` 处理**（站点以中文为主）。

- 中文文章：写 `lang: zh`。
- 英文文章：写 `lang: en`，否则浏览器的拼写检查、断行与连字符规则会按中文走。
- 中日混排的文章：挑一个主语言填。

它不影响字体和排版宽度，只影响浏览器对这段文字的「理解」。

### 2.5 `draft`：草稿

```yaml
draft: true
```

效果比想象中彻底：

- 不出现在 `/blog` 列表
- 不进 `rss.xml`、`sitemap`
- **不生成页面**，`pnpm dev` 里访问 `/blog/文件名/` 也是 404

所以要预览草稿，暂时把 `draft` 删掉（或改成 `false`），发布时再删。别指望「dev 里能看、线上不出现」。

### 2.6 头图 `heroImage`

```yaml
heroImage: '../../assets/my-post-cover.jpg'
```

要点：

- 路径**相对于这篇 Markdown 文件**。文章在 `src/content/blog/` 下，图片在 `src/assets/` 下，所以是 `../../assets/xxx.jpg`。
- 必须是 `src/` 里的本地图片，会被 Astro 自动压成 webp、生成多种宽度、补上宽高。放 `public/` 里的图不行，走 HTTP 的远程图也不行。
- 头图的 `alt` 是空的（当装饰处理），**不支持写图注**。
- 同一张图会同时用于页面头图和 OG 分享图（OG 会额外压成 1200px 宽的 PNG）。

⚠️ **`heroImage` 填远程 URL 会让构建失败**，报 `MissingImageDimension`。原因同上：生成分享图时必须知道宽高，远程图推断不出来。

---

## 3. 正文语法速查

本站的 Markdown 由 **Sätteri** 处理（Astro 7 的默认处理器，不再走 remark/rehype 那条链）。默认开启 **GFM + 智能标点**，其余扩展默认关闭。

下面这张表是**实际构建验证过的**，可以直接照着写。

| 功能 | 写法 | 状态 |
| --- | --- | --- |
| 二级标题 | `## 标题` | ✅ 自动生成 id + 悬停锚点 |
| 粗体 / 斜体 | `**粗**` / `*斜*` | ✅ |
| 删除线 | `~~删掉~~` | ✅ GFM |
| 行内代码 | `` `code` `` | ✅ 不参与智能标点转换 |
| 代码块 | 三反引号 + 语言名 | ✅ Shiki 高亮，明暗双主题 |
| 链接 | `[文字](/blog/xxx/)` | ✅ |
| 自动链接 | `https://example.com` | ✅ GFM 自动识别 |
| 邮箱 | `a@b.com` | ✅ 自动转 `mailto:` |
| 图片 | `![alt](../../assets/x.jpg)` | ✅ 自动优化 |
| 引用 | `> 引用` | ✅ 正体 + 左边框，可嵌套 |
| 无序列表 | `- 项` | ✅ 自定义小圆点 |
| 有序列表 | `1. 项` | ✅ 自定义序号 |
| 嵌套列表 | 缩进 2–4 空格 | ✅ 可混排 |
| 表格 | GFM 表格 | ✅ 支持 `:--` 对齐 |
| 任务列表 | `- [ ]` / `- [x]` | ✅ 自动渲染复选框 |
| 脚注 | `文字[^1]` + `[^1]: 注释` | ✅ 文末自动生成 |
| 分隔线 | `---` | ✅ 但前面必须空一行，否则会把上一行变成标题（见 3.3） |
| 换行 | 行尾两个空格，或行尾 `\` | ✅ |
| 原始 HTML | `<mark>` `<kbd>` `<details>` 等 | ✅ 原样输出 |
| 数学公式 | `$x$` / `$$x$$` | ❌ 默认关闭（见 10.1） |
| 上下标 | `x^2^` / `H~2~O` | ❌ 默认关闭，用 HTML 替代（见 8.5） |
| 定义列表 | `术语` + `: 解释` | ❌ 默认关闭（见 10.3） |
| 属性语法 | `## 标题 {#id .class}` | ❌ 默认关闭（见 10.4） |
| 容器指令 | `:::note` | ❌ 默认关闭，且开启后表现异常（见 10.5） |

### 3.1 标题层级

页面的 `<h1>` 由 frontmatter 的 `title` 渲染，**正文里不要写 `# 一级标题`**，否则一篇页面出现两个 h1，SEO 和目录结构都会乱。

正文从 `##` 开始：

```md
## 大节

### 小节

#### 更细的层级（少用）
```

样式上 `h3` 带 70% 透明度、`h6` 是大写小字，视觉层级是设计好的，跳级（`##` 直接到 `####`）会让排版看着很怪。

### 3.2 换行与段落

Markdown 里单个回车**不会**换行，只会被当成空格：

```md
第一行
第二行
```

渲染结果是一段「第一行 第二行」。要硬换行：

```md
第一行，行尾两个空格··
第二行

第一行，行尾反斜杠\
第二行
```

段落之间空一行就够了。中文正文里长段落读起来累，多分段。

### 3.3 分隔线必须单独成段

`---` 只有在**上面空一行**时才是分隔线。紧贴在文字下面会被当成「setext 标题」的下划线，把那一行变成 `##`：

```md
这是一段文字
---

下一段
```

上面这段会渲染成一个标题「这是一段文字」加一行普通文字，而不是「文字 — 分隔线 — 文字」。正确写法：

```md
这是一段文字

---

下一段
```

---

## 4. 智能标点：最大的隐形坑

**默认开启 smart punctuation**，会在渲染时把一批 ASCII 字符换成「好看」的排版字符。这在散文里是加分项，在技术文章里是灾难。

| 你写的（不加反引号时） | 渲染成 | 后果 |
| --- | --- | --- |
| `"文本"` | “文本” | 复制命令时变成弯引号，shell 报错 |
| `'文本'` | ‘文本’ | 同上 |
| `can't` | can’t | 搜索 `can't` 搜不到这一条 |
| `--` | –（en dash） | **`--port` 变成 `–port`，参数直接失效** |
| `---` | —（em dash） | 同上，且 `--flag` 这类会被吃掉 |
| `...` | … | 一般无伤 |
| `1--2` | 1–2 | 想表达范围时是好事，想表示两个减号时是灾难 |

**好消息**：代码块和行内代码**不受影响**。所以技术内容记住一条铁律：

> 凡是会被读者复制去执行的东西，一律包进反引号或代码块。

```md
✅ 启动端口：`pnpm dev -- --port 4322`
❌ 启动端口：pnpm dev -- --port 4322
```

第二行在页面上会渲染成 `pnpm dev – –port 4322`，读者复制过去就是错的。

纯散文里想避免这些替换，也只能靠反引号包一下，或者**全局关掉**智能标点。

### 4.1 全局关掉 / 只关破折号

改 `astro.config.mjs` 里 `satteri()` 的 `features`：

```js
// 全部关掉：引号、破折号、省略号都不再转换
processor: satteri({ hastPlugins: [headingAnchor], features: { smartPunctuation: false } }),

// 只关破折号：-- 和 --- 保持原样，引号仍然变弯
processor: satteri({ hastPlugins: [headingAnchor], features: { smartPunctuation: { dashes: false } } }),
```

第二种是**技术博客最实用的折中**：既保留中文排版好看的引号，又不会把 `--flag` 吃掉。改完记得跑一次 `pnpm build`，然后挑一篇命令多的文章肉眼验一下。

目前的取舍是保留全部智能标点，正文里技术名词一律用代码标记——如果你更希望「随便写也不会被改」，那就换成 `dashes: false`。

---

## 5. 代码块

### 5.1 基本写法

````md
```ts
const hello = (name: string) => `Hello, ${name}!`
```
````

语言名写在第一行反引号后面，用来决定高亮语法。写对了就有颜色，写错了（或者不写）会退化成纯文本，**不报错**：

```text
data-language="plaintext"
```

常用语言名：`ts` `tsx` `js` `jsx` `json` `jsonc` `html` `css` `scss` `vue` `astro` `md` `mdx` `bash` `sh` `shell` `yaml` `toml` `diff` `text` `python` `rust` `go` `sql` `dockerfile` `ini` `nginx`。

### 5.2 主题

配色在 `astro.config.mjs` 里配置，明暗各一套，跟随站点主题自动切换，写文章时不用管：

```js
themes: { light: 'vitesse-light', dark: 'vitesse-dark' }
```

### 5.3 不能用的花活

这些语法在别的博客里很常见，**本站不生效**（不会报错，但也别期待效果）：

| 写法（在代码块首行的语言名后面） | 期望效果 | 本站实际 |
| --- | --- | --- |
| 加 `title="utils.ts"` | 代码块顶部显示文件名 | title 被忽略 |
| 加 `{2-3}` | 高亮第 2–3 行 | 没反应 |
| 加 `showLineNumbers` | 显示行号 | 没反应 |

需要的话得自己加 Shiki transformer，改 `astro.config.mjs` 的 `shikiConfig.transformers`。当前风格是极简，没做。

### 5.4 代码块里套围栏

文章里要演示「三反引号」本身时，外面用四个反引号包住；要演示「四个反引号」就用五个，以此类推。

`````md
````md
```ts
code
```
````
`````

### 5.5 横向溢出

`wrap: false`，长行不折行，超出容器横向滚动。所以代码列宽控制在 **约 70 个字符**以内，手机上好读。

```bash
# 太长，手机上要横拖
docker run --rm -it -v $(pwd):/app -w /app -p 3000:3000 node:22-alpine sh

# 拆开更好
docker run --rm -it \
  -v $(pwd):/app -w /app \
  -p 3000:3000 \
  node:22-alpine sh
```

---

## 6. 图片

### 6.1 三种来源

| 写法 | 处理方式 | 适用 |
| --- | --- | --- |
| `![alt](../../assets/x.jpg)` | 构建时压 webp、生成宽度、补宽高 | **首选**，正文图 |
| `![alt](/icon-192.png)` | 原样输出，不优化 | `public/` 里的固定资源 |
| `![alt](https://x.com/a.png)` | 原样输出，不优化 | 外链图，注意防盗链和失效 |

### 6.2 相对路径是相对 Markdown 文件

```md
![示意图](../../assets/diagram.png)
```

- 文章在 `src/content/blog/`，图在 `src/assets/` → `../../assets/`
- 文章在 `src/content/blog/2026/` → `../../../assets/`

**路径写错不会静默失败，构建直接报错**：

```text
[ImageNotFound] Could not find requested image `./nope.png`. Does it exist?
```

这其实是好事，比上线后图片 404 强。但意味着**在 CI 里图没提交上去，整个站点都发不出去**。

反过来，`public/` 和远程图片路径写错**不会报错**，只会在页面上裂图，记得自己看一眼。

### 6.3 图片尺寸与排版

正文图默认 `max-width: 100%`、居中、圆角。控制显示尺寸有两种方式：

```md
<!-- 方式一：Markdown 语法，只支持 title -->
![alt](../../assets/x.jpg "鼠标悬停显示的文字")

<!-- 方式二：原始 HTML，可控制宽高（但不会被优化） -->
<img src="../../assets/x.jpg" alt="alt" width="480">
```

用 HTML 的 `<img>` 引用 `src/assets` 里的相对路径时，图片**不经过优化管线**，也不会被复制到 `dist/`，容易裂图。要控宽，优先用 Markdown 语法 + CSS，或者用 `.mdx` 里的 `<Image>`（见 9.4）。

### 6.4 图注

Markdown 没有图注语法。要图注就用 `figure`：

```html
<figure>
  <img src="https://example.com/x.png" alt="截图" />
  <figcaption>图 1：构建流程</figcaption>
</figure>
```

`figcaption` 有专门样式（灰、小字）。注意 `figure` 内的 `<img>` 用远程或 `public/` 路径比较稳。

### 6.5 视频

```html
<video src="https://example.com/demo.mp4" controls></video>
```

`video` 和 `img` 共用一套样式（居中、圆角、最大宽度）。

---

## 7. 标题锚点

每个 `##`、`###` 标题都会自动生成 `id`，并且标题左侧有一个 `#`，鼠标悬停或键盘聚焦时出现，点一下 URL 就带上锚点。

### 7.1 id 怎么来的

规则接近 github-slugger：

- 转小写
- 去掉标点、空格转连字符
- **保留中文**、字母、数字、下划线
- 重名的自动加序号：`repeated`、`repeated-1`

例：

| 标题 | id |
| --- | --- |
| `## 为什么要写博客` | `为什么要写博客` |
| `## A & B 测试 (bracket) 【全角】` | `a-b-测试-bracket-全角` |
| `## 标题：带标点！Question?` | `标题带标点question` |

注意 `&`、括号、全角括号都被去掉了，所以「手写锚点」时很容易少写一段——以浏览器地址栏里的为准。

### 7.2 引用某个小节

直接把页面上的 `#` 链接复制下来，或者手写：

```md
见 [智能标点那一节](#4-智能标点最大的隐形坑)
```

注意中文锚点会被 URL 编码成 `%E6%99%BA...`，**复制浏览器地址栏最保险**。数字、标点、括号都会被处理（`## 4. 智能标点：最大的隐形坑` → `4-智能标点最大的隐形坑`），所以「手写锚点」很容易对不上——写完点一下试试。

---

## 8. GFM 扩展语法

### 8.1 表格

```md
| 命令 | 作用 | 耗时 |
| :--- | :---: | ---: |
| `pnpm dev` | 开发服务器 | 1s |
| `pnpm build` | 构建 | 2s |
```

- 第二行必须有，决定对齐（`:---` 左、`:---:` 中、`---:` 右）。
- 表格首列不缩进、末列不留白，样式已经处理了。
- 单元格里的竖线要转义成 `\|`，即使是行内代码里也一样。

表格宽度是 100%，列多会挤，超过 5 列考虑改成列表。

### 8.2 任务列表

```md
- [ ] 待办
- [x] 已完成
```

能用。复选框由 GFM 生成，样式里已排除任务列表的默认圆点，不会再和复选框重叠。

### 8.3 脚注

```md
React 的调度器分两套[^1]。

[^1]: 并发模式和同步模式。
```

渲染效果：正文出现上标序号，文末自动生成脚注区，点击可来回跳转。

注意：

- 文末那块 `Footnotes` 标题用了 `sr-only`（屏幕阅读器可见，视觉隐藏），**且文案是英文的**。要中文化得配 processor 的 `gfm: { footnotes: { label: '注释' } }`。
- 脚注区没有单独定制样式，就是普通列表，读起来一般。注释多的话，不如直接在下面写一段。

### 8.4 引用

```md
> 引用内容，可以**加粗**。
>
> — 出处

> 外层
> > 内层
```

正体 + 左边框，内容压到 70% 透明度，支持嵌套。**没有** `> [!NOTE]` 那种 alert 语法（那是 GitHub 的扩展，这里不认）。

### 8.5 上下标没有语法，用 HTML

`x^2^`、`H~2~O` 默认是**普通文本**（`~` 还可能被当成删除线的一部分）。要上下标就直接写 HTML：

```html
H<sub>2</sub>O
X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>
```

其他好用的原生标签，直接写就行，**没有额外样式**（浏览器默认样式）：

```html
<abbr title="Graphics Interchange Format">GIF</abbr>
按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制
<mark>高亮</mark>
<small>小字</small>
```

### 8.6 折叠块

```html
<details>
<summary>点开看完整输出</summary>

里面可以写 **Markdown**，前后各留一个空行。

</details>
```

在 `.md` 里，块级 HTML 内部的内容**默认不解析 Markdown**（会原样输出）。上面能生效是因为 `<details>` 里留了空行——块级 HTML 内部空行分隔的部分仍会走 Markdown。想要稳妥，可以改用 `.mdx`。

---

## 9. MDX：什么时候需要

`.md` 只会输出静态 HTML。以下需求必须用 `.mdx`：

- 想用站点里的组件（比如 `<Icon>`）
- 想要交互（按钮、图表、折叠动画）
- 想用 `<Image>` 精确控制图片尺寸和多分辨率
- 想写「模板 / 变量」式的内容

### 9.1 换文件后缀就行

`我的文章.md` → `我的文章.mdx`，frontmatter 和正文写法完全一样。旧链接不变（URL 只看文件名）。

### 9.2 主要区别：`{}` 和 `<` 都是 JS

| 在 `.md` 里 | 在 `.mdx` 里 |
| --- | --- |
| `{花括号}` 原样显示 | ❌ 被当 JS 表达式，报错或整段消失 |
| `` `{` `` 行内代码里 | ✅ 行内代码里安全 |
| `<mark>x</mark>` 原样输出 | 被当 JSX 元素，**必须闭合**，否则报错 |
| `**粗体**` | 一样 |

MDX 里写花括号，用反斜杠转义：

```mdx
花括号：\{ 这样写 \} 就安全了
```

写 `<` 开头的普通文本：

```mdx
用 &lt;div&gt; 表示标签
用 {'<div>'} 也可以
```

### 9.3 用组件

```mdx
import Icon from '../../components/Icon.astro';

<Icon name="github" size={32} />
```

`src/components/` 下的组件都能这样引（`Icon` 支持 `github` / `rss` / `sun` / `moon` / `arrow-up` / `article` / `user` / `projects` / `link` / `mail`）。

路径规则同图片：相对当前 `.mdx` 文件。组件里带 `<script>` 的话，注意 Astro 的 `client:*` 指令——不加指令默认不打包 JS，交互不会生效。

### 9.4 用 `<Image>` 控制图片

```mdx
import { Image } from 'astro:assets';
import pic from '../../assets/screenshot.png';

<Image src={pic} alt="截图" width={720} />
```

这个会走优化管线（webp、宽高），是正文里要精确控宽时的正确姿势。

### 9.5 在 MDX 里使用 frontmatter 值

```mdx
本篇标题是：{frontmatter.title}
```

其他字段同理：`{frontmatter.pubDate}`、`{frontmatter.description}`。

### 9.6 MDX 的空白行规则

```mdx
<div class="box">

**这行是 Markdown，会解析**

</div>
```

JSX 块内部**不写空行就不解析 Markdown**，会原样当文本。这个坑和 `.md` 里的块级 HTML 一样，但更容易踩，因为 MDX 里你会更频繁地写 JSX。

---

## 10. 可选语法扩展（Sätteri features）

Astro 7 的默认处理器 Sätteri 支持一批「默认关闭」的语法。开关在 `astro.config.mjs`：

```js
processor: satteri({
  features: {
    math: true,
    attributes: true,
    superscript: true,
    subscript: true,
    definitionList: true,
  },
  hastPlugins: [headingAnchor],
}),
```

**默认全关是有理由的**：开了也不会自动有样式，而且部分语法会和正文「抢字符」。下面逐条说清楚代价。

### 10.1 数学公式 `math`

开启后：

```md
行内 $E = mc^2$

$$
a^2 + b^2 = c^2
$$
```

输出的是 `<code class="language-math math-inline">` 和 `<pre><code class="language-math math-display">`，**不含 KaTeX/MathJax 的排版**——渲染出来就是带原样 TeX 源码的代码块。要真正显示公式，还得引入 KaTeX 并写样式。

⚠️ 更麻烦的是 `$` 是日常字符：开启后 `$5 and $10` 会被吃成一段行内数学。真要开，建议配 `math: { singleDollarTextMath: false }`，只认 `$$...$$`。

**结论**：写算法文之前想清楚，为了公式值不值得引入整套 KaTeX。多数情况下贴截图或写伪代码更省事。

### 10.2 上下标 `superscript` / `subscript`

开启后 `x^2^` → `x<sup>2</sup>`，`H~2~O` → `H<sub>2</sub>O`。

但 `~` 同时是删除线，`^` 偶尔出现在正则、异或运算里，容易误伤。**用 HTML 的 `<sup>` / `<sub>` 更安全**，效果完全一样。

### 10.3 定义列表 `definitionList`

```md
术语
: 术语的解释
```

输出 `<dl>/<dt>/<dd>`。样式没定制，就是浏览器默认样子。需要「术语表」时可以开，但为了一两处开全局开关不划算。

### 10.4 属性语法 `attributes`

开启后，允许给任意元素加 class / id：

```md
## 自定义锚点 {#custom-id}

*斜体*{.highlight}

> 引用 {.note}
```

代码块上的 `{1,3-4}` 高亮**不会**因此生效（那需要 Shiki transformer，两回事）。

适合做「同一篇文章里给某段加特殊样式」的场景。但注意它和 `{#id}` 手写锚点配合时，会覆盖自动 id 规则，手写 id 要自己保证唯一。

⚠️ **关闭时（当前状态）这些语法不会报错，只会变成可见的字面文本**：标题会渲染成「标题 {#custom-id .cls}」，`*斜体*{.hl}` 后面会跟着一个 `{.hl}`。临时写个 id 不会被发现，直到你看到页面上多了一串花括号。

### 10.5 容器指令 `directive`（不建议开）

```md
:::note
内容
:::
```

实测**开启后整块内容会消失**（在当前版本的 Sätteri + Astro 组合下输出为空），不是「显示但没样式」，而是直接没了。别开。（关闭时也不是「不生效」——`:::note` 会原样当正文显示出来。）

想要提示块，用引用 + emoji 就够：

```md
> ⚠️ **注意**：删除 `dist/` 后需要重新构建。
```

### 10.6 其他

- `wikilinks`：`[[链接]]` 转成 `<a href="链接">`。注意它**不会**去查内容集合里有没有这篇文章，就是拼了个相对链接，写错了照样 404。
- `gfm.footnotes.label`：把脚注区的 `Footnotes` 改成本地化文案，比如 `gfm: { footnotes: { label: '注释' } }`。
- `rawHtml`：把正文里的原始 HTML 解析成结构化节点（默认原样透传）。本站的 `<details>`、`<figure>` 用法不需要它。

完整清单看 `node_modules/satteri/dist/compile-types.d.ts` 里的 `Features` 接口。

---

## 11. 写作约定

这一节不是语法，是让整站读起来一致的一些建议。

### 11.1 结构

- **开头两句话交代「这篇讲什么、读完能拿到什么」**，不要铺垫。
- 一节一个主题，`##` 控制在 3–6 个，太碎像流水账。
- 技术文按「问题 → 过程 → 结论」写，别按时间顺序写「我先试了 A 又试了 B」——除非踩坑过程本身就是内容。
- 结尾不需要「以上就是全部内容，希望对你有所帮助」。写一句真正的小结，或者干脆停在最后一段。

### 11.2 篇幅

- 阅读时长由 `src/utils/reading-time.ts` 估算：**中文 400 字/分钟，英文 200 词/分钟**，最少 1 分钟。
- 列表页显示这个数字，写出来会是 `· 3min`。
- 1000–3000 字是最舒服的区间。超过 5000 字考虑拆成系列，标题加 `（一）`。

### 11.3 `description` 要认真写

它会被三处消费：

1. 搜索结果里的摘要
2. 社交分享卡片的描述
3. RSS 阅读器里的预览

建议 50–120 字，说清「这篇解决了什么问题」，别写「本文介绍了……」这种空话。**不要在里面写没加引号的冒号**，YAML 会解析失败：

```yaml
description: '踩坑记录：Astro 7 的默认处理器变了'   # ✅
description: 踩坑记录：Astro 7 的默认处理器变了     # ❌ 构建报错
```

（含 `:`、`#`、引号、`{`、`[` 开头的值，一律用单引号包起来。）

### 11.4 代码与命令

- 所有命令、路径、字段名、函数名，都用反引号。
- 有输出的命令，把关键输出贴出来（截断到 10 行内），读者能对照自己是否成功。
- 报错信息贴**原文**，别翻译，别只贴最后一行。
- 涉及版本时写清版本号：Astro 7 和 Astro 4 的 Markdown 行为差别很大。

### 11.5 中英文混排

- 中文和英文/数字之间留一个空格：`用 Astro 构建`，不是 `用Astro构建`。
- 全角标点用中文标点，代码里用半角。
- 专有名词保留原名（Astro、Markdown、Shiki），别硬翻译。

### 11.6 语言标签

中文文章标 `lang: zh`，英文标 `en`，日文标 `ja`。混写以主要语言为准。这个标签会显示在列表和文章标题上方，别乱标。

---

## 12. 发布前检查清单

```bash
pnpm build      # 必须通过；内容错误会在这里暴露
pnpm preview    # 本地看构建产物，确认样式和链接
```

- [ ] `title` / `description` / `pubDate` 三个必填项都在，日期不是 `2026-11-10` 这种 ISO 短格式
- [ ] `draft` 已删除或为 `false`
- [ ] 文件名是英文小写 + 连字符，没有空格
- [ ] 正文没有 `# 一级标题`（从 `##` 开始）
- [ ] 所有命令都在代码块或行内代码里（防止 `--` 变成 `–`）
- [ ] 站内链接以 `/` 结尾（`/blog/xxx/`），不是 `xxx.md`
- [ ] 图片用的是 `../../assets/` 相对路径，且文件真的在仓库里
- [ ] `heroImage` 是本地图，不是 URL
- [ ] 手机上过一遍：表格不挤、代码块不溢出让整页横滚
- [ ] `pnpm build` 无报错、无新增警告

---

## 13. 常见报错对照

| 报错 | 原因 | 怎么修 |
| --- | --- | --- |
| `InvalidContentEntryDataError` + `description: Required` | 漏了必填字段 | 补 `description` |
| `InvalidContentEntryDataError` + `pubDate: Expected type "date"` | 日期写成了无法解析的字符串 | 改成 `'Nov 10 2026'` |
| YAML 解析错误，指向 frontmatter 某行 | 值里有未加引号的 `:` | 整个值用单引号包起来 |
| `ImageNotFound: Could not find requested image` | 图片相对路径写错 | 数清 `../` 的层数，确认文件存在 |
| `MissingImageDimension` | `heroImage` 用了远程 URL | 换成 `src/assets/` 里的本地图 |
| 三个必填字段一起报 `Required` / `received "object"` | frontmatter 结尾的 `---` 漏了，整个文件被当正文 | 补上结尾分隔线（见 1.3） |
| 文章不出现在列表 | `draft: true` / 日期解析失败 / 文件不在 `src/content/blog/` | 逐项排查 |
| 中文标点变成英文弯引号、命令参数带 `–` | 智能标点 | 技术内容包反引号（见第 4 节） |
| 构建报 `@astrojs/markdown-remark` 未安装 | 用了 `markdown.remarkPlugins` / `rehypePlugins` 旧写法 | 改走 `satteri({ hastPlugins/mdastPlugins })` |
| MDX 里 `{` 报错 | MDX 把花括号当 JS | 写成 `\{` 或 `{'{'}` |
| 站内链接 404 | 写了 `xxx.md` 或漏了结尾 `/` | 改成 `/blog/xxx/` |

---

## 14. 常用片段库

直接复制。

### 14.1 文章骨架

```md
---
title: '标题'
description: '一句话说清这篇文章解决什么问题。'
pubDate: 'Nov 10 2026'
lang: zh
---

开头两句话：这篇讲什么、读完能拿到什么。

## 背景

## 做法

## 结论
```

### 14.2 带更新时间的旧文

```md
---
title: '标题'
description: '摘要'
pubDate: 'Mar 02 2026'
updatedDate: 'Nov 10 2026'
lang: zh
---
```

页面上会显示「Mar 2, 2026 · 5min · 更新于 Nov 10, 2026」。

### 14.3 提示块（替代没有的 alert 语法）

```md
> 💡 **提示**：可以先跑 `pnpm build` 看有没有类型错误。

> ⚠️ **注意**：这一步会删除 `dist/`。

> 🚫 **不要这样做**：直接改 `dist/` 里的文件，下次构建就没了。
```

### 14.4 命令 + 输出

````md
```bash
pnpm build
```

```text
[build] 10 page(s) built in 1.52s
[build] Complete!
```
````

### 14.5 前后对比

```md
| | 之前 | 之后 |
| --- | --- | --- |
| 处理器 | remark | Sätteri |
| 公式 | 插件支持 | 默认关闭 |
```

### 14.6 折叠长日志

````html
<details>
<summary>展开完整报错</summary>

```text
...几十行...
```

</details>
````

### 14.7 图片 + 图注

```html
<figure>
  <img src="https://example.com/screenshot.png" alt="构建流程截图" />
  <figcaption>图 1：从 Markdown 到 HTML 的管线</figcaption>
</figure>
```

### 14.8 脚注

```md
Astro 7 默认使用 Sätteri[^1]。

[^1]: 一个 Rust + WASM 实现的 Markdown 处理器。
```

### 14.9 可交互示例（MDX）

```mdx
---
title: '带交互的文章'
description: '演示 MDX 组件。'
pubDate: 'Nov 10 2026'
---

import Icon from '../../components/Icon.astro';

<Icon name="projects" size={48} />
```

---

## 15. 一张图记住整条管线

```text
src/content/blog/xxx.md
        │
        ├─ frontmatter ──→ content.config.ts 校验 ──→ 标题/日期/摘要/语言
        │                                        └─ heroImage ──→ astro:assets 压缩
        │
        └─ 正文 ──→ Sätteri 解析
                     ├─ GFM（表格/脚注/任务列表/删除线）  默认开
                     ├─ 智能标点                          默认开 ⚠️
                     ├─ 标题 id + 锚点插件
                     ├─ Shiki 双主题高亮（vitesse-light/dark）
                     └─ 相对图片 ──→ astro:assets 压 webp
                              │
                              ▼
                    /blog/xxx/  ·  rss.xml（全文）  ·  sitemap
```

---

相关文档：

- [使用手册](usage.md)：友链、项目页、站点信息、部署
- [README](../README.md)：项目概览与命令
