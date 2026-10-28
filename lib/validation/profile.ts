import { z } from "zod";
import { isValidWilayaCode } from "@/lib/wilayas";

// Algerian phone: 05/06/07XXXXXXXX or +2135/6/7XXXXXXXX
const PHONE_REGEX = /^(\+213|0)[567]\d{8}$/;

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Full name is required."),
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || PHONE_REGEX.test(value), {
      message:
        "Enter a valid Algerian phone number (e.g. 0555123456 or +213555123456).",
    }),
  wilaya: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidWilayaCode(value), {
      message: "Please select a valid wilaya.",
    }),
  city: z.string().trim(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type ProfileFieldErrors = Partial<Record<keyof ProfileInput, string>>;

export type ProfileValidation =
  | { success: true; data: ProfileInput }
  | { success: false; errors: ProfileFieldErrors };

export function validateProfile(input: unknown): ProfileValidation {
  const result = profileSchema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ProfileFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ProfileInput;
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}

export function validateProfileField(
  field: keyof ProfileInput,
  value: string
): string | undefined {
  const result = profileSchema.shape[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}
