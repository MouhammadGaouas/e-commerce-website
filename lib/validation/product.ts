import { z } from "zod";

export const productCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required.")
    .min(3, "Product name must be greater than 3 characters."),
  description: z.string().trim().min(1, "Description is required."),
  price: z.number().min(0, "Price must be greater than or equal to 0."),
  image: z.string().nullable().optional(),
  stock: z.int().min(0, "Stock cannot be negative."),
  category: z.string().trim().min(1, "Category is required."),
});

export const productUpdateSchema = z
  .object({
    name: z.string().trim().min(3, "Product name must be greater than 3 characters.").optional(),
    description: z.string().trim().min(1, "Description is required.").optional(),
    price: z.number().min(0, "Price must be greater than or equal to 0.").optional(),
    image: z.string().nullable().optional(),
    stock: z.int().min(0, "Stock cannot be negative.").optional(),
    category: z.string().trim().min(1, "Category is required.").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update.",
  });

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
