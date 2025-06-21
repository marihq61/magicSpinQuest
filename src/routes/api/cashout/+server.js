import { json } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
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

	const credits = session.credits;

	// (Opcional) simular que los créditos van a un balance de usuario
	globalThis.fakeUserBalances = globalThis.fakeUserBalances || new Map();
	const oldBalance = globalThis.fakeUserBalances.get(sessionId) || 0;
	globalThis.fakeUserBalances.set(sessionId, oldBalance + credits);

	// Limpiar sesión
	globalThis.sessions.delete(sessionId);

	// Borrar cookie
	cookies.delete('session', { path: '/' });

	return json({
		success: true,
		message: 'Cashout completed',
		creditsCashedOut: credits,
		finalBalance: globalThis.fakeUserBalances.get(sessionId)
	});
}
