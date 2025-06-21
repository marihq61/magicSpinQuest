<script>
	import Header from './Header.svelte';
	import '../app.css';

	let { children } = $props();

	const year = new Date().getFullYear();
</script>

<Header />

<main class="flex items-start justify-center">
	{@render children()}
</main>

<footer class="flex justify-between items-center justify-center">
	<div class="flex items-center justify-center">
		<p class="text-sm text-center text-white opacity-75">
			Crafted with ❤️ by Mari Hernandez<span class="align-super text-xs">&reg;</span>. All rights reserved © {year}.
		</p>
		<img src="favicon.png" alt="SvelteKit" class="w-8 h-8 object-contain" />
	</div>
</footer>

<style>
	
</style>
