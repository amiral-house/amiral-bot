import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || "");

bot.launch().then(() => {
  console.log("Bot started");
});

bot.command("start", (ctx) => {
  ctx.reply("Иди нахуй");
});

bot.on("text", (ctx) => {
  ctx.reply("Что ты там написал?");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
