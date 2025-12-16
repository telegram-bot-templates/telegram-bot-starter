import { z } from "zod";

export const greetSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
});

export type GreetInput = z.infer<typeof greetSchema>;
