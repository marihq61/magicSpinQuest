import { json } from '@sveltejs/kit';

const symbols = ['🍒', '🍋', '🍊', '🍉'];
const payouts = {
	'🍒': 10,
	'🍋': 20,
	'🍊': 30,
	'🍉': 40
};

function spin() {
	return [
		symbols[Math.floor(Math.random() * symbols.length)],
		symbols[Math.floor(Math.random() * symbols.length)],
		symbols[Math.floor(Math.random() * symbols.length)]
	];
}

function isWin(result) {
	return result[0] === result[1] && result[1] === result[2];
}

function applyHouseEdge(result, credits) {
	if (isWin(result)) {
		const chance = Math.random();
		if (credits >= 40 && credits <= 60 && chance < 0.3) {
			return spin(); // reroll
		}
		if (credits > 60 && chance < 0.6) {
			return spin(); // reroll
		}
	}
	return result;
}

export function POST({ cookies }) {
	const sessionId = cookies.get('session');

	if (!sessionId) {
		return json({ error: 'No session found' }, { status: 400 });
	}

	globalThis.sessions = globalThis.sessions || new Map();
	const session = globalThis.sessions.get(sessionId);

	if (!session) {
		return json({ error: 'Invalid session' }, { status: 400 });
	}

	if (session.credits < 1) {
		return json({ error: 'Not enough credits' }, { status: 403 });
	}

	session.credits -= 1;

	let result = spin();
	result = applyHouseEdge(result, session.credits);

	let payout = 0;
	if (isWin(result)) {
		payout = payouts[result[0]];
		session.credits += payout;
	}

	// Save updated session
	globalThis.sessions.set(sessionId, session);

	return json({
		result,
		credits: session.credits,
		win: payout > 0,
		payout
	});
}
