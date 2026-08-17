<script lang="ts">
	let { data } = $props();

	let hunt = $state('');
	let src = $state('');
	let keepers = $state(false);

	const hunts = $derived([...new Set(data.rows.map((r) => r.h))].sort());
	const sources = $derived([...new Set(data.rows.map((r) => r.s))].sort());
	const shown = $derived(
		data.rows.filter((r) => (!hunt || r.h === hunt) && (!src || r.s === src) && (!keepers || r.k === 1))
	);

	const age_str = (c: string | null, g: number) => {
		const min = c ? Math.round((Date.now() - Date.parse(c)) / 60000) : g;
		if (!min || min < 1) return 'now';
		if (min < 60) return `${min}m`;
		if (min < 1440) return `${Math.round(min / 60)}h`;
		if (min < 10080) return `${Math.round(min / 1440)}d`;
		return `${Math.round(min / 10080)}w`;
	};

	const badge_for = (s: string) => ({ x: 'bg-x', reddit: 'bg-reddit', nairaland: 'bg-nairaland' })[s] ?? 'bg-fb';
</script>

<div class="p-3 space-y-3">
	<div class="flex flex-wrap items-center gap-2">
		<select bind:value={hunt} class="bg-surface border border-hairline rounded px-2 py-1 text-sm text-ink">
			<option value="">all hunts</option>
			{#each hunts as h}
				<option value={h}>{h}</option>
			{/each}
		</select>
		<select bind:value={src} class="bg-surface border border-hairline rounded px-2 py-1 text-sm text-ink">
			<option value="">all sources</option>
			{#each sources as s}
				<option value={s}>{s}</option>
			{/each}
		</select>
		<label class="flex items-center gap-1.5 text-sm text-ink">
			<input type="checkbox" bind:checked={keepers} class="accent-x" />
			keepers only
		</label>
	</div>
	<p class="text-xs text-muted">{data.total} leads | {shown.length} shown</p>
	<ul class="space-y-1">
		{#each shown as r (r.i)}
			<li class="flex items-center gap-2 bg-surface border border-hairline rounded px-2 py-1 text-sm">
				<span class="rounded px-1.5 py-0.5 text-xs font-medium text-background {badge_for(r.s)}">{r.s}</span>
				{#if r.k}<span class="text-x">★</span>{/if}
				<span class="w-10 shrink-0 text-xs text-muted">{age_str(r.c, r.g)}</span>
				{#if r.a}<span class="max-w-32 shrink-0 truncate font-medium text-ink">{r.a}</span>{/if}
				<span class="min-w-0 flex-1 truncate text-ink" title={r.t}>{r.t.slice(0, 140)}</span>
			</li>
		{/each}
	</ul>
</div>
