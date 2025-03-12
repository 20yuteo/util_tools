import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LLMRepository } from "~/domain/repositories/llm";

export class LLMRepositoryImpl implements LLMRepository {
	async generateContent(prompt: string): Promise<string> {
		const googleGenerativeAI = new GoogleGenerativeAI(
			import.meta.env.VITE_GOOGLE_API_KEY,
		);
		const model = googleGenerativeAI.getGenerativeModel({
			model: "gemini-1.5-flash",
		});

		const response = await model.generateContent(prompt);
		return response.response.text();
	}
}
