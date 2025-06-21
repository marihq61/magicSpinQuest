export const SYMBOLS = ['🍒', '🍋', '🍊', '🍉'];

export function getRandomSymbol() {
	return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

export function calculatePayout([s1, s2, s3]) {
	if (s1 === s2 && s2 === s3) {
		switch (s1) {
			case '🍒': return 10;
			case '🍋': return 20;
			case '🍊': return 30;
			case '🍉': return 40;
		}
	}
	return 0;
}