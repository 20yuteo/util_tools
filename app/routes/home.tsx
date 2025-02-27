import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { RepositoryProvider } from "~/adapter/repositories/provider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const llmRepository = new RepositoryProvider().llm;
  const tweetRepository = new RepositoryProvider().tweet;
  const content = await llmRepository.generateContent('who are you?');
  await tweetRepository.postTweet(content);
}

export default function Home() {
  return <Welcome />;
}
