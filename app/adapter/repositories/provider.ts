import type { LLMRepository } from "~/domain/repositories/llm";
import type { TweetRepository } from "~/domain/repositories/tweet";
import { LLMRepositoryEmpty } from "~/test/domain/repositories/llm";
import { TweetRepositoryEmpty } from "~/test/domain/repositories/tweet";

export class RepositoryProvider {
  tweet: TweetRepository;
  llm: LLMRepository;

  constructor() {
    this.tweet = new TweetRepositoryEmpty();
    this.llm = new LLMRepositoryEmpty();
  }
}