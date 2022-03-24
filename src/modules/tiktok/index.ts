import { Context } from "telegraf";
import * as tt from "tiktok-scraper";
const unshorted = require("unshorten.it");

const getVideoUrl = async (url: string): Promise<string> => {
  const originalLink = await unshorted(url);
  const videoMetaData = await tt.getVideoMeta(originalLink, {
    noWaterMark: true,
  });
  const info = videoMetaData.collector.pop();
  return info?.videoUrlNoWaterMark || info?.videoUrl || "";
};

export const useTiktok = async (ctx: Context, url: string) => {
  try {
    console.log(url);
    const videoUrl = await getVideoUrl(url);
    ctx.replyWithVideo(videoUrl);
  } catch (err) {
    console.log(err);
    ctx.reply("Произошла ошибка :(");
  }
};
