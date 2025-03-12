import { isRouteErrorResponse } from "react-router";
import { RepositoryProvider } from "~/adapter/repositories/provider";

export const handler = async (event: any) => {
  const slackRepository = new RepositoryProvider().slack;
  try {
    const indieHackersRepository = new RepositoryProvider().indieHackers;
    const llmRepository = new RepositoryProvider().llm;
    const tweetRepository = new RepositoryProvider().tweet;

    const res = await indieHackersRepository.getPosts();

    if (!res ||isRouteErrorResponse(res)) {
      throw new Error("Failed to fetch posts");
    }
  
    const prompt = `
    あなたは、xのポストを投稿するプロのSNSマーケターです。
  
    1. xのポストとして投稿するために、タイトルもしくはtextを日本語に翻訳してください
     - title: ${res?.title}
     - text: ${res?.text}
    2. ポストの中にハッシュダグを入れて下さい。
    3. ポストの中にURLが存在すれば以下のURLを入れて下さい。
      - ${res?.url}
    6. 出力形式はplane textにしてください。
    7. ポストは140文字以内です。
    `;

	const content = await llmRepository.generateContent(prompt);

    await tweetRepository.postTweet(content);

    await slackRepository.postMessage(`Success: ${content}`);
    console.log(`Success: ${content}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  } catch (error) {
    await slackRepository.postMessage(`Error: ${error}`);
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error" }),
    };
  }
};
