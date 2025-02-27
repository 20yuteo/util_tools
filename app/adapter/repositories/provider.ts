import type { LLMRepository } from "~/domain/repositories/llm";
import type { SlackRepository } from "~/domain/repositories/slack";
import type { TweetRepository } from "~/domain/repositories/tweet";
import { LLMRepositoryEmpty } from "~/test/domain/repositories/llm";
import { SlackRepositoryEmpty } from "~/test/domain/repositories/slack";
import { TweetRepositoryEmpty } from "~/test/domain/repositories/tweet";

export class RepositoryProvider {
  tweet: TweetRepository;
  llm: LLMRepository;
  slack: SlackRepository;

  constructor() {
    this.tweet = new TweetRepositoryEmpty();
    this.llm = new LLMRepositoryEmpty();
    this.slack = new SlackRepositoryEmpty();
  }
}