<script>
	import Swal from 'sweetalert2';
	import SlotCanvas from '$lib/components/SlotCanvas.svelte';
	import { showLoginModal } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const credits = writable(0);
	let slotRef;
	let rolling = false;
	let canCashout = false;
	let cashoutBlocked = false;
	let cashoutDone = false;
	let rollCount = 0;
	let winAmount = 0;
	let isMobile = false;

	onMount(async () => {
		isMobile = /Mobi|Android/i.test(navigator.userAgent);
		const res = await fetch('/api/start');
		const data = await res.json();
		if (data.success) {
			credits.set(data.credits);
		}
	});

	async function roll() {
		if (rolling) return;

		rolling = true;
		slotRef.playSpin(['/clock_loading.svg', '/clock_loading.svg', '/clock_loading.svg']); // mostrar carga visual

		const res = await fetch('/api/roll', { method: 'POST' });
		const data = await res.json();

		if (data.error) {
			if (data.error === 'Not enough credits') {
				Swal.fire({
					title: 'No more credits!',
					text: 'Do you want to get more credits?',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: 'var(--color-theme-2)',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes, log in',
					cancelButtonText: 'Cancel',
					reverseButtons: true
				}).then((result) => {
					if (result.isConfirmed) {
						showLoginModal.set(true);
					}
				});
			} else {
				Swal.fire({
					text: `${data.error}`,
					icon: 'error',
					confirmButtonText: 'ok :('
				});
			}
			rolling = false;
			return;
		}

		rollCount++;
		if (rollCount >= 2) canCashout = true;

		// Mostrar cada símbolo con delay
		setTimeout(() => slotRef.playSpin([data.result[0], '/clock_loading.svg', '/clock_loading.svg']), 1000);
		setTimeout(() => slotRef.playSpin([data.result[0], data.result[1], '/clock_loading.svg']), 2000);
		setTimeout(() => {
			slotRef.playSpin(data.result); // Final
			credits.set(data.credits);
			winAmount = data.payout ?? 0;
			rolling = false;

			if (data.payout > 0) {
				Swal.fire({
					title: 'Winner! 🎉',
					text: `You just won ${data.payout} credits!`,
					icon: 'success',
					showConfirmButton: false,
					timer: 3000
				});
			}
		}, 3000);
	}

	async function cashout() {
		if (!canCashout || cashoutBlocked || cashoutDone) return;
		cashoutDone = true;

		try {
			const res = await fetch('/api/cashout', { method: 'POST' });
			const data = await res.json();

			if (data.success) {
				const btn = document.getElementById('cashout');
				if (btn) {
					btn.style.transform = 'none';
					btn.classList.remove('hover:animate-wiggle');
					btn.style.animation = 'none';
					btn.style.transition = 'none';
					btn.style.pointerEvents = 'none';
				}
				Swal.fire({
					text: `Cashed out ${data.creditsCashedOut} credits!`,
					icon: 'info',
					showConfirmButton: false,
					timer: 2000
				});
			} else {
				Swal.fire({
					text: data.error || 'Something went wrong.',
					icon: 'warning',
					showConfirmButton: false,
					timer: 1500
				});
			}

			setTimeout(() => {
				window.location.href = '/';
			}, 2000);
		} catch (e) {
			console.error(e);
			Swal.fire({
				text: 'Network error, redirecting...',
				icon: 'error',
				showConfirmButton: false,
				timer: 1500
			});

			setTimeout(() => {
				window.location.href = '/';
			}, 2000);
		}
	}

    function handleHoverCashout() {
		if (!canCashout) return;
		const rand = Math.random();
		if (rand < 0.5) {
			const btn = document.getElementById('cashout');
			const offsetX = Math.random() * 300 - 150;
			const offsetY = Math.random() * 300 - 150;
			btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
		} else if (rand < 0.9) {
			cashoutBlocked = true;
			setTimeout(() => {
				cashoutBlocked = false;
			}, 2000);
		}
	}

	function handleTouchCashout() {
		if (!canCashout || cashoutBlocked || cashoutDone || !isMobile) return;

		const rand = Math.random();
		const btn = document.getElementById('cashout');
		if (!btn) return;

		if (rand < 0.5) {
			const offsetX = Math.random() * 200 - 100;
			const offsetY = Math.random() * 200 - 100;

			const currentTransform = btn.style.transform || 'translate(0px, 0px)';
			const match = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(currentTransform);
			const prevX = match ? parseFloat(match[1]) : 0;
			const prevY = match ? parseFloat(match[2]) : 0;

			const newX = prevX + offsetX;
			const newY = prevY + offsetY;

			btn.style.transform = `translate(${newX}px, ${newY}px)`;
		} else if (rand < 0.9) {
			cashoutBlocked = true;
			setTimeout(() => {
				cashoutBlocked = false;
			}, 2000);
		}
	}
</script>

<svelte:head>
	<title>Play</title>
	<meta name="play" content="Let's play" />
</svelte:head>

<section
	class="w-full h-full flex flex-col items-center justify-center lg:p-10 text-white font-mono
  	bg-[linear-gradient(to_bottom,_rgba(183,137,22,0)_0%,_rgba(183,137,22,0.5)_25%,_rgba(183,137,22,1)_50%,_rgba(183,137,22,0.5)_75%,_rgba(183,137,22,0)_100%)]"
>
	<div class="h-full w-[95%] lg:w-[55%] flex flex-col items-center justify-center px-2 py-5 lg:p-20 rounded-lg space-y-6">
		<SlotCanvas bind:this={slotRef} />

		<div class="grid grid-cols-2 gap-6 w-full items-center justify-center">
			<p class="bg-yellow-900 p-3 rounded-lg">
				Credits: <span class="underline">{$credits}</span>
			</p>
			<p class="bg-green-900 p-3 rounded-lg">
				Win: <span class="underline">{winAmount}</span>
			</p>
		</div>

		<button
			class="w-15 h-15 lg:w-24 lg:h-24 bg-green-600 hover:bg-green-500 rounded-full text-xl flex items-center justify-center shadow-lg transition active:scale-95 disabled:opacity-50"
			class:cursor-pointer={!rolling}
			on:click={roll}
			disabled={rolling}
		>
			{#if rolling}
				<span class="flex items-center justify-center animate-spin w-full h-full">
					<img src="/loading.svg" alt="🎰" class="h-10 w-10" />
				</span>
			{:else}
				<span class="flex items-center justify-center gap-1 w-full h-full text-xs lg:text-lg">
					Roll
					<img src="/play.svg" alt="▶" class="h-5 w-5" />
				</span>
			{/if}
		</button>

		{#if canCashout}
			<button
				id="cashout"
				class="relative group overflow-hidden bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl shadow-xl transition-all duration-300 disabled:opacity-50 cursor-pointer"
				on:click={cashout}
				on:mouseover={handleHoverCashout}
				on:focus={handleHoverCashout}
				on:touchstart={handleTouchCashout}
				disabled={!canCashout || cashoutBlocked || cashoutDone}
			>
				<span class="flex items-center justify-center w-full h-full text-xs lg:text-lg">
					Cash Out
				</span>
			</button>
		{/if}
	</div>
</section>