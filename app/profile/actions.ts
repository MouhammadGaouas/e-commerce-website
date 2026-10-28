"use server";

import { auth } from "@/lib/auth";
import { getSession } from "@/lib/session";
import {
  validateProfile,
  type ProfileFieldErrors,
} from "@/lib/validation/profile";
import { headers } from "next/headers";

export interface ProfileState {
  status: "success" | "error" | null;
  message?: string;
  errors?: ProfileFieldErrors;
}

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await getSession();
  if (!session?.user) {
    return {
      status: "error",
      message: "You must be signed in to update your profile.",
    };
  }

  const input = {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    wilaya: String(formData.get("wilaya") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
  };

  const result = validateProfile(input);

  if (!result.success) {
    return { status: "error", errors: result.errors };
  }

  try {
    await auth.api.updateUser({
      body: {
        name: result.data.name,
        phone: result.data.phone || undefined,
        wilaya: result.data.wilaya || undefined,
        city: result.data.city || undefined,
      },
      headers: await headers(),
    });
  } catch {
    return {
      status: "error",
      message: "Failed to update profile. Please try again.",
    };
  }

  return { status: "success", message: "Profile updated successfully." };
}
