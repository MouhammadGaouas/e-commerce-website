"use client";

import { useActionState } from "react";
import { changeOrderStatus } from "@/app/admin/actions";
import type { OrderStatus } from "@/generated/prisma/enums";

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [state, formAction, isPending] = useActionState(
    changeOrderStatus,
    { status: null, message: undefined }
  );

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <select
        name="status"
        defaultValue={status}
        disabled={isPending}
        aria-label="Order status"
        className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs font-medium text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
      >
        {ORDER_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-60 transition-colors"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
      {state.status === "error" && (
        <p className="text-xs text-red-400">{state.message}</p>
      )}
    </form>
  );
}
