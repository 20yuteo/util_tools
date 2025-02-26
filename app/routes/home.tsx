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
  const tweetRepository = new RepositoryProvider().tweet;
  await tweetRepository.postTweet('Hello, world!');
}

export default function Home() {
  return <Welcome />;
}
