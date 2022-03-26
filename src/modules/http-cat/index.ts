import axios from "axios";
import { Context } from "telegraf";

export const useHttpCat = (ctx: Context, code: number) => {
  if (code > 0 && code < 600) {
    ctx.replyWithPhoto(`https://http.cat/${code}`);
  }
};
