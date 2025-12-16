/**
 * Layer 3: Shared Telegram Handlers
 * Bot command handlers shared between polling and webhook interfaces
 * Only calls Layer 2 commands
 */

import { Telegraf } from "telegraf";
import { greet } from "../api/index";

export function registerHandlers(bot: Telegraf) {
  // /start command
  bot.start((ctx) => {
    ctx.reply(
      "Welcome! This is a demo bot.\n\nAvailable commands:\n/greet <name> - Get a greeting",
    );
  });

  // /greet command
  bot.command("greet", (ctx) => {
    try {
      // Extract name from command arguments
      const args = ctx.message.text.split(" ").slice(1);
      const name = args.join(" ");

      if (!name) {
        ctx.reply("Usage: /greet <name>");
        return;
      }

      // Call Layer 2 command
      const result = greet({ name });
      ctx.reply(result.message);
    } catch (error) {
      if (error instanceof Error) {
        ctx.reply(`Error: ${error.message}`);
      } else {
        ctx.reply("An error occurred");
      }
    }
  });
}
