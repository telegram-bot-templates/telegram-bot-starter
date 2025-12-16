/**
 * Layer 2: Commands
 * Business logic that validates inputs and orchestrates Layer 1 operations
 */

import { formatGreeting } from "../lib/greet";
import { greetSchema, type GreetInput } from "../schemas/greet";

export function greet(input: GreetInput) {
  // Validate input with Zod
  const validated = greetSchema.parse(input);

  // Call Layer 1 operation
  const greeting = formatGreeting(validated.name);

  return {
    success: true,
    message: greeting,
  };
}
