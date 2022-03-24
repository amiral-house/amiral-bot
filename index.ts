import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { useTiktok } from "./src/modules/tiktok";
import { useHttpCat } from "./src/modules/http-cat";
import { useWoof } from "./src/modules/woof";

dotenv.config();

const PORT = Number(process.env.PORT) || 3002;
const DOMAIN = "https://amiral-bot.herokuapp.com";
const HOOK_PATH = "/bot-polling";

const isProd = process.env.NODE_ENV === "production";

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
    ctx.reply("Я люблю тебя!", {
      reply_to_message_id: ctx.message.message_id,
    });
});

bot.command("woof", (ctx) => {
  useWoof(ctx);
});

bot.hears(/я гей/gim, (ctx) => {
  ctx.reply("Да тут все геи, не только ты <3", {
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.hears(/^(https:\/\/(\w+\.)?tiktok.com\/)/, (ctx) =>
  useTiktok(ctx, ctx.message.text)
);

bot.hears(/^http (\d+)$/gim, (ctx) => {
  useHttpCat(ctx, Number(ctx.match[1]));
});

bot.hears(/^((\s*?)(а(\s*)ч(е|ё|о|у)+\??)(\s*?))+$/gim, (ctx) => {
  ctx.reply("А ниче, нормально общайся", {
    reply_to_message_id: ctx.message.message_id,
  });
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
