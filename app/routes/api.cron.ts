import { users } from "schema/users";
import { RepositoryProvider } from "~/adapter/repositories/provider";
import { dbClient } from "~/configs";

export async function loader() {
	const slackRepository = new RepositoryProvider().slack;
	try {
		const llmRepository = new RepositoryProvider().llm;
		const tweetRepository = new RepositoryProvider().tweet;
		const content = await llmRepository.generateContent("who are you?");
		await tweetRepository.postTweet(content);

		await slackRepository.postMessage(`Success: ${content}`);
		console.log(`Success: ${content}`);
	} catch (error) {
		await slackRepository.postMessage(`Error: ${error}`);
		console.error(error);
	}

	return Response.json({ message: "Hello from API" });
}
