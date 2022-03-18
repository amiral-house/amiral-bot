import { Context } from "telegraf";
const TikTokScraper = require("tiktok-scraper");

const getVideoUrl = (url: string): Promise<string> => {
  return TikTokScraper.getVideoMeta(url).then((data: any) => {
    const info = data.collector.pop();
    return info.videoUrl;
  });
};

export const useTiktok = async (ctx: Context, url: string) => {
  const videoUrl = await getVideoUrl(url);

  ctx.replyWithVideo(videoUrl);
};
