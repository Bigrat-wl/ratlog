// 站点的全局信息，任何页面都可以 import 使用
export const SITE_TITLE = 'ratlog';
export const SITE_DESCRIPTION = '记录技术、项目与思考。';
export const AUTHOR = 'Rat';

// TODO: 改成你自己的主页与联系方式
export const SOCIALS = [
	{
		name: 'GitHub',
		url: 'https://github.com/Bigrat-wl',
		icon: 'github',
	},
	{
		name: 'RSS',
		url: '/rss.xml',
		icon: 'rss',
	},
] as const;

export const EMAIL = 'ratqzq@gmail.com';
