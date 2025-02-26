import type { TweetRepository } from "~/domain/repositories/tweet";
import { TweetRepositoryEmpty } from "~/test/domain/repositories/tweet";

export class RepositoryProvider {
  tweet: TweetRepository;

  constructor() {
    this.tweet = new TweetRepositoryEmpty();
  }
}