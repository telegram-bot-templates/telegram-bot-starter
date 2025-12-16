/**
 * Layer 2: Commands
 * Business logic that validates inputs and orchestrates Layer 1 operations
 */

import { z } from "zod";
import { formatGreeting } from "../lib/greet";

// Input validation schema
const greetSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
});

type GreetInput = z.infer<typeof greetSchema>;

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
