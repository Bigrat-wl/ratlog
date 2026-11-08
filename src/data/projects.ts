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
		name: '信息素养大赛答题系统',
		description: '学生在线答题并上传成果，后台导入名单、查看填写状态、导出 CSV。',
		repo: 'https://github.com/Bigrat-wl/taizhou',
		tags: ['Vue 3', 'Express', 'SQLite'],
		year: '2026',
	},
	{
		name: 'ratlog',
		description: '你正在看的个人博客。Astro 构建，极简排版、明暗主题和年份分组。',
		repo: 'https://github.com/Bigrat-wl/ratlog',
		tags: ['Astro', 'TypeScript'],
		year: '2026',
	},
	{
		name: 'CSS 基本功挑战',
		description: '面向初学者的 CSS 布局练习，配套教程和示例。',
		repo: 'https://github.com/Bigrat-wl/css-challenges',
		tags: ['CSS', 'HTML'],
		year: '2026',
	},
];
