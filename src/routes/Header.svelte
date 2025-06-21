<script>
	import { page } from '$app/state';
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
			<li class="relative h-full" class:before={page.url.pathname === '/'}>
				<a
					href="/"
					aria-current={page.url.pathname === '/' ? 'page' : undefined}
					class="flex items-center h-full px-2 text-[0.8rem] font-bold uppercase tracking-wider text-[var(--color-text)] hover:text-[var(--color-theme-1)] transition-colors"
				>
					Home
				</a>
				{#if page.url.pathname === '/'}
					<div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-[6px] border-transparent border-t-[var(--color-theme-1)]"></div>
				{/if}
			</li>
			<li class="relative h-full">
				<a
					href="/rules"
					aria-current={page.url.pathname === '/rules' ? 'page' : undefined}
					class="flex items-center h-full px-2 text-[0.8rem] font-bold uppercase tracking-wider text-[var(--color-text)] hover:text-[var(--color-theme-1)] transition-colors"
				>
					Rules
				</a>
				{#if page.url.pathname === '/rules'}
					<div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-[6px] border-transparent border-t-[var(--color-theme-1)]"></div>
				{/if}
			</li>
			<li class="relative h-full">
				<a
					href="/about"
					aria-current={page.url.pathname.startsWith('/about') ? 'page' : undefined}
					class="flex items-center h-full px-2 text-[0.8rem] font-bold uppercase tracking-wider text-[var(--color-text)] hover:text-[var(--color-theme-1)] transition-colors"
				>
					About Us
				</a>
				{#if page.url.pathname.startsWith('/about')}
					<div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-[6px] border-transparent border-t-[var(--color-theme-1)]"></div>
				{/if}
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true" class="w-8 h-12 block">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" fill="rgba(255,255,255,0.7)" />
		</svg>
	</nav>
</header>
