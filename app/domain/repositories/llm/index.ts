export interface LLMRepository {
	generateContent: (text: string) => Promise<string>;
}
