import axios from "axios";
import { Context } from "telegraf";

export const useWoof = async (ctx: Context) => {
  const woof = await axios.get('https://random.dog/woof.json')
  const { data: { url } } = woof;
    if (/\.(jpe?g|png|gif)$/gi.test(url)) {
    ctx.replyWithPhoto(url, {
      reply_to_message_id: ctx.message?.message_id,
    });
  } else {
    ctx.replyWithVideo(url, {
      reply_to_message_id: ctx.message?.message_id,
    });
  }
};
