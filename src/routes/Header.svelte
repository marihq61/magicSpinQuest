<script>
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
	import Swal from 'sweetalert2';
	import Modal from '$lib/components/Modal.svelte';
	import { showLoginModal } from '$lib/stores.js';

	let modalMode = 'login';
	let transitioning = false;

	function switchTo(mode) {
		transitioning = true;
		setTimeout(() => {
			modalMode = mode;
			transitioning = false;
		}, 300);
	}

	const switchToLogin = () => switchTo('login');
	const switchToSignup = () => switchTo('signup');

	function openLogin() {
		$showLoginModal = true;
	}

	function closeLogin() {
		$showLoginModal = false;
		modalMode = 'login';
	}

	const navLinks = [
		{ path: '/', label: 'Home' },
		{ path: '/rules', label: 'Rules' },
		{ path: '/about', label: 'About' },
		{ path: '/play', label: "Let's play! ;)" }
	];

	function theMessage(){
		Swal.fire({
			title: 'Heads up! 😄',
			text: `Eeeeasy! This is just a demo ;)`,
			icon: 'info',
			timer: 3000,
			showConfirmButton: false,
			position: 'center',
			timerProgressBar: true
		});
	}
</script>

<header class="relative flex flex-col xl:flex-row xl:items-center xl:justify-between xl:px-3">
	<div class="flex items-center justify-center xl:justify-start">
		<a href="/">
			<img src="favicon.png" alt="SvelteKit" class="w-8 h-8 object-contain" />
		</a>
	</div>
	<nav class="w-full my-3 xl:my-0 flex items-center justify-center px-2 xl:px-4 gap-0">
		<svg viewBox="0 0 2 3" aria-hidden="true" class="w-8 h-12 block">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" fill="rgba(255,255,255,0.7)" />
		</svg>
		<ul class="relative flex items-center h-12 list-none m-0 p-0 bg-white/70 px-2 xl:px-4 space-x-2 xl:space-x-4">
			{#each navLinks as { path, label }}
				<li class="relative h-full">
					<a
						href={path}
						aria-current={page.url.pathname === path ? 'page' : undefined}
						class="flex items-center h-full xl:px-2 text-xs xl:text-sm font-bold uppercase tracking-wider text-[var(--color-text)] hover:text-[var(--color-theme-1)] transition-colors"
						class:text-[var(--color-theme-1)]={page.url.pathname === path}
					>
						{label}
					</a>

					{#if page.url.pathname === path}
						<!-- Arrow -->
						<div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-[5px] xl:border-[6px] border-transparent border-t-[var(--color-theme-1)]"></div>
					{/if}
				</li>
			{/each}
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true" class="w-8 h-12 block">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" fill="rgba(255,255,255,0.7)" />
		</svg>
	</nav>
	<div class="flex justify-center xl:justify-end">
		<button on:click={openLogin} class="btn-outline-theme">
			Login
		</button>
	</div>
	<Modal show={$showLoginModal} onClose={closeLogin}>
		<div class="relative min-w-[300px] min-h-[300px]">
			{#if modalMode === 'login' && !transitioning}
				<div transition:fly={{ x: -100, duration: 300 }} key="login">
					<h2 class="text-base text-center text-white">Want more credits?</h2>
					<p class="text-xl text-center font-bold text-[var(--color-theme-1)] mt-1">
						Log in to start winning!
					</p>
					<form class="flex flex-col gap-4 mt-3">
						<input type="email" placeholder="Email" class="input" />
						<input type="password" placeholder="Password" class="input" />
						<button class="btn-outline-theme" on:click={theMessage}>Login</button>
					</form>
					<p class="mt-4 text-sm text-center text-gray-600">
						Don't have an account?
						<button on:click|preventDefault={switchToSignup} class="text-white hover:underline">Sign up</button>
					</p>
				</div>
			{:else if modalMode === 'signup' && !transitioning}
				<div transition:fly={{ x: 100, duration: 300 }} key="signup">
					<h2 class="text-xl font-bold mb-4 text-center">Create your account 🎉</h2>
					<form class="flex flex-col gap-4 mt-3">
						<input type="text" placeholder="Full name" class="input" />
						<input type="email" placeholder="Email" class="input" />
						<input type="password" placeholder="Password" class="input" />
						<button type="submit" class="btn-outline-theme" on:click={theMessage}>Sign Up</button>
					</form>
					<p class="mt-4 text-sm text-center text-gray-600">
						Already have an account?
						<button on:click|preventDefault={switchToLogin} class="text-white hover:underline">Log in</button>
					</p>
				</div>
			{/if}
		</div>
	</Modal>
</header>
