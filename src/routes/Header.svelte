<script>
	import { page } from '$app/state';

	const navLinks = [
		{ path: '/', label: 'Home' },
		{ path: '/rules', label: 'Rules' },
		{ path: '/about', label: 'About Us' },
		{ path: '/play', label: "Let's play! ;)" }
	];
</script>

<header class="relative flex items-center">
	<div class="absolute left-4">
		<a href="/">
			<img src="favicon.png" alt="SvelteKit" class="w-8 h-8 object-contain" />
		</a>
	</div>
	<nav class="mx-auto flex items-center justify-center">
		<svg viewBox="0 0 2 3" aria-hidden="true" class="w-8 h-12 block">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" fill="rgba(255,255,255,0.7)" />
		</svg>
		<ul class="relative flex items-center h-12 list-none m-0 p-0 bg-white/70">
			{#each navLinks as { path, label }}
				<li class="relative h-full" class:before={page.url.pathname === path}>
					<a
						href="/"
						aria-current={page.url.pathname === path ? 'page' : undefined}
						class="flex items-center h-full px-2 text-[0.8rem] font-bold uppercase tracking-wider text-[var(--color-text)] hover:text-[var(--color-theme-1)] transition-colors"
						class:text-[var(--color-theme-1)]={page.url.pathname === path}
					>
						{label}
					</a>
					{#if page.url.pathname === path}
						<div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-[6px] border-transparent border-t-[var(--color-theme-1)]"></div>
					{/if}
				</li>
			{/each}
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true" class="w-8 h-12 block">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" fill="rgba(255,255,255,0.7)" />
		</svg>
	</nav>
</header>
