/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ cookies }) {
	const sessionId = crypto.randomUUID();

	cookies.set('session', sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60
	});

	globalThis.sessions = globalThis.sessions || new Map();
	globalThis.sessions.set(sessionId, { credits: 10 });

	return new Response(JSON.stringify({ success: true, credits: 10 }));
}
