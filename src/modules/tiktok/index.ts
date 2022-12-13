import { Context } from "telegraf";
import axios from "axios";
import { parse } from "node-html-parser";

const getVideoUrl = async (url: string): Promise<string> => {
  const html = await axios
    .get(url, { responseType: "text" })
    .then((res) => res.data);
  const document = parse(html);
  const json = JSON.parse(
    document?.querySelector('script[id="SIGI_STATE"]')?.innerText || "{}"
  );

  return json.ItemModule[json.ItemList.video.keyword].video.downloadAddr;
};

export const useTiktok = async (ctx: Context, url: string) => {
  try {
    const videoUrl = await getVideoUrl(url);
    ctx.replyWithVideo(videoUrl);
  } catch (err) {
    ctx.reply("Произошла ошибка :(");
  }
};
