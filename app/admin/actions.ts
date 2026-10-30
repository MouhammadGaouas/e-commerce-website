"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { updateOrderStatus } from "@/lib/services/orders";
import type { OrderStatus } from "@/generated/prisma/enums";

export interface AdminOrderActionState {
  status: "success" | "error" | null;
  message?: string;
}

export async function changeOrderStatus(
  _prevState: AdminOrderActionState,
  formData: FormData
): Promise<AdminOrderActionState> {
  await requireAdmin();

  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;

  const result = await updateOrderStatus(orderId, status);

  if (!result.ok) {
    return {
      status: "error",
      message: result.error === "ORDER_NOT_FOUND" ? "Order not found." : "Invalid status.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/orders");

  return { status: "success", message: "Order status updated successfully." };
}
