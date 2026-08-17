import { json } from '@sveltejs/kit';
import { HUNT_PUSH } from '$app/env/private';
import { get_secret } from '#lib/secret.js';

type R = {
	src?: unknown;
	id?: unknown;
	url?: unknown;
	embed?: unknown;
	at?: unknown;
	age_min?: unknown;
	text?: unknown;
	author?: unknown;
	author_id?: unknown;
	k?: unknown;
	d?: unknown;
};

export async function POST({ request, platform }) {
	if (!platform) return new Response(null, { status: 500 });

	const bearer = request.headers.get('authorization');
	const want = await get_secret(HUNT_PUSH);
	if (bearer !== `Bearer ${want}`) return new Response(null, { status: 401 });

	let rows: R[];
	try {
		const body = await request.json();
		if (!Array.isArray(body)) return json({ n: 0 });
		rows = body as R[];
	} catch {
		return json({ n: 0 });
	}
	if (rows.length > 500) return new Response(null, { status: 413 });

	const h = new URL(request.url).searchParams.get('h') ?? 'all';
	const db = platform.env.DB;

	let n = 0;
	for (const r of rows) {
		const { src, id, url, text } = r;
		if (typeof src !== 'string' || typeof id !== 'string' || typeof url !== 'string' || typeof text !== 'string') continue;
		const a = typeof r.author === 'string' ? r.author : typeof r.author_id === 'string' ? r.author_id : null;
		const e = typeof r.embed === 'string' ? r.embed : null;
		const c = typeof r.at === 'string' ? r.at : null;
		const g = typeof r.age_min === 'number' ? r.age_min : 0;
		const k = r.k === 1 ? 1 : 0;
		const d = typeof r.d === 'string' ? r.d : null;
		const res = await db
			.prepare(
				`insert into p (i, h, s, u, e, a, t, c, g, k, d) values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
				 on conflict(i) do update set h = excluded.h, s = excluded.s, u = excluded.u, e = excluded.e, a = excluded.a, t = excluded.t, c = excluded.c, g = excluded.g, k = excluded.k, d = excluded.d`
			)
			.bind(`${src}:${id}`, h, src, url, e, a, text, c, g, k, d)
			.run();
		n += res.meta.changes ?? 0;
	}

	return json({ n });
}
