#!/usr/bin/env tsx

/**
 * Layer 3: Telegram Webhooks Interface
 * Production interface with webhooks
 * Only calls Layer 2 commands
 */

import "dotenv/config";
import express from "express";
import { Telegraf } from "telegraf";
import { registerHandlers } from "./telegram-handlers";

const token = process.env.TELEGRAM_BOT_API_KEY;
if (!token) {
  throw new Error("TELEGRAM_BOT_API_KEY environment variable is required");
}

const webhookDomain = process.env.WEBHOOK_DOMAIN;
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const bot = new Telegraf(token);
const app = express();

// Register shared handlers
registerHandlers(bot);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Webhook endpoint
app.use(bot.webhookCallback("/webhook"));

// Start server
app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);

  // Set webhook if domain is provided
  if (webhookDomain) {
    const webhookUrl = `${webhookDomain}/webhook`;
    await bot.telegram.setWebhook(webhookUrl);
    console.log(`Webhook set to: ${webhookUrl}`);
  } else {
    console.log(
      "Warning: WEBHOOK_DOMAIN not set. Webhook not configured automatically.",
    );
    console.log(
      "You'll need to set the webhook manually or add WEBHOOK_DOMAIN to .env",
    );
  }
});
