import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { useTiktok } from "./src/modules/tiktok";
import { musicSevices }  from "./src/modules/music";
import http from "http";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || "");

bot.launch().then(() => {
  console.log("Bot started");
});

bot.command("start", (ctx) => {
  if (ctx.message.from.username === "kosmonaff") {
    ctx.reply("Ты еблан и это не обсуждается!", {
      reply_to_message_id: ctx.message.message_id,
    });
  } else {
    ctx.reply("Я люблю тебя!", {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

bot.hears(/я гей/gim, (ctx) => {
  ctx.reply("Да тут все геи, не только ты <3", {
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.hears(/^(https:\/\/(\w+\.)?tiktok.com\/)/, (ctx) =>
  useTiktok(ctx, ctx.message.text)
);

bot.hears(/^(?:[^:]+:\/\/)?([^.\/?#]+\.)*([^.\/?#]+)\.([^.\/?#]+)(?:$|[\/?#])/gim, async (ctx) => {

  const musicSevicesClass = new musicSevices();
  const result = await musicSevicesClass.parseMusicMessage(ctx.message.text);
  ctx.reply(result, {
    reply_to_message_id: ctx.message.message_id,
  });
  
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

http
  .createServer(bot.webhookCallback("/secret-path"))
  .listen(process.env.PORT || 3001);
