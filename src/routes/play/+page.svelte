<script>
	import SlotCanvas from '$lib/components/SlotCanvas.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let slotRef;
	const credits = writable(0);
	let rolling = false;
	let canCashout = false;
	let rollCount = 0;
    let cashoutBlocked = false;

	let jumpX = 0;
	let jumpY = 0;
	let cashoutDisabled = false;

	onMount(async () => {
		const res = await fetch('/api/start');
		const data = await res.json();
		if (data.success) {
			credits.set(data.credits);
		}
	});

	async function roll() {
		if (rolling) return;

		rolling = true;
		slotRef.playSpin(['⏳', '⏳', '⏳']); // mostrar carga visual

		const res = await fetch('/api/roll', { method: 'POST' });
		const data = await res.json();

		if (data.error) {
			alert(data.error);
			rolling = false;
			return;
		}

		rollCount++;
		if (rollCount >= 2) canCashout = true;

		// Mostrar cada símbolo con delay
		setTimeout(() => slotRef.playSpin([data.result[0], '⏳', '⏳']), 1000);
		setTimeout(() => slotRef.playSpin([data.result[0], data.result[1], '⏳']), 2000);
		setTimeout(() => {
			slotRef.playSpin(data.result); // Final
			credits.set(data.credits);
			rolling = false;
		}, 3000);
	}

	async function cashout() {
		if (!canCashout || cashoutBlocked) return;

		const res = await fetch('/api/cashout', { method: 'POST' });
		const data = await res.json();
		if (data.success) {
			alert(`Cashed out ${data.creditsCashedOut} credits!`);
			window.location.href = '/'; // o redirige a página de inicio
		}
	}

    function handleHoverCashout() {
		if (!canCashout) return;
		const rand = Math.random();
		if (rand < 0.5) {
			// saltar
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
</script>

<svelte:head>
	<title>Play</title>
	<meta name="play" content="Let's play" />
</svelte:head>

<section
	class="w-full h-full flex flex-col items-center justify-center lg:p-10 text-white font-mono
  bg-[linear-gradient(to_bottom,_rgba(183,137,22,0)_0%,_rgba(183,137,22,0.5)_25%,_rgba(183,137,22,1)_50%,_rgba(183,137,22,0.5)_75%,_rgba(183,137,22,0)_100%)]"
>
	<div class="h-full w-[95%] lg:w-[55%] flex flex-col items-center justify-center px-2 py-10 lg:p-20 rounded-lg space-y-6">
		<SlotCanvas bind:this={slotRef} />

		<div class="grid grid-cols-2 gap-6 w-full items-center justify-center">
			<p class="bg-yellow-900 p-3 rounded-lg">
				Credits: <span class="underline">{$credits}</span>
			</p>
            <button
                class="justify-self-center w-20 h-20 rounded-lg flex items-center justify-center text-white bg-green-600 hover:bg-green-500 transition duration-300 disabled:opacity-50"
                on:click={roll}
                disabled={rolling}
            >
                {#if rolling}
                    <span class="animate-spin"><img src="/loading.svg" alt="🎰"></span>
                {:else}
                    Roll <img src="/play.svg" alt="▶" class="h-5 w-5">
                {/if}
            </button>
		</div>

		{#if canCashout}
			<button
				id="cashout"
				class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl shadow-xl transition duration-300 disabled:opacity-50"
				on:click={cashout}
				on:mouseover={handleHoverCashout}
				disabled={!canCashout || cashoutBlocked}
			>
				Cash Out
			</button>
		{/if}
	</div>
</section>


<style>
	#cashout {
		position: relative;
		transition: transform 0.3s ease;
	}
</style>