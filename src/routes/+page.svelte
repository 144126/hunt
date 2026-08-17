<script lang="ts">
	let { data } = $props();

	type Row = (typeof data.rows)[number];

	let hunt = $state('');
	let src = $state('');
	let keepers = $state(false);
	let sel = $state<Row | null>(null);

	const hunts = $derived([...new Set(data.rows.map((r) => r.h))].sort());
	const sources = $derived([...new Set(data.rows.map((r) => r.s))].sort());
	const shown = $derived(
		data.rows.filter(
			(r) => (!hunt || r.h === hunt) && (!src || r.s === src) && (!keepers || r.k === 1)
		)
	);

	const age_str = (c: string | null, g: number) => {
		const min = c ? Math.round((Date.now() - Date.parse(c)) / 60000) : g;
		if (!min || min < 1) return 'now';
		if (min < 60) return `${min}m`;
		if (min < 1440) return `${Math.round(min / 60)}h`;
		if (min < 10080) return `${Math.round(min / 1440)}d`;
		return `${Math.round(min / 10080)}w`;
	};

	const badge_for = (s: string) =>
		({ x: 'bg-x', reddit: 'bg-reddit', nairaland: 'bg-nairaland' })[s] ?? 'bg-fb';
</script>

<div class="p-3 md:grid md:h-[calc(100dvh-1.5rem)] md:grid-cols-2 md:gap-3">
	<div class="space-y-3 md:overflow-y-auto">
		<div class="flex flex-wrap items-center gap-2">
			<select
				bind:value={hunt}
				class="rounded border border-hairline bg-surface px-2 py-1 text-sm text-ink"
			>
				<option value="">all hunts</option>
				{#each hunts as h (h)}
					<option value={h}>{h}</option>
				{/each}
			</select>
			<select
				bind:value={src}
				class="rounded border border-hairline bg-surface px-2 py-1 text-sm text-ink"
			>
				<option value="">all sources</option>
				{#each sources as s (s)}
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
				<li
					class="flex items-center gap-2 rounded border border-hairline bg-surface px-2 py-1 text-sm"
				>
					<button
						type="button"
						onclick={() => (sel = r)}
						class="flex min-w-0 flex-1 cursor-pointer items-center gap-2 bg-transparent text-left text-ink"
					>
						<span class="rounded px-1.5 py-0.5 text-xs font-medium text-background {badge_for(r.s)}"
							>{r.s}</span
						>
						{#if r.k}<span class="text-x">★</span>{/if}
						<span class="w-10 shrink-0 text-xs text-muted">{age_str(r.c, r.g)}</span>
						{#if r.a}<span class="max-w-32 shrink-0 truncate font-medium text-ink">{r.a}</span>{/if}
						<span class="min-w-0 flex-1 truncate text-ink" title={r.t}>{r.t.slice(0, 140)}</span>
					</button>
					<a
						href={r.u}
						target="_blank"
						rel="noopener"
						title="open in new tab"
						class="shrink-0 rounded px-1.5 py-0.5 text-muted hover:text-ink">↗</a
					>
				</li>
			{/each}
		</ul>
	</div>

	{#if sel}
		<div class="fixed inset-0 z-10 flex flex-col gap-2 bg-background p-3 md:static md:gap-3 md:p-0">
			<div class="flex items-center justify-between">
				<button
					onclick={() => (sel = null)}
					class="rounded border border-hairline px-2 py-1 text-sm text-ink">close</button
				>
				<a
					href={sel.u}
					target="_blank"
					rel="noopener"
					class="rounded border border-hairline px-2 py-1 text-sm text-ink">open in tab</a
				>
			</div>
			{#if sel.e}
				<iframe
					title="embedded post"
					src={sel.e}
					class="w-full flex-1 rounded border border-hairline bg-surface md:h-[calc(100dvh-6rem)] md:flex-none"
				></iframe>
			{:else}
				<div class="flex-1 space-y-2 overflow-y-auto rounded border border-hairline bg-surface p-3">
					<p class="text-xs text-muted">cannot embed {sel.s} posts</p>
					<p class="text-sm whitespace-pre-wrap text-ink">{sel.t}</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
