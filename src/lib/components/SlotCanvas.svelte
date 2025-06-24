<script>
	import { onMount, onDestroy } from 'svelte';

	let symbols = [
		'/cherries.svg',
		'/limon.svg',
		'/orange.svg',
		'/watermelon.svg',
		'/question.svg'
	];

	let symbolImages = [];
	let canvas;
	let ctx;
	let isSpinning = false;
	let animationId;
	let reelCount = 3;
	let reelSymbols = [];
	let glowPhase = 0;
	let glowDirection = 1;
	let visibleSymbols =  Array(reelCount).fill('/question.svg');
	let glowAnimationId;

	const symbolHeight = 100;
	const symbolWidth = 100;
	const reelSpacing = 20;
	const padding = 10;
	const canvasWidth = (symbolWidth + reelSpacing) * reelCount - reelSpacing;
	const canvasHeight = symbolHeight;
	const spinSymbols = symbols.filter(s => s !== '/question.svg');

	async function loadImages() {
		for (let src of symbols) {
			const img = new Image();
			img.src = src;
			await img.decode();
			symbolImages.push(img);
		}
	}

	function getImageByPath(path) {
		const index = symbols.indexOf(path);
		return symbolImages[index];
	}

	function drawSymbol(symbolPath, x, y) {
		ctx.clearRect(x, y, symbolWidth, symbolHeight);

		ctx.save();
		ctx.shadowColor = 'white';
		ctx.shadowBlur = 10 + 5 * Math.sin(glowPhase);
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 3;
		ctx.strokeRect(x, y, symbolWidth, symbolHeight);
		ctx.restore();

		const image = getImageByPath(symbolPath);
		if (image) {
			ctx.drawImage(
				image,
				x + padding,
				y + padding,
				symbolWidth - 2 * padding,
				symbolHeight - 2 * padding
			);
		} else {
			ctx.font = '60px serif';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(symbolPath, x + symbolWidth / 2, y + symbolHeight / 2);
		}
	}

	function drawInitial() {
		drawAll(visibleSymbols);
	}

	function spin(reveal) {
		isSpinning = true;

		let currentSymbols = Array.from({ length: reelCount }, () =>
			spinSymbols[Math.floor(Math.random() * spinSymbols.length)]
		);

		for (let i = 0; i < reelCount; i++) {
			const delay = (i + 1) * 1000;

			const spinInterval = setInterval(() => {
				const randomSymbol = spinSymbols[Math.floor(Math.random() * spinSymbols.length)];
				currentSymbols[i] = randomSymbol;
				drawAll(currentSymbols);
			}, 100);

			setTimeout(() => {
				clearInterval(spinInterval);
				currentSymbols[i] = reveal[i];
				drawAll(currentSymbols);

				if (i === reelCount - 1) {
					isSpinning = false;
				}
			}, delay);
		}
	}

	function drawAll(symbolArray) {
		visibleSymbols = [...symbolArray];
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < reelCount; i++) {
			drawSymbol(symbolArray[i], i * (symbolWidth + reelSpacing), 0);
		}
	}

	function animateGlow() {
		if (!ctx) return;

		glowPhase += 0.1 * glowDirection;

		if (glowPhase > Math.PI) glowDirection = -1;
		else if (glowPhase < 0) glowDirection = 1;

		drawAllWithGlow(visibleSymbols, glowPhase);
		glowAnimationId = requestAnimationFrame(animateGlow);
	}

	function drawAllWithGlow(symbolArray, glowPhase) {
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < reelCount; i++) {
			const glow = Math.floor(10 + Math.sin(glowPhase) * 10);
			ctx.shadowColor = 'white';
			ctx.shadowBlur = glow;
			drawSymbol(symbolArray[i], i * (symbolWidth + reelSpacing), 0);
		}
		ctx.shadowBlur = 0;
	}

	export function playSpin(finalResult) {
		if (!isSpinning) {
			spin(finalResult);
		}
	}
	
	onMount(async () => {
		ctx = canvas.getContext('2d');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		await loadImages();
		drawInitial();
		animateGlow();
	});

	onDestroy(() => {
		if (glowAnimationId) {
			cancelAnimationFrame(glowAnimationId);
		}
	});
</script>

<canvas bind:this={canvas} class="shadow-lg w-full max-w-[400px] mx-auto"></canvas>