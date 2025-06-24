/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ cookies }) {
	let sessionId = cookies.get('session');

	globalThis.sessions = globalThis.sessions || new Map();

	if (sessionId && globalThis.sessions.has(sessionId)) {
		const session = globalThis.sessions.get(sessionId);
		return new Response(JSON.stringify({ success: true, credits: session.credits }));
	}

	sessionId = crypto.randomUUID();
	cookies.set('session', sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60
	});

	globalThis.sessions.set(sessionId, { credits: 10 });

	return new Response(JSON.stringify({ success: true, credits: 10 }));
}