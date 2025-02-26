import type { TweetRepository } from "~/domain/repositories/tweet";

export class TweetRepositoryEmpty implements TweetRepository {
  async postTweet(text: string): Promise<void> {
    return Promise.resolve();
  }
}