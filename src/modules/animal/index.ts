import axios from "axios";
import { Context } from "telegraf";

export enum TYPE_ANIMAL {
  woof = '/woof',
  meow = '/meow',
}

const replyByUrl = (ctx: Context, url: string) => {
    if (/\.(jpe?g|png|gif)$/gi.test(url)) {
    ctx.replyWithPhoto(url, {
      reply_to_message_id: ctx.message?.message_id,
    });
  } else {
    ctx.replyWithVideo(url, {
      reply_to_message_id: ctx.message?.message_id,
    });
  }
}

export const useAnimal = async (ctx: Context, type: TYPE_ANIMAL) => {
  let url;
  if (type === TYPE_ANIMAL.woof) {
    const woof = await axios.get('https://random.dog/woof.json')
    url = woof.data.url;
  } else if (type === TYPE_ANIMAL.meow) {
    const meow = await axios.get('https://aws.random.cat/meow');
    url = meow.data.file;
  }

  replyByUrl(ctx, url);
};
