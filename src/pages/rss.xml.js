import { getCollection, render } from 'astro:content';
import rss from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer as getMdxRenderer } from '@astrojs/mdx/container-renderer';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

/**
 * RSS 输出全文，而不只是 description。
 * 这需要在端点里把文章渲染成 HTML，所以走 Astro 的容器 API。
 */
export async function GET(context) {
	const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	const site = context.site ?? new URL('https://blog.ratzu.art');
	const origin = new URL(site).origin;

	const renderers = await loadRenderers([getMdxRenderer()]);
	const container = await AstroContainer.create({ renderers });

	const items = [];
	for (const post of posts) {
		const { Content } = await render(post);
		// 正文里的站内图片是 `/xxx` 形式，阅读器里没有 base，必须补成绝对地址
		const html = (await container.renderToString(Content)).replace(
			/(<(?:img|source)\b[^>]*?\s(?:src|srcset)=")(\/[^"]*)"/g,
			(_, prefix, path) => `${prefix}${origin}${path}"`,
		);

		items.push({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}/`,
			// 空文章给个占位，避免生成空的 <content:encoded/>
			content: html.trim() || `<p>${post.data.description}</p>`,
		});
	}

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site,
		xmlns: { atom: 'http://www.w3.org/2005/Atom' },
		// 频道元数据：语言 + 自我引用，两样都是阅读器认 feed 的常见依据
		customData: [
			'<language>zh-cn</language>',
			`<atom:link href="${new URL('rss.xml', site).href}" rel="self" type="application/rss+xml" />`,
		].join(''),
		items,
	});
}
