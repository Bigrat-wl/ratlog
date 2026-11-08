/**
 * 粗略估算阅读时长：中文按 400 字/分钟，英文按 200 词/分钟。
 */
export function getReadingTime(body = ''): number {
	const cjk = (body.match(/[\u3400-\u9fff]/g) ?? []).length;
	const words = body
		.replace(/[\u3400-\u9fff]/g, ' ')
		.trim()
		.split(/\s+/)
		.filter(Boolean).length;

	return Math.max(1, Math.round(cjk / 400 + words / 200));
}
