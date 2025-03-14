import type { LLMRepository } from "~/domain/repositories/llm";
import type { SlackRepository } from "~/domain/repositories/slack";
import type { TweetRepository } from "~/domain/repositories/tweet";
import { LLMRepositoryEmpty } from "~/test/domain/repositories/llm";
import { SlackRepositoryEmpty } from "~/test/domain/repositories/slack";
import { TweetRepositoryEmpty } from "~/test/domain/repositories/tweet";
import { LLMRepositoryImpl } from "./llm";
import { SlackRepositoryImpl } from "./slack";
import { TweetRepositoryImpl } from "./tweet";
import type { IndieHackersRepository } from "~/domain/repositories/indieHackers";
import { IndieHackersRepositoryImpl } from "./indieHackers";

export class RepositoryProvider {
	tweet: TweetRepository;
	llm: LLMRepository;
	slack: SlackRepository;
	indieHackers: IndieHackersRepository;

	constructor() {
		if (process.env.ENV === "production") {
			this.tweet = new TweetRepositoryImpl();
			this.llm = new LLMRepositoryImpl();
			this.slack = new SlackRepositoryImpl();
			this.indieHackers = new IndieHackersRepositoryImpl();
		} else {
			this.tweet = new TweetRepositoryEmpty();
			this.llm = new LLMRepositoryEmpty();
			this.slack = new SlackRepositoryEmpty();
			this.indieHackers = new IndieHackersRepositoryImpl();
		}
	}
}
