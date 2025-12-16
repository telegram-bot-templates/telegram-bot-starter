#!/usr/bin/env tsx

/**
 * Layer 3: Telegram Polling Interface
 * Development interface with real Telegram using polling
 * Only calls Layer 2 commands
 */

import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { registerHandlers } from "./telegram-handlers";

dotenv.config();

const token = process.env.TELEGRAM_BOT_API_KEY;
if (!token) {
  throw new Error("TELEGRAM_BOT_API_KEY environment variable is required");
}

const bot = new Telegraf(token);

// Register shared handlers
registerHandlers(bot);

// Start polling
bot.launch().then(() => {
  console.log("Bot is running in polling mode...");
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
