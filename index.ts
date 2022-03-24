import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { useTiktok } from "./src/modules/tiktok";
const isProd = process.env.NODE_ENV === "production";

dotenv.config();

const PORT = Number(process.env.PORT) || 3002;
const DOMAIN = "https://amiral-bot.herokuapp.com";
const HOOK_PATH = "/bot-polling";

const bot = new Telegraf(process.env.BOT_TOKEN || "");

bot
  .launch(
    isProd
      ? {
          webhook: {
            domain: DOMAIN,
            port: PORT,
            hookPath: HOOK_PATH,
          },
        }
      : undefined
  )
  .then(() => {
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

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
