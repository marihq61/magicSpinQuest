<script>
	import { onMount } from 'svelte';

	let symbols = [
		'/cherries.svg', 
		'/limon.svg', 
		'/orange.svg', 
		'/watermelon.svg'
	];

	let symbolImages = [];
	let result = ['/question.svg','/question.svg','/question.svg'];

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

	// Cargar imágenes SVG en memoria
	async function loadImages() {
		for (let src of symbols) {
			const img = new Image();
			img.src = src;
			await img.decode(); // esperar que la imagen se cargue
			symbolImages.push(img);
		}
	}

	function getImageByPath(path) {
		const index = symbols.indexOf(path);
		return symbolImages[index];
	}

	onMount(async () => {
		ctx = canvas.getContext('2d');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		await loadImages();
		drawInitial();
	});

	// Dibujar imagen SVG en la posición indicada
	function drawSymbol(symbolPath, x, y) {
		ctx.clearRect(x, y, symbolWidth, symbolHeight);

		const image = getImageByPath(symbolPath);
		if (image) {
			ctx.drawImage(image, x, y, symbolWidth, symbolHeight);
		} else {
			// fallback si no encuentra la imagen (ej: ❔)
			ctx.font = '60px serif';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(symbolPath, x + symbolWidth / 2, y + symbolHeight / 2);
		}
	}

	function drawInitial() {
		for (let i = 0; i < reelCount; i++) {
			drawSymbol('❔', i * symbolWidth, 0);
		}
	}

	function spin(reveal) {
		isSpinning = true;
		reelSymbols = [[], [], []];

		// Pre-generar símbolos aleatorios
		for (let i = 0; i < reelCount; i++) {
			for (let j = 0; j < 20; j++) {
				const rand = symbols[Math.floor(Math.random() * symbols.length)];
				reelSymbols[i].push(rand);
			}
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
