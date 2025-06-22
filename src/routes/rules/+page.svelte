<script>
    const symbols = [
        { name: 'Cherry', value: 10, icon: '/cherries.svg' },
        { name: 'Lemon', value: 20, icon: '/limon.svg' },
        { name: 'Orange', value: 30, icon: '/orange.svg' },
        { name: 'Watermelon', value: 40, icon: '/watermelon.svg' }
    ];
</script>

<svelte:head>
	<title>Rules</title>
	<meta name="rules" content="rules" />
</svelte:head>

<div class="mt-10 border border-[var(--color-theme-1)] p-4 rounded-xl max-w-md mx-auto shadow-md font-sans grid gap-5">
    <h2 class="text-xl font-bold mb-4 text-center">Game Rules</h2>
    <ul class="list-disc list-inside space-y-2">
        <li>You start with <span class="font-semibold">10 credits</span>.</li>
        <li>Each spin costs <span class="font-semibold">1 credit</span>.</li>
        <li>Match all 3 symbols to win:</li>
        <ul class="pl-4 mt-2 space-y-2">
            {#each symbols as symbol}
                <li class="flex items-center gap-2">
                <img src={symbol.icon} alt={symbol.name} class="w-6 h-6" />
                <span>{symbol.name} — <span class="font-semibold">+{symbol.value} credits</span></span>
                </li>
            {/each}
        </ul>
    </ul>
    <p>You can <span class="font-semibold">CASH OUT</span> anytime...<span class="italic">if you can catch the button!</span></p>
</div>
