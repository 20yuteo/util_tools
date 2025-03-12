import type { HackerNewsItem } from "~/adapter/repositories/indieHackers";

export interface IndieHackersRepository {
	getPosts: () => Promise<HackerNewsItem | undefined>;
}