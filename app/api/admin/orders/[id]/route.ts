import { NextRequest, NextResponse } from "next/server";
import { jsonError, logError } from "@/lib/errors";
import { requireAdminApi } from "@/lib/session";
import { updateOrderStatus } from "@/lib/services/orders";

export async function PATCH(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminApi();
    if (!auth.user) {
      return auth.response;
    }

    const { id } = await params;
    const body = await _request.json();
    const allowedStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
    const status = body?.status;
    if (!allowedStatuses.includes(status)) {
      return jsonError("Invalid status", 400);
    }

    const result = await updateOrderStatus(id, status);

    if (!result.ok) {
      if (result.error === "ORDER_NOT_FOUND") {
        return jsonError("Order not found", 404);
      }
      return jsonError("Invalid status", 400);
    }

    return NextResponse.json({ order: result.order });
  } catch (error) {
    logError("admin:orders:patch", error);
    return jsonError("Internal server error", 500);
  }
}
