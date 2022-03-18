import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { useTiktok } from "./src/modules/tiktok";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || "");

bot.launch().then(() => {
  console.log("Bot started");
});

bot.command("start", (ctx) => {
  ctx.reply("Я люблю тебя");
});

bot.on("text", async (ctx) => {
  try {
    if (ctx.message.from.username === "kosmonaff") {
      ctx.reply("не гавкай. Если хочешь это убрать запушь фикс)", {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } catch (err) {}
});

bot.hears(/^(https:\/\/(\w+\.)?tiktok.com\/)/, (ctx) =>
  useTiktok(ctx, ctx.message.text)
);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
