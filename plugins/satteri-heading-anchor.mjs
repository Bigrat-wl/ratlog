/**
 * 给正文标题追加可点击的 `#` 锚点，行为和 antfu.me 一致：
 * 锚点定位在标题左侧，平时透明，鼠标悬停或键盘聚焦时显现。
 *
 * 两个关键约束（容易踩坑）：
 *
 * 1. Astro 7 默认的 Sätteri 处理器把「用户插件」排在「heading-ids 插件」之前，
 *    此时标题还没有 id。所以这里自己用 github-slugger（与内置插件同一个库）
 *    算出 id 并写回；内置插件看到已有 id 会直接沿用，深链行为保持一致。
 *
 * 2. 锚点必须以 raw 节点插入，不能是 text 节点。内置 heading-ids 插件会用
 *    `textContent(node)` 读取标题文本并写进 `astro.headings`（TOC 数据源），
 *    如果 `#` 是文本节点，标题文本就会变成「标题#」。raw 节点不参与
 *    textContent 计算，HTML 输出时又原样渲染，正好两头都干净。
 */
import GithubSlugger from 'github-slugger';

/** 把标题 id 安全地放进 href / HTML 属性 */
const escapeAttr = (value) =>
	value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export default function headingAnchor() {
	// 工厂函数每个文档调用一次，天然是「每篇文章一份」计数表
	const slugger = new GithubSlugger();

	return {
		name: 'heading-anchor',
		element: {
			filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
			visit(node, ctx) {
				const existing = node.properties?.id;
				const id =
					typeof existing === 'string' && existing
						? existing
						: slugger.slug(ctx.textContent(node).trim());

				if (!id) return;

				if (typeof existing !== 'string' || !existing) {
					ctx.setProperty(node, 'id', id);
				}

				ctx.appendChild(node, {
					type: 'raw',
					value: `<a href="#${escapeAttr(id)}" class="header-anchor" aria-hidden="true" tabindex="-1">#</a>`,
				});
			},
		},
	};
}
