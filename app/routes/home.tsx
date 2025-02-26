import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { RepositoryProvider } from "~/adapter/repositories/provider";
import { GoogleGenerativeAI } from "@google/generative-ai"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const googleGenerativeAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
  const model = googleGenerativeAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  const response = await model.generateContent("who are you?");
  console.log(response.response.text());

  const tweetRepository = new RepositoryProvider().tweet;
  await tweetRepository.postTweet('Hello, world!');
}

export default function Home() {
  return <Welcome />;
}
