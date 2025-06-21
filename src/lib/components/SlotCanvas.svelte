<script>
	import { onMount } from 'svelte';

	let symbols = ['🍒', '🍋', '🍊', '🍉'];
	let result = ['❔', '❔', '❔'];

	let canvas;
	let ctx;
	let isSpinning = false;
	let animationId;
	let reelCount = 3;
	let reelSymbols = [];

	const symbolHeight = 100;
	const symbolWidth = 100;
	const canvasWidth = symbolWidth * reelCount;
	const canvasHeight = symbolHeight;

	// Iniciar canvas y dibujo
	onMount(() => {
		ctx = canvas.getContext('2d');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		drawInitial();
	});

	// Dibujar símbolo centrado
	function drawSymbol(symbol, x, y) {
		ctx.font = '60px serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.clearRect(x, y, symbolWidth, symbolHeight);
		ctx.fillText(symbol, x + symbolWidth / 2, y + symbolHeight / 2);
	}

	function drawInitial() {
		for (let i = 0; i < reelCount; i++) {
			drawSymbol('❔', i * symbolWidth, 0);
		}
	}

	function spin(reveal) {
		isSpinning = true;
		const start = performance.now();
		reelSymbols = [[], [], []];

		// Pre-generar secuencias aleatorias por reel
		for (let i = 0; i < reelCount; i++) {
			for (let j = 0; j < 20; j++) {
				const rand = symbols[Math.floor(Math.random() * symbols.length)];
				reelSymbols[i].push(rand);
			}
			// Agregar resultado final
			reelSymbols[i].push(reveal[i]);
		}

		let frame = 0;
		function animate() {
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			for (let i = 0; i < reelCount; i++) {
				const current = reelSymbols[i][Math.min(frame, reelSymbols[i].length - 1)];
				drawSymbol(current, i * symbolWidth, 0);
			}
			frame++;
			if (frame < reelSymbols[0].length) {
				animationId = requestAnimationFrame(animate);
			} else {
				isSpinning = false;
			}
		}

		animate();
	}

	export function playSpin(finalResult) {
		if (!isSpinning) spin(finalResult);
	}
</script>

<canvas bind:this={canvas} class="rounded-xl shadow-lg border border-white" />

<style>
	canvas {
		background: rgba(0, 0, 0, 0.3);
	}
</style>
