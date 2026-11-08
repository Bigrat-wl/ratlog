// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.ratzu.art',
	integrations: [mdx(), sitemap()],
	markdown: {
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
