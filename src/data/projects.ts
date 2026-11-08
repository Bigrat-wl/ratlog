export interface Project {
	name: string;
	description: string;
	/** 线上地址；没有时优先链接到源码 */
	url?: string;
	/** 源码地址 */
	repo?: string;
	tags?: string[];
	year?: string;
}

// 项目列表：复制一条，改成自己的作品即可。
// url 和 repo 至少填一个；名称会自动链接到 url，没有 url 就链接到 repo。
export const PROJECTS: Project[] = [
	{
		name: 'ratlog',
		description: '你正在看的个人博客。Astro 构建，极简排版、明暗主题和年份分组。',
		repo: 'https://github.com/Bigrat-wl/ratlog',
		tags: ['Astro', 'TypeScript'],
		year: '2026',
	},
];
