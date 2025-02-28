import type { LLMRepository } from "~/domain/repositories/llm";

export class LLMRepositoryEmpty implements LLMRepository {
	generateContent(text: string): Promise<string> {
		return Promise.resolve("");
	}
}
