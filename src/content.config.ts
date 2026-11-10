import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 博客只关心「哪一天」，不关心具体时刻。
 * 把 frontmatter 里的日期统一归一到该日 UTC 零点，
 * 这样构建机的时区不会改变 RSS 与页面上的日期。
 */
const dateOnly = z.coerce
	.date()
	.transform((date) => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())));

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: dateOnly,
			updatedDate: dateOnly.optional(),
			heroImage: z.optional(image()),
			// 文章语言，用于列表上的小标签
			lang: z.enum(['zh', 'en', 'ja']).optional(),
			draft: z.boolean().optional(),
		}),
});

export const collections = { blog };
