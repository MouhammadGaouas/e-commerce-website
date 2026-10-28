import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product id is required."),
  quantity: z.int().min(1, "Quantity must be at least 1.").max(99, "Quantity is too high."),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
