export interface FriendLink {
	name: string;
	url: string;
	description: string;
	avatar?: string;
}

// 友链列表：复制一行，改成对方的站点信息即可。
// avatar 可选；不填就显示站点名的首字母。
export const FRIENDS: FriendLink[] = [
	// { name: 'Antfu', url: 'https://antfu.me', description: 'Vue 核心团队成员。' },
	{
		name: '柒拾兆字节',
		url: 'https://7omb2006.github.io/',
		description: '记录思考、代码与正在进行的事情。',
		avatar: '/friends/7omb.webp',
	},
];
