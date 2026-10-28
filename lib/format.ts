export function formatDZD(amount: number | { toNumber(): number }): string {
  const value = typeof amount === "number" ? amount : Number(amount);
  return `د.ج ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatOrderDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
