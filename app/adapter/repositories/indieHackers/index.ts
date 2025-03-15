import type { IndieHackersRepository } from "~/domain/repositories/indieHackers";
import { LLMRepositoryImpl } from "../llm";
import { medias } from "schema/medias";
import { eq } from "drizzle-orm";
import { dbClient } from "~/configs/db";

export interface HackerNewsItem {
  by: string;
  descendants: number;
  id: string;
  score: number;
  time: number;
  title: string;
  type: string;
  text?: string;
  url?: string;
}

export class IndieHackersRepositoryImpl implements IndieHackersRepository {
  async getPosts() {
    try {
      const res = await fetch(
        "https://hacker-news.firebaseio.com/v0/newstories.json"
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const newStories = await res.json();

      let target: HackerNewsItem | undefined;

      for (const itemId of newStories) {
        const mediaList = await dbClient
          .select()
          .from(medias)
          .where(eq(medias.extId, itemId));

        if (mediaList.length > 0) {
          continue;
        }

        const itemRes = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`
        );

        if (!itemRes.ok) {
          console.warn(
            `アイテム取得失敗: ${itemId}, ステータス: ${itemRes.status}`
          ); // 警告を出力
          continue;
        }

        const itemJson: HackerNewsItem = await itemRes.json();

        const prompt = `
              以下のtitleかtextの内容が「ai, tech, indie hack, generative ai, small bussiness」のいずれかに該当するかどうかを、以下の形式でjsonを出力してください。
              title: ${itemJson.title}
              text: ${itemJson.text}
              {
                result: boolean,
              }
              `;

        const result = await this.callLLM(prompt);
        const trimmed = result.replace(/```json\n|\n```/g, "");
        try {
          const resultJson = JSON.parse(trimmed);
          if (resultJson.result) {
            target = itemJson;
            break;
          }
        } catch (parseError) {
          console.error(`LLMレスポンスのパースエラー: ${trimmed}`, parseError);
          continue;
        }
      }

      await dbClient
        .insert(medias)
        .values({
          extId: target?.id || "",
          url: target?.url || "",
        })
        .returning();

      return target;
    } catch (error) {
      console.error("データ取得エラー:", error);
      throw error;
    }
  }

  private async callLLM(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const llmRepository = new LLMRepositoryImpl();
          const result = await llmRepository.generateContent(prompt);
          resolve(result);
        } catch (error: any) {
          if (error.status === 429) {
            console.error("クォータ超過！再試行します。");
            setTimeout(() => this.callLLM(prompt), 5000);
          } else {
            reject(error);
          }
        }
      }, 5000);
    });
  }
}
