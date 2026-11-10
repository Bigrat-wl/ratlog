// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { defineConfig, fontProviders } from 'astro/config';
import headingAnchor from './plugins/satteri-heading-anchor.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.ratzu.art',
	trailingSlash: 'always',
	build: { format: 'directory' },
	integrations: [mdx(), sitemap()],
	markdown: {
		// Astro 7 默认处理器是 Sätteri，标题锚点走它的 hast 插件
		processor: satteri({ hastPlugins: [headingAnchor] }),
		shikiConfig: {
			// 与 antfu.me 同款代码主题，浅色 / 深色自动切换
			themes: {
				light: 'vitesse-light',
				dark: 'vitesse-dark',
			},
			wrap: false,
		},
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Inter',
			cssVariable: '--font-inter',
			weights: ['400 800'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'DM Mono',
			cssVariable: '--font-dm-mono',
			weights: ['400', '500'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
		},
	],
});
