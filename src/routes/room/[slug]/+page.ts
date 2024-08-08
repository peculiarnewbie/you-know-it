import { game1 } from '$lib/sampleqs.js';

export function load({ params }) {
	return {
		title: params.slug,
		game: game1
	};
}
