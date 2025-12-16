#!/usr/bin/env tsx

/**
 * Layer 3: CLI Interface
 * Command-line interface for local testing
 * Only calls Layer 2 commands
 */

import chalk from "chalk";
import { Command } from "commander";
import { greet } from "../api/index";

const program = new Command();

// Styling helpers
const success = (text: string) => chalk.green("✓") + " " + chalk.white(text);
const error = (text: string) => chalk.red("✗") + " " + chalk.white(text);
const info = (text: string) => chalk.blue("ℹ") + " " + chalk.white(text);
const command = (text: string) => chalk.cyan(text);
const highlight = (text: string) => chalk.yellow(text);

// Error handler wrapper
function handleError(err: unknown) {
  if (err instanceof Error) {
    console.error(error(err.message));
  } else {
    console.error(error("An unknown error occurred"));
  }
  process.exit(1);
}

// Program setup
program
  .name("bot-cli")
  .description(chalk.bold("Telegram Bot CLI") + " - Local testing interface")
  .version("1.0.0");

// Greet command
program
  .command("greet")
  .description("Greet a user by name")
  .argument("<name>", "Name to greet")
  .action((name: string) => {
    try {
      const result = greet({ name });
      console.log(success(result.message));
    } catch (err) {
      handleError(err);
    }
  });

program.parse();
