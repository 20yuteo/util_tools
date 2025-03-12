import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { RepositoryProvider } from "./adapter/repositories/provider";

export async function loader({ request }: { request: Request }) {
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

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  } catch (error) {
    await slackRepository.postMessage(`Error: ${error}`);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error" }),
    };
  }
}

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
