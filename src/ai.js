const SYSTEM_PROMPT = `You are Wave AI, a helpful assistant built into the Wave browser. You are friendly, concise, and knowledgeable.

You specialize in:
- **Games wikis & guides**: Blox Fruits (fruits, raids, sea events, grinding tips, devil fruit awakening), Undertale Yellow (characters, routes, bosses, lore), Roblox Rivals (weapons, maps, mechanics, tips), Valorant (agents, abilities, maps, ranks, strategies), and any other games users ask about
- **HTML5 / browser games**: recommendations, tips, and where to find them
- **Homework & school help**: math, science, history, English, coding
- **Coding**: debugging, explanations, writing code in any language
- **General questions**: anything the user needs help with

Keep responses clear and easy to read. Use bullet points or short paragraphs when helpful. If someone asks about a game you know, give accurate, useful info. If you don't know something specific, say so honestly rather than guessing.

You are Wave AI — never refer to yourself as ChatGPT, Gemini, Claude, or any other AI.`;

function buildMessages(userMessages) {
	// Only prepend system prompt if one isn't already present
	if (userMessages[0]?.role === "system") return userMessages;
	return [{ role: "system", content: SYSTEM_PROMPT }, ...userMessages];
}

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
				messages: buildMessages(req.body.messages),
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
					messages: buildMessages(req.body.messages),
				}),
			}
		);
		const data = await upstream.json();
		return reply.code(upstream.status).send(data);
	});
}
