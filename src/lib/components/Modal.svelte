<script>
    export let show = false;
    export let onClose = () => {};
</script>

{#if show}
    <div
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        on:click={() => onClose()}
    >
        <div
            class="bg-[var(--color-bg-2)] rounded-xl p-6 w-full max-w-md shadow-xl relative"
            on:click|stopPropagation
        >
            <button
                class="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
                on:click={() => onClose()}
                aria-label="Close modal"
            >
                &times;
            </button>
            <slot />
        </div>
    </div>
{/if}
