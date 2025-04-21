import OpenAI from "openai";

const { OPENAI_API_KEY, OPENAI_ASSISTANT_ID } = process.env;

const findSimilarity = async (code1, code2) => {
	try {
		const openai = new OpenAI({
			apiKey: OPENAI_API_KEY,
		});

		const thread = await openai.beta.threads.create();

		await openai.beta.threads.messages.create(
			thread.id,
			{
				role: "user",
				content: [{
					type: "text",
					text: `Snippet 1: \n${code1}\n\nSnippet 2: \n${code2}`,
				}],
			},
		);

		const threadRun = await openai.beta.threads.runs.create(thread.id, { assistant_id: OPENAI_ASSISTANT_ID });

		let runResult;

		while (threadRun.status !== "completed") {
			runResult = await openai.beta.threads.runs.retrieve(
				thread.id,
				threadRun.id,
			);

			if (runResult.status === "completed") {
				break;
			}
		}

		const allMessages = await openai.beta.threads.messages.list(thread.id);
		const result = allMessages.data[0].content[0].text.value;
		return Number.parseFloat(result.split(" ")[0]);
	} catch (error) {
		console.error(error);
		return -1;
	}
};

export { findSimilarity };
