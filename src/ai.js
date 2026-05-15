export default async function aiRoutes(fastify) {
	// Llama 3.3 70B via Groq (free tier — get key at console.groq.com)
	fastify.post("/api/chat", async (req, reply) => {
		const key = process.env.GROQ_API_KEY;
		if (!key) {
			return reply.code(500).send({
				error: { message: "GROQ_API_KEY environment variable is not set." },
			});
		}
		const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${key}`,
			},
			body: JSON.stringify({
				model: "llama-3.3-70b-versatile",
				messages: req.body.messages,
			}),
		});
		const data = await upstream.json();
		return reply.code(upstream.status).send(data);
	});

	// Gemini 2.0 Flash Lite via Google (free tier — get key at aistudio.google.com)
	fastify.post("/api/chat-gemini", async (req, reply) => {
		const key = process.env.GEMINI_API_KEY;
		if (!key) {
			return reply.code(500).send({
				error: { message: "GEMINI_API_KEY environment variable is not set." },
			});
		}
		const upstream = await fetch(
			"https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${key}`,
				},
				body: JSON.stringify({
					model: "gemini-2.0-flash-lite",
					messages: req.body.messages,
				}),
			}
		);
		const data = await upstream.json();
		return reply.code(upstream.status).send(data);
	});
}
