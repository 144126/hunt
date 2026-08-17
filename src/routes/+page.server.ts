export async function load({ platform }) {
	if (!platform) return { rows: [], total: 0 };
	const db = platform.env.DB;
	const list = await db.prepare('select i, h, s, u, e, a, t, c, g, k, d from p order by c desc limit 200').all();
	const cnt = await db.prepare('select count(*) as n from p').first();
	const rows = (list.results as Array<Record<string, unknown>>).map((r) => ({
		i: String(r.i ?? ''),
		h: String(r.h ?? ''),
		s: String(r.s ?? ''),
		u: String(r.u ?? ''),
		e: r.e == null ? null : String(r.e),
		a: r.a == null ? null : String(r.a),
		t: String(r.t ?? ''),
		c: r.c == null ? null : String(r.c),
		g: Number(r.g ?? 0),
		k: Number(r.k ?? 0),
		d: r.d == null ? null : String(r.d)
	}));
	return { rows, total: Number(cnt?.n ?? 0) };
}