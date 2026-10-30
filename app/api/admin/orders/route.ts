import { NextResponse } from "next/server";
import { jsonError, logError } from "@/lib/errors";
import { requireAdminApi } from "@/lib/session";
import { listOrders } from "@/lib/services/orders";

export async function GET() {
  try {
    const auth = await requireAdminApi();
    if (!auth.user) {
      return auth.response;
    }

    const { orders } = await listOrders({});

    return NextResponse.json({ orders });
  } catch (error) {
    logError("admin:orders:get", error);
    return jsonError("Internal server error", 500);
  }
}
