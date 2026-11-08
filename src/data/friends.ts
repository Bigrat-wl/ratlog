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
];
